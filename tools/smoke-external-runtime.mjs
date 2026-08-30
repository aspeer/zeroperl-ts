#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ZeroPerl } from "../dist/esm/index.js";

const runtimePath = resolve(process.argv[2] ?? "zeroperl.wasm");
const runtime = await readFile(runtimePath);
const perl = await ZeroPerl.create({
  fetch: async () => new Response(runtime, {
    headers: { "content-type": "application/wasm" },
  }),
});

let destroyCount = 0;
perl.registerFunction("external_destroy", async () => {
  await Promise.resolve();
  destroyCount += 1;
});

try {
  const setup = await perl.eval(`
    sub make_external_destroy_probe { bless {}, 'ExternalDestroyProbe' }
    package ExternalDestroyProbe;
    sub DESTROY { main::external_destroy() }
  `);
  assert.equal(setup.success, true, setup.error);

  for (let iteration = 1; iteration <= 10; iteration += 1) {
    const value = await perl.call("main::make_external_destroy_probe");
    assert(value, "Perl did not return the destruction probe");
    const released = value.dispose();
    assert.equal(typeof released?.then, "function", "async DESTROY did not return a promise");
    await released;
    assert.equal(destroyCount, iteration, "async DESTROY callback count did not advance");

    const followUp = await perl.eval(`
      die "destroy count mismatch\\n" unless ${iteration} == ${destroyCount};
      1;
    `);
    assert.equal(followUp.success, true, followUp.error);
  }

  console.log(`External runtime async ownership OK (${runtimePath}, 10 releases)`);
} finally {
  await perl.shutdown();
}

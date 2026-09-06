import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile, readFile, copyFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), "zeroperl npm space # "));
try {
  const [packed] = process.env.ZEROPERL_PACK_JSON ? JSON.parse(await readFile(resolve(root, process.env.ZEROPERL_PACK_JSON), "utf8")) : JSON.parse(execFileSync("npm", ["pack", "--ignore-scripts", "--json",
    "--cache", join(temporary, "cache"), "--pack-destination", temporary], {cwd: root, encoding: "utf8"}));
  if (process.env.ZEROPERL_PACK_JSON) {
    const source = resolve(root, process.env.ZEROPERL_PACK_JSON, '..', packed.filename);
    await copyFile(source, join(temporary, packed.filename));
  }
  const files = new Set(packed.files.map(({path}) => path));
  for (const file of ["LICENSE", "NOTICE", "README.md", "USAGE.md", "WEBDYNE.md", "dist/esm/index.js", "dist/cjs/index.cjs",
    "dist/cjs/package.json", "dist/esm/types/index.d.ts", "dist/cjs/types/index.d.ts",
    "dist/esm/zeroperl.wasm", "dist/cjs/zeroperl.wasm", "dist/runtime-manifest.json",
    "dist/third-party-notices.tar.gz", "dist/licenses/zeroperl-LICENSE"]) assert.ok(files.has(file), `Missing ${file}`);
  assert.ok([...files].every(path => path.startsWith("dist/") || ["LICENSE", "NOTICE", "README.md", "USAGE.md", "WEBDYNE.md", "package.json"].includes(path)));
  const modules = join(temporary, "node_modules/@aspeer");
  await mkdir(modules, {recursive: true});
  execFileSync("tar", ["-xzf", join(temporary, packed.filename), "-C", modules]);
  const {rename} = await import("node:fs/promises");
  await rename(join(modules, "package"), join(modules, "zeroperl-ts"));
  const body = `
const perl = await ZeroPerl.create();
try {
  perl.registerFunction('identity', value => value);
  let destroyed = 0;
  perl.registerFunction('pause', async () => { await Promise.resolve(); destroyed++; });
  const result = await perl.eval('die "identity" unless identity(42) == 42; package PackedProbe; sub DESTROY { main::pause() }; package main; our @a = (bless {}, "PackedProbe");');
  if (!result.success) throw new Error(result.error);
  const array = perl.getArrayVariable('a');
  await array.set(0, 42);
  if (destroyed !== 1) throw new Error('Packed asynchronous replacement failed');
  await array.dispose();
} finally { await perl.dispose(); }
`;

  await writeFile(join(temporary, "smoke.mjs"), `import { ZeroPerl } from '@aspeer/zeroperl-ts';\n${body}`);
  await writeFile(join(temporary, "smoke.cjs"), `const { ZeroPerl } = require('@aspeer/zeroperl-ts');\n(async () => {${body}})().catch(error => {console.error(error); process.exitCode=1});`);
  for (const file of ["smoke.mjs", "smoke.cjs"]) execFileSync(process.execPath, [join(temporary, file)], {stdio: "pipe"});
  for (const extension of ["mts", "cts"]) {
    await writeFile(join(temporary, `types.${extension}`), `import { ZeroPerl } from '@aspeer/zeroperl-ts';\nvoid ZeroPerl.create();`);
    execFileSync(process.execPath, [resolve(root, "node_modules/typescript/bin/tsc"), "--noEmit",
      "--strict", "--skipLibCheck", "false", "--module", "NodeNext", "--target", "ES2022",
      join(temporary, `types.${extension}`)], {encoding: "utf8"});
  }
  console.log(`Verified ${packed.id}: ${packed.files.length} files; Node ESM/CJS and NodeNext declarations from a path containing spaces and #.`);
} finally { await rm(temporary, {recursive: true, force: true}); }

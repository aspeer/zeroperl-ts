#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(await readFile(resolve(root, "runtime-manifest.json"), "utf8"));
const source = process.argv[2] || process.env.ZEROPERL_ARTIFACT_BASE_URL;
const artifacts = [
  ["zeroperl.wasm", manifest.artifacts.wasm],
  ["third-party-notices.tar.gz", manifest.artifacts.notices],
];

function verify(data, artifact, name) {
  const hash = createHash("sha256").update(data).digest("hex");
  if (data.length !== artifact.bytes || hash !== artifact.sha256) {
    throw new Error(`Runtime artifact size or checksum mismatch: ${name}`);
  }
}

// Validate every input before replacing either local artifact.
const verified = [];
for (const [name, artifact] of artifacts) {
  let data;
  if (!source) {
    try {
      data = await readFile(resolve(root, name));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      throw new Error(`Missing ${name}. Run npm run runtime:prepare -- /path/to/runtime/artifacts, or set ZEROPERL_ARTIFACT_BASE_URL.`);
    }
  } else if (/^https?:\/\//.test(source)) {
    const url = new URL(artifact.filename, source.endsWith("/") ? source : `${source}/`);
    const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
    if (!response.ok) throw new Error(`Unable to fetch ${url}: HTTP ${response.status}`);
    data = Buffer.from(await response.arrayBuffer());
  } else {
    data = await readFile(resolve(source, artifact.filename));
  }
  verify(data, artifact, name);
  verified.push([name, data]);
}
if (source) {
  for (const [name, data] of verified) await writeFile(resolve(root, name), data);
}
console.log(`Verified Perl ${manifest.perlVersion} build ${manifest.buildNumber} runtime and notices.`);

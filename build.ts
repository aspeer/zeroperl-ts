import { copyFile, cp, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const runtimeManifest = JSON.parse(await readFile("runtime-manifest.json", "utf8"));
for (const [path, expected] of [
  ["zeroperl.wasm", runtimeManifest.artifacts.wasm.sha256],
  ["third-party-notices.tar.gz", runtimeManifest.artifacts.notices.sha256],
]) {
  const actual = createHash("sha256").update(await readFile(path)).digest("hex");
  if (actual !== expected) throw new Error(`Runtime artifact checksum mismatch: ${path}`);
}

const shared = {
  entrypoints: ['index.ts'],
  sourcemap: 'inline' as const,
  minify: true,
};

const results = await Promise.all([
  Bun.build({
    ...shared,
    outdir: 'dist/esm',
    format: 'esm',
    target: 'browser',
    naming: {
      entry: '[name].js',
      chunk: '[name].js',
      asset: '[name].[ext]',
    },
  }),
  Bun.build({
    ...shared,
    outdir: 'dist/cjs',
    format: 'cjs',
    target: 'node',
    naming: {
      entry: '[name].cjs',
      chunk: '[name].cjs',
      asset: '[name].[ext]',
    },
  }),
]);

for (const result of results) {
  if (!result.success) throw new AggregateError(result.logs, "Bundle build failed");
}

await copyFile("runtime-manifest.json", "dist/runtime-manifest.json");
await copyFile("third-party-notices.tar.gz", "dist/third-party-notices.tar.gz");
await cp("licenses", "dist/licenses", { recursive: true });

// NodeNext must identify the CommonJS declaration tree as CommonJS.
await writeFile("dist/cjs/package.json", '{"type":"commonjs"}\n');

export {};
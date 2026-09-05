# Verification

The TypeScript bridge suite covers:

- JavaScript/Perl values, calls, projections, and registered callbacks;
- synchronous and genuinely asynchronous Asyncify paths;
- synchronous and asynchronous Perl destruction;
- independent file descriptor offsets and directory enumeration;
- normalized paths and preopen escape rejection; and
- generated CommonJS, ESM, declaration, and bundled WASM outputs.
- direct initialization from a precompiled `WebAssembly.Module` without a
  loader or global WebAssembly patch.

Run `bun test` for the suite and `npm run build` to regenerate and type-check
the distributions.

`npm run smoke:external-runtime -- /path/to/zeroperl.wasm` loads an arbitrary
compatible artifact through the public custom-fetch option. It repeatedly
releases a Perl object whose `DESTROY` method awaits a JavaScript host callback,
then evaluates more Perl to prove Asyncify returned to its normal state.


## First-release regression checks

`bun test` includes `release.test.ts` for large-number conversion, prototype
keys, random buffers, 64-bit clock results, split UTF-8 output and HTTP loader
errors. `npm run build && npm run pack:check` validates an actual tarball in an
isolated path with spaces and `#`, runs Node ESM/CJS, and checks NodeNext `.mts`
and `.cts` consumers without skipLibCheck.

The following are separate, currently failing release gates. Run in separate
processes because they can corrupt the interpreter:

```sh
bun tools/check-release-blockers.ts borrowed-return
bun tools/check-release-blockers.ts async-overwrite
```

A green ordinary test suite does not override these gates. Both must pass with
the newly built release WASM before publication.

Release-review builds used Bun 1.4.0; CI pins the same bundler version so
its generated-output check uses the qualified toolchain.

## Callback and replacement release gates

After `npm run build`, run `npm run test:lifecycle` for the bundled binary or
`node tools/check-runtime-lifecycle.mjs /absolute/path/to/candidate.wasm` for
each runtime candidate. The 24 checks include borrowed identity, fresh return
ownership and destructor counts, expired/transferred wrappers, callback
rejection, foreign interpreter values, all asynchronous replacements, and
synchronous fast paths. CI runs this suite after building.

`tools/check-package.mjs` exercises callback identity and asynchronous array
replacement from both extracted ESM and CommonJS packages, and type-checks
NodeNext consumers without skipLibCheck.

## Source-only checkout validation (2026-09-05)

- Standalone build/declaration checks, 160 Bun tests, 24 lifecycle checks and
  installed npm ESM/CJS/NodeNext package checks passed using local build 1 artifacts.
- Runtime preparation passed isolated checks for missing inputs, local import,
  existing artifact verification, checksum rejection without replacing outputs,
  and mocked HTTP success/404 responses. A real local HTTP listener was blocked
  by the execution sandbox; hosted artifact retrieval remains to be verified.
- The runtime repository's virtual WASM resolver builds from a temporary bridge
  checkout containing no WASM or dist files; output matches its existing compiled
  bridge byte for byte.

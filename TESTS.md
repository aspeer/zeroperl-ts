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

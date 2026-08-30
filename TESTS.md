# Verification

The TypeScript bridge suite covers:

- JavaScript/Perl values, calls, projections, and registered callbacks;
- synchronous and genuinely asynchronous Asyncify paths;
- synchronous and asynchronous Perl destruction;
- independent file descriptor offsets and directory enumeration;
- normalized paths and preopen escape rejection; and
- generated CommonJS, ESM, declaration, and bundled WASM outputs.

Run `bun test` for the suite and `npm run build` to regenerate and type-check
the distributions.

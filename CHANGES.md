# Changes

## 1.1.2

- Consolidated architecture and verification documentation; removed obsolete
  development plans, release diaries and historical qualification reports.
- Runtime code, tests and the pinned WASM artifact are unchanged.

## Milestone 1: bridge consolidation

- Added a hybrid synchronous/Asyncify export dispatcher.
- Made destructive wrapper operations safely awaitable.
- Kept registered host callbacks synchronous unless they actually suspend.
- Corrected WASI open flags, path capabilities, descriptor offsets, and
  directory enumeration.
- Updated the bundled runtime to the verified Perl 5.44.0 WebDyne artifact.
- Renamed the private local package to `@aspeer/zeroperl-ts` and added direct
  `WebAssembly.Module` initialization for Cloudflare Workers.
- Added an external-runtime ownership smoke and passed asynchronous `DESTROY`
  cleanup followed by further evaluation on Perl 5.18.4, 5.24.4, 5.36.3, and
  5.44.0 artifacts.

## Bridge correctness improvements

Added public npm packaging checks for extracted ESM, CJS and
NodeNext consumers. Fixed large-number conversion, prototype keys, escaped WASM
paths, UTF-8 output, WASI random/clock handling and argv allocation. Documented
the existing Perl call error contract. The C/Asyncify callback ownership and
replacement defects are repaired together with the runtime. Borrowed callback arguments expire when callbacks settle;
owned returned wrappers transfer to Perl. Setters preserve their synchronous
path and become awaitable when replacement destroys an object asynchronously.
Foreign-interpreter values are rejected before entering WASM.

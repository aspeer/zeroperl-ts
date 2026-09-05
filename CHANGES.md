# Changes

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

## First-release review (unreleased)

Prepare public npm packaging and test the extracted archive with ESM, CJS and
NodeNext consumers. Fix large-number conversion, prototype keys, escaped WASM
paths, UTF-8 output, WASI random/clock handling, argv allocation, and document the existing Perl call error contract. The C/Asyncify callback ownership and replacement defects are repaired together
with the runtime. Borrowed callback arguments expire when callbacks settle;
owned returned wrappers transfer to Perl. Setters preserve their synchronous
path and become awaitable when replacement destroys an object asynchronously.
Foreign-interpreter values are rejected before entering WASM. See RELEASE-REVIEW.md
for candidate qualification and remaining release actions. Existing package version is retained pending qualification.

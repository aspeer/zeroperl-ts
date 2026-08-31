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

# Changes

## Milestone 1: bridge consolidation

- Added a hybrid synchronous/Asyncify export dispatcher.
- Made destructive wrapper operations safely awaitable.
- Kept registered host callbacks synchronous unless they actually suspend.
- Corrected WASI open flags, path capabilities, descriptor offsets, and
  directory enumeration.
- Updated the bundled runtime to the verified Perl 5.44.0 WebDyne artifact.

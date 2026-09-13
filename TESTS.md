# Verification

## Source and regression tests

Prepare the manifest-matched runtime as described in [README.md](README.md), then run:

```sh
bun test --timeout 30000
node --test t.js/*.test.mjs
```

The bridge suite covers JavaScript/Perl values, calls, callbacks, synchronous and
asynchronous destruction, Asyncify, precompiled module loading, file descriptors,
directory enumeration and preopen escape rejection. `release.test.ts` covers
numeric conversion, prototype keys, random buffers, clock results, UTF-8 output
and loader errors. `t.js/` checks release helpers and staging-input integrity
using temporary repositories and local remotes.

## Generated package checks

```sh
npm run build
npm run test:lifecycle
npm run test:asyncify
npm run pack:check
```

The build generates ESM, CommonJS and declarations. Package checks inspect an
actual tarball in a path containing spaces and `#`, exercise installed ESM/CJS
consumers, and type-check NodeNext consumers without `skipLibCheck`. CI pins the
bundler version in its workflow.

Lifecycle checks cover borrowed identity, ownership transfer, destructor counts,
expired wrappers, callback rejection, foreign interpreter values, asynchronous
replacement and synchronous fast paths. Asyncify checks exercise repeated yields,
scalar/list results, host allocations and rejected callbacks.

To qualify another compatible runtime after building the bridge:

```sh
node tools/check-runtime-lifecycle.mjs /absolute/path/to/candidate.wasm
npm run test:asyncify -- /absolute/path/to/candidate.wasm
npm run smoke:external-runtime -- /absolute/path/to/candidate.wasm
```

The external-runtime smoke repeatedly destroys a Perl object whose destructor
awaits a host callback, then evaluates more Perl to verify recovery.

Focused ownership reproducers remain useful for isolating a faulty binary.
Run each in a separate process:

```sh
bun tools/check-release-blockers.ts borrowed-return
bun tools/check-release-blockers.ts async-overwrite
```

## Acceptance limits

Use the exact intended runtime for release qualification. Bridge tests do not
certify browser compatibility, Cloudflare streaming lifetimes, disconnect recovery
or other provider behavior. Run installed-package acceptance in each supported
host; the WebDyne runtime repository owns its Worker acceptance fixtures.

See [RELEASING.md](RELEASING.md) for artifact preparation and staging requirements.

# Bridge architecture

## Runtime and package boundaries

The canonical TypeScript source implements the JavaScript/Perl bridge and WASI
host. The WebDyne runtime repository owns the Perl WASM build and provider
adapters. The standalone package supports ESM, CommonJS and declarations, and
accepts a precompiled `WebAssembly.Module` for hosts such as Cloudflare Workers.

The repository tracks source, tests, the runtime manifest and licences.
`runtime:prepare` imports WASM and attribution artifacts with size and SHA-256
verification. Generated distributions remain outside Git. See [README.md](README.md)
for source setup and [RELEASING.md](RELEASING.md) for release procedures.

## Asynchronous calls and ownership

Bridge calls remain synchronous when no suspension occurs and return a promise
when Perl reaches an asynchronous JavaScript callback. Destructive operations
return `MaybePromise` so callers can await cleanup.

Callback arguments are borrowed wrappers valid until the callback settles.
Returning one is supported: the runtime retains its SV before destroying the
argument wrappers. Independent return handles transfer ownership to Perl and
invalidate the JavaScript wrapper. Values from another interpreter and borrowed
reference-count changes are rejected.

Array/hash `set()` and `setVariable()` retain temporary values and C strings
until replacement and asynchronous `DESTROY` finish. Ordinary replacements keep
the synchronous path. Serialize interpreter entry and dispose owned wrappers
before reset or teardown. Direct operations do not promise tied or overloaded
magic support; use `eval()` or `call()`. See [USAGE.md](USAGE.md#compatibility-notes).

## Asyncify stack restoration

Keep the suspended C stack pointer during the host promise, restore the original
root pointer when re-entering the export, and restore the suspended pointer when
the rewound host import stops rewind. Restore the root on export exit.

Exported C wrappers reuse the context address written by the resumed callback.
Their stack setup does not restore the global stack pointer needed by the
resumed continuation. Both restores are necessary for valid result handles and
rejected-callback recovery. The regression runners are described in [TESTS.md](TESTS.md).

## WASI filesystem boundaries

Path normalization must not permit `..` to escape a configured preopen.
Repeated opens receive independent descriptor offsets, and directory reads use
WASI-compatible cookies and dirents. This is a focused WASI host; application
portability depends on the interfaces it implements and the selected runtime.

## Compatibility scope

Browser, Worker, Deno and Windows consumers need acceptance checks in their
actual host when claiming support. Bridge lifecycle tests alone do not establish
provider request-lifetime behavior. Runtime dependencies are locked by the
owning Perl repository; this does not imply that the entire build toolchain is
reproducibly pinned.

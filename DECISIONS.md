# ZeroPerl TypeScript decisions

## D001: Use the local canonical package namespace

Superseded for the first public release: the bridge remains named
`@aspeer/zeroperl-ts` and is prepared for public npm distribution. Local
checkouts and tarballs remain supported for development. ESM, CommonJS,
declarations, the bundled WASM, and attribution are verified from the packed
archive. Publication itself still requires maintainer approval.

## D002: Hybrid Asyncify API

Bridge calls stay synchronous when no suspension occurs and return a promise
only when Perl reaches an asynchronous JavaScript callback. Destructive calls
are typed as `MaybePromise` so callers can safely await cleanup.

## D003: WASI preopens are capability boundaries

Path normalization must not permit `..` to escape a configured preopen.
Repeated opens receive independent descriptor offsets, and directory reads use
WASI-compatible cookies and dirents.

## D004: Accept precompiled WebAssembly modules

Cloudflare Workers provide imported Wasm as `WebAssembly.Module`. The public
creation options accept that module directly so consumers do not patch global
WebAssembly APIs or emulate `fetch` responses.

## Callback ownership and replacement completion

Callback arguments are borrowed wrappers valid until the host callback settles.
Returning one is supported: C retains its SV before destroying the argument
wrappers. Independent return handles transfer their existing owned reference
to Perl; the bridge invalidates the transferred wrapper and rejects values from
another interpreter. This avoids both an alias use-after-free and a leaked
reference on newly allocated returns. Borrowed reference-count changes are rejected.

Array/hash `set()` and `setVariable()` return `MaybePromise<void>`. They retain
temporary values and C strings until replacement and any asynchronous DESTROY
finish. Ordinary replacements preserve their synchronous return. Direct bridge
operations do not promise tied/overloaded magic support; use eval/call for that.

## Keep suspended C frames intact through rewind

Saving the C stack pointer only during the host promise is insufficient.
Re-entering the export to rewind can set up C arguments before saved WASM
locals are restored, overwriting an older Perl JMPENV near the root stack.
Keep the pointer below suspended frames until the rewind call returns, then
restore the root pointer. Rejected callbacks are part of the release matrix.

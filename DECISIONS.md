# ZeroPerl TypeScript decisions

## D001: Use the local canonical package namespace

The consolidated bridge is named `@aspeer/zeroperl-ts`, is private, and is
consumed from the local filesystem. It is not published to npm or loaded from
a CDN. The upstream authorship and license remain recorded in package metadata.

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

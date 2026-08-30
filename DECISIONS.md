# ZeroPerl TypeScript decisions

## D001: Preserve the package namespace for Milestone 1

The package remains `@6over3/zeroperl-ts`. Renaming a public package is a
separate compatibility and publication decision.

## D002: Hybrid Asyncify API

Bridge calls stay synchronous when no suspension occurs and return a promise
only when Perl reaches an asynchronous JavaScript callback. Destructive calls
are typed as `MaybePromise` so callers can safely await cleanup.

## D003: WASI preopens are capability boundaries

Path normalization must not permit `..` to escape a configured preopen.
Repeated opens receive independent descriptor offsets, and directory reads use
WASI-compatible cookies and dirents.

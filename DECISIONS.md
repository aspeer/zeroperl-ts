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

Use the suspended C stack pointer during the host promise, the original root
pointer when re-entering the export, and the suspended pointer again when the
rewound host import stops rewind. Restore the root on export exit.

Exported C wrappers must reuse the context address written by the resumed
callback. Their stack setup does not restore the global stack pointer needed
by the resumed C continuation. Omitting either restore causes invalid result
handles or breaks rejected-callback recovery. This supersedes the earlier
policy of retaining the suspended pointer throughout export re-entry.
The regression covers all three supported Perl versions without C changes.

## Keep generated runtime artifacts outside Git

The bridge repository tracks its canonical TypeScript source, runtime manifest
and license files. The owning `aspeer/zeroperl` build supplies versioned WASM
and attribution artifacts. `runtime:prepare` imports both with size and SHA-256
verification; generated distributions remain local. Standalone npm package
contents remain unchanged. GitHub CI obtains artifacts from the configured
`ZEROPERL_ARTIFACT_BASE_URL`; runtime publication is a separate maintainer step.


## Project releases through paired tags and npm staging

The project version identifies a source release; Perl versions identify its
build variants. A prefixed annotated tag triggers the release workflow and a
matching annotated v tag is an alias. Both must match the version at the same
main commit. A local helper increments the patch version and creates the tag
pair; CI does not mutate source, allocate versions, or approve npm publication.
The inspected tarball is submitted using npm stage publish with stage-only
OIDC permission. The maintainer approves in npm. This supersedes independent
Perl build numbering and the previous two-workflow/manual artifact transfer.

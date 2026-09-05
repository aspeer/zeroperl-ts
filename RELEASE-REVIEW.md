# First release review — 2026-09-05

Preparation is on `codex/first-release-review`, from the latest implementation
baseline `d471917`, as requested. No push, merge or publication has occurred.
The existing package version `1.1.0` is retained; local runtime build numbers
are candidates and do not decide the first public runtime package version.

## Correctness changes

- Borrowed callback arguments expire when callbacks settle; returning one works.
  Independent return wrappers transfer their owned reference to Perl and become
  invalid in JavaScript. The C return path avoids both use-after-free and an
  extra retained reference.
- Array/hash `set()` and `setVariable()` keep temporary resources through
  asynchronous destruction and return `MaybePromise<void>`. Ordinary setters
  retain their synchronous path.
- Values from another interpreter are rejected before callback returns, setters,
  collection conversion, or `call()` can pass their pointers into WASM.
- Asyncify preserves live C stack frames through the wait and the rewind call.
  This fixes a rejected-callback trap found on the older Perl matrix.
- The runtime fixes paired XS/Perl companion versions, deferred scalar cleanup
  on Perl 5.18, and an invalid free of static longjmp scratch memory.

Prior review fixes also cover large-number conversion, prototype keys, package
loading and HTTP diagnostics, streaming UTF-8, WASI random/clock handling,
empty C strings, argv memory growth, and NodeNext declaration resolution.

## Artifacts and verification

The package carries its runtime manifest, matching attribution evidence archive,
runtime MIT source license, and exact SDK 27 toolchain notices in `dist`.
The build checks the bundled WASM and attribution archive against the manifest.
The evidence archive is intentionally broad and stored once for both module
formats; it can be curated before publication to reduce package size.

The ordinary suite passes 160 tests. The 24 targeted lifecycle checks cover
identity, transfer, exact destructor counts, rejection, expired wrappers,
foreign values, and synchronous/asynchronous replacement. CI runs these checks
after building. Packed ESM/CJS execution and strict NodeNext consumer checks
also cover callback identity and asynchronous replacement.

Final build 5 passes all 24 lifecycle checks on Perl 5.44.0, 5.36.3 and 5.18.4,
alongside core/static-XS smoke, 11 C ABI cases and ten external async releases.
The final 45-file bridge npm tarball passes ESM/CJS and strict NodeNext checks
on Node 22, 24 and 26. The runtime's extracted 38-file tarball passes the same
24 lifecycle checks. See the runtime repository's RELEASE-REVIEW.md for details.

## Before publication

Finish the user's other release changes; bring the reviewed source/generated
artifacts together on main; update the runtime's TypeScript gitlink; make the
configured public source/submodule URL accessible; and regenerate final
artifacts from the final source refs. Current manifests identify dirty local
candidate sources. None of those remote or publication actions was performed.

Review the broad attribution inventory and any advertised browser, Worker,
Deno and Windows support before release. Direct getters/conversions/collections
do not promise tied or overloaded Perl magic support: use eval/call for those
operations. Serialize interpreter entry and dispose wrappers before reset or
interpreter teardown.

## Locked CPAN runtime refresh

The bundled runtime, manifest and attribution archive now use qualified Perl
5.44.0 local build 6 from the runtime repository's Carton snapshot pipeline.
Its eight XS module versions match the snapshot; 24 lifecycle checks pass.
The refreshed bridge passes 160 tests, its build and actual npm package check.
The output notice archive was repaired for duplicate inventory entries and
reverified before copying. Nothing was published or merged.

## Main preparation

The bridge is refreshed from runtime build 8, including the approved base XS
modules. Its build, 160 tests, 24 lifecycle checks and 47-file npm package check
pass. The runtime repository pins the bridge implementation commit; a later
bridge commit may refresh bundled release artifacts without changing that
implementation. This avoids a circular source-reference dependency between
the runtime gitlink and the bridge's runtime manifest. npm publication remains
disabled pending the user's approval.

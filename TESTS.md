# Verification

## Current qualification (2026-09-06)

The bundled Perl 5.44.0 build 1 includes WebDyne 3.026. Its manifest pins clean
runtime source `b08c545` and bridge implementation `7e91d2c`. Declaration/bundle
builds, 160 Bun tests (266 assertions), 24 lifecycle checks, 100 Asyncify re-entry
rounds and the 47-file installed npm ESM/CJS/NodeNext package check pass.

The runtime also enables Cloudflare `enable_request_signal` so canceling a
long-lived SSE response releases its session instead of blocking the persistent
interpreter. Custom Wrangler configurations must enable the same flag. The subsequently
approved hosted replay with the exact final binary passes sustained stream
lifetimes, 100 overlap rounds, 20 forced disconnects and another 20 recovery
rounds. See the runtime repository's RELEASE-QUALIFICATION.md for evidence
and limits; hosted storage was not exercised.
The maintainer accepts the independently reproduced abrupt-WebSocket-disconnect
warning when subsequent clients remain healthy.

Local main integration is authorized after final checks. Pushes and npm
publication remain paused. Public artifact hosting, source accessibility and
publisher configuration still need verification before publication. The older
entries below preserve the investigation history and are superseded by this
qualification where they describe previous artifacts or blockers.


The TypeScript bridge suite covers:

- JavaScript/Perl values, calls, projections, and registered callbacks;
- synchronous and genuinely asynchronous Asyncify paths;
- synchronous and asynchronous Perl destruction;
- independent file descriptor offsets and directory enumeration;
- normalized paths and preopen escape rejection; and
- generated CommonJS, ESM, declaration, and bundled WASM outputs.
- direct initialization from a precompiled `WebAssembly.Module` without a
  loader or global WebAssembly patch.

Run `bun test` for the suite and `npm run build` to regenerate and type-check
the distributions.

`npm run smoke:external-runtime -- /path/to/zeroperl.wasm` loads an arbitrary
compatible artifact through the public custom-fetch option. It repeatedly
releases a Perl object whose `DESTROY` method awaits a JavaScript host callback,
then evaluates more Perl to prove Asyncify returned to its normal state.


## First-release regression checks

`bun test` includes `release.test.ts` for large-number conversion, prototype
keys, random buffers, 64-bit clock results, split UTF-8 output and HTTP loader
errors. `npm run build && npm run pack:check` validates an actual tarball in an
isolated path with spaces and `#`, runs Node ESM/CJS, and checks NodeNext `.mts`
and `.cts` consumers without skipLibCheck.

The following are historical reproductions of repaired release blockers. Run
them in separate processes when testing an older, potentially faulty binary:

```sh
bun tools/check-release-blockers.ts borrowed-return
bun tools/check-release-blockers.ts async-overwrite
```

A green ordinary test suite does not override these gates. Both must pass with
the newly built release WASM before publication.

Release-review builds used Bun 1.4.0; CI pins the same bundler version so
its generated-output check uses the qualified toolchain.

## Callback and replacement release gates

After `npm run build`, run `npm run test:lifecycle` for the bundled binary or
`node tools/check-runtime-lifecycle.mjs /absolute/path/to/candidate.wasm` for
each runtime candidate. The 24 checks include borrowed identity, fresh return
ownership and destructor counts, expired/transferred wrappers, callback
rejection, foreign interpreter values, all asynchronous replacements, and
synchronous fast paths. CI runs this suite after building.

`tools/check-package.mjs` exercises callback identity and asynchronous array
replacement from both extracted ESM and CommonJS packages, and type-checks
NodeNext consumers without skipLibCheck.

## Source-only checkout validation (2026-09-05)

- Standalone build/declaration checks, 160 Bun tests, 24 lifecycle checks and
  installed npm ESM/CJS/NodeNext package checks passed using local build 1 artifacts.
- Runtime preparation passed isolated checks for missing inputs, local import,
  existing artifact verification, checksum rejection without replacing outputs,
  and mocked HTTP success/404 responses. A real local HTTP listener was blocked
  by the execution sandbox; hosted artifact retrieval remains to be verified.
- The runtime repository's virtual WASM resolver builds from a temporary bridge
  checkout containing no WASM or dist files; output matches its existing compiled
  bridge byte for byte.

## Asyncify re-entry qualification (2026-09-05)

The corrected bridge passes 160 Bun tests and installed ESM/CJS/NodeNext
package checks. `tools/check-asyncify-reentry.mjs` in the TypeScript repository
passes 100 rounds per binary on Perl 5.18.4, 5.36.3 and 5.44.0 (local build 1),
covering scalar/list return handles, repeated yields, host allocations and
rejected callbacks. All 24 lifecycle checks pass for each binary. The runtime
bridge was regenerated and its 17 JavaScript tests pass. No WASM rebuild is
needed for this bridge-only correction.

Run `npm run build`, then `npm run test:asyncify -- /absolute/path/to/runtime.wasm`
in the TypeScript repository. Cloudflare overlap stability remains a separate
release gate; these bridge checks do not certify provider request lifetimes.


## Tag-triggered staging verification

Release-helper integration tests use temporary Git repositories and local bare
remotes: patch selection, clean-main enforcement, paired annotated tags,
alias conflicts/mismatches, package-lock updates and no implicit push. Staging
input integrity tests reject changed tarball bytes without registry access.
Runtime metadata additionally checks project-version consistency across Perl
variants. Workflow/action and shell lint pass.

The runtime package builder produced a 1.0.1 package from the previously
qualified 5.44 binary using a manifest with releaseVersion. The pinned npm
11.19.1 staging command passed --dry-run; it did not upload. The standalone
bridge passes 167 Bun tests and installed ESM/CJS/NodeNext checks against the
exact already-packed archive. No interpreter changes or WASM recompilation were
needed for these workflow/metadata changes. A real tagged GitHub/OIDC staging
run remains to be exercised after the maintainer initiates the release push.

# ZeroPerl TypeScript implementation plan

- [x] Consolidate the WebDyne bridge behaviour in this canonical repository.
- [x] Validate the bundled Perl 5.44.0 standard artifact and generated outputs.
- [x] Exercise asynchronous ownership with each supported runtime artifact
  from `zeroperl`.
- [x] Rename the private canonical package to `@aspeer/zeroperl-ts` for local
  filesystem consumption.
- [x] Add first-class `WebAssembly.Module` loading for Worker runtimes.
- [x] Integrate the canonical local package with the Worker and browser hosts.

Public npm packaging is now requested. Pushes and publication require separate approval.


## First release review (2026-09-05)

Release-review branch: `codex/first-release-review`, based on `d471917`.
No main branch exists on the configured TypeScript remote; create it only after
release gates and a separately approved merge.

- [x] Repair numeric conversion, prototype keys, WASM loading paths, UTF-8 output,
  random_get chunking, clock result layout, and declaration resolution.
- [x] Build and validate the actual npm tarball with Node ESM/CJS and NodeNext.
- [x] Replace local-only installation documentation with npm instructions.
- [x] Resolve C host callback ownership and async replacement defects.
- [x] Qualify rebuilt binaries and preserve checked attribution evidence.
- [ ] Finalize public source access and release source refs.

See RELEASE-REVIEW.md and BACKLOG.md for remaining findings.

## Runtime blocker fixes (authorized 2026-09-05)

- [x] Define borrowed callback arguments and ownership transfer of returned values.
- [x] Retain mutation resources until asynchronous replacement completes.
- [x] Qualify callback identity, transfer, rejection and replacement regressions with rebuilt WASM.
- [x] Refresh bundled artifacts and generated code; verify packed consumers.
- [x] Reconcile artifact inventory and attribution. No publishing or merging.

## Compact source repository (2026-09-05)

- [x] Remove generated distributions and runtime binaries from Git tracking.
- [x] Add checksum-verified runtime preparation for local development and CI.
- [ ] Host matching artifacts and configure the CI artifact base URL.
- [ ] Back up and rewrite binary history, only with separate approval.

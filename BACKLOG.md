# Release backlog

The callback ownership, replacement, older-Perl cleanup and Asyncify rewind
blockers are repaired. All three supported build 8 runtimes are qualified.
See RELEASE-REVIEW.md for evidence and the publication checklist.

- Complete authorized local main integration; retain the runtime gitlink at the
  tested bridge implementation and the manifest at its clean runtime build source.
- Make public source/submodule URLs accessible and choose public release versions.
- Optionally curate the broad attribution archive (about 19 MB for 5.44) to
  reduce npm download size while retaining every required component notice.
- Extend lifetime enforcement to wrappers used after reset/disposal, overlapping
  or recursive interpreter entry, and pending asynchronous cleanup.
- Add explicitly supported tied/overloaded magic APIs where needed; use eval/call
  for those operations with the current direct-value API.
- Consolidate fd_open/path_open and complete the documented WASI limitations.
- Run real browser, Worker, Deno and Windows installed-package acceptance.
- CPAN distributions are locked by the runtime repository; full toolchain pinning remains optional.

- [x] Repair mixed SSE/WebSocket memory corruption with the three-phase
  Asyncify stack restoration; qualify all supported Perl versions.
- [x] Resolve the original overlapping-request Cloudflare context cancellation
  with the runtime provider waitUntil correction; local Perl 5.44.0 checks pass.
- [x] Isolate forced WebSocket termination and qualify earlier 3.026 hosted
  stream lifetimes; the maintainer accepts the independent upstream warning.
- [x] Repeat hosted checks with the final rebuilt package after upload approval;
  lifetime, overlap and disconnect recovery pass.

- Host the manifest-matched WASM and notices artifacts from `aspeer/zeroperl`
  and configure the bridge repository's `ZEROPERL_ARTIFACT_BASE_URL` Actions
  variable. Fresh-checkout CI requires these external artifacts.
- Separately approve and perform backed-up Git history cleanup to remove old
  `dist/`, `zeroperl.wasm` and `third-party-notices.tar.gz` objects from remote
  history; ordinary removal commits do not reclaim historical storage.

# Release backlog

The callback ownership, replacement, older-Perl cleanup and Asyncify rewind
blockers are repaired. All three supported build 8 runtimes are qualified.
See RELEASE-REVIEW.md for evidence and the publication checklist.

- Finish the user's other release changes; align main branches, final source
  refs and the runtime's bridge gitlink before building publication artifacts.
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

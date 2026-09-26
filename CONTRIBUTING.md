# Contributing to the ZeroPerl TypeScript Bridge

Bug reports and focused contributions are welcome. Search the
[GitHub issues](https://github.com/aspeer/zeroperl-ts/issues) before opening a
new one, and include a minimal reproduction where possible.

Fork the [GitHub repository](https://github.com/aspeer/zeroperl-ts), create a
topic branch, keep changes focused, and submit a GitHub pull request. Prepare
the matching runtime artifacts, then run the normal checks before submitting:

```sh
npm ci
npm run runtime:prepare -- /path/to/runtime/artifacts
npm test
npm run build
npm run pack:check
```

See [TESTS.md](TESTS.md) for the full verification paths. Do not publish npm
packages or create release tags as part of a contribution.

Do not include credentials or private data. Report potential vulnerabilities
privately as described in [SECURITY.md](SECURITY.md).

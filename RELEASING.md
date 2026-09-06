# Preparing a TypeScript bridge release

The standalone bridge uses package.json as its version source and has its own
release sequence, independent of the WebDyne runtime packages. On clean main:

```sh
make release
```

The helper fetches GitHub tags, checks main, increments the patch version,
updates package.json and package-lock.json, commits them, and creates matching
annotated `aspeer-zeroperl-ts_1.1.1` and `v1.1.1` tags (from the current 1.1.0
baseline). It prints an atomic push command for main and those two tags. It
never pushes or stages anything itself. To choose an explicit newer version:

```sh
RELEASE_VERSION=1.2.0 make release
```

`.github/workflows/release.yml` builds distributions once, tests the bridge,
checks lifecycle and Asyncify behavior, packs once, validates installed ESM/CJS
and NodeNext consumers from that exact archive, and stages it. Configure npm
Trusted Publishing for **release.yml** in **aspeer/zeroperl-ts**, stage-only,
with no GitHub environment. The ordinary CI workflow does not stage packages.

Before releasing, update runtime-manifest.json to the intended qualified
runtime and configure ZEROPERL_ARTIFACT_BASE_URL in GitHub Actions variables.
The URL must serve the exact WASM and notices filenames/checksums in the
manifest. The release workflow downloads and verifies these artifacts; it
never substitutes a newer unpinned runtime or rebuilds Perl. Artifact hosting
is still an external setup step. The WebDyne runtime package includes its own
bridge and does not depend on publication of this standalone npm package.

## Staging and approval

The workflow uses Node 24 and npm 11.19.1. Configure an npm trusted publisher
for the GitHub repository and the workflow filename below, with permission to
run **npm stage publish only**. CI receives OIDC credentials; no npm token is
needed. Do not enable direct publishing permission. There is no automated
approve/reject command and no fallback to direct publishing.

The package name must already exist in npm. If it does not, the workflow stops
with a bootstrap message. See [npm staging prerequisites](https://docs.npmjs.com/staged-publishing/).
Initial package creation requires a separately approved publication.

Review the candidate in npm's Staged Packages tab and approve it with 2FA when
ready. The workflow summary records the package, source commit, integrity and
npm staging result. An upload to staging does not make the version public.

Published versions are refused before staging. Pending staged versions share
npm's version-uniqueness constraint. Stage-only OIDC credentials cannot list
pending candidates, so a rerun that reaches an already staged version fails
clearly; inspect the existing candidate in npm. CI never silently treats an
unverified existing candidate as a successful upload or replaces it. If source
changes are needed, prepare a new version and new tag pair. A failed build can
be rerun at the same tag; retries do not increment the version.

Both tags must be annotated, match the committed version, and point at the
same commit reachable from GitHub main. Only the project-prefixed tag triggers
the release workflow; the conventional v tag is an alias. Ordinary branch
pushes and documentation changes do not stage anything. For manual retries,
select the existing canonical tag in Run workflow; dispatching main is refused.

Builds and package consumers are tested before staging the exact inspected
archive. Packages and checksums remain available as GitHub Actions artifacts;
there is no automatic public GitHub Release announcement. Download artifacts
before their retention expires (npm candidate: 30 days for runtime, 90 days
for TypeScript; runtime binary bundle: 90 days).

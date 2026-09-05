# WebDyne integration

This fork is the TypeScript bridge used by the WebDyne ZeroPerl runtime. Its
bundled Perl 5.44.0 WASM comes from
[aspeer/zeroperl](https://github.com/aspeer/zeroperl), which includes the WebDyne
and PAGI dependencies. The current deployment focus is Cloudflare Workers;
other WASM providers may be supported later.

For a WebDyne application, use the runtime package and deployment instructions
in the runtime repository's [WEBDYNE.md](https://github.com/aspeer/zeroperl/blob/main/WEBDYNE.md).
The bridge package by itself is an interpreter API; it does not provide the
application deployment CLI. General bridge installation and API instructions
are in [USAGE.md](USAGE.md).

## Bridge changes supporting the integration

The consolidation includes precompiled `WebAssembly.Module` loading, WASI
filesystem/path handling, synchronous and asynchronous callback dispatch, and
safe ownership/disposal across asynchronous destructors. These facilities
support WebDyne's request runtime while remaining available to other Perl
embedders. See [DECISIONS.md](DECISIONS.md), [CHANGES.md](CHANGES.md), and the
compatibility notes in [USAGE.md](USAGE.md#compatibility-notes).

## Cloudflare WASM loading

Cloudflare Workers may pass their module-rule import without a loader shim:

```typescript
import zeroperlModule from './zeroperl.wasm';
import { ZeroPerl } from '@aspeer/zeroperl-ts';

const perl = await ZeroPerl.create({ wasmModule: zeroperlModule });
```


Use the qualified Asyncify runtime. The pre-Asyncify reactor is not
interchangeable with it. When updating the bundled runtime, keep `zeroperl.wasm`,
`runtime-manifest.json`, and `third-party-notices.tar.gz` from the same qualified
artifact set, then run:

```sh
npm run build
npm test
npm run test:lifecycle
npm run pack:check
```

These are maintainer checks for source changes on main. Applications install
the runtime and bridge packages from npm; the WebDyne runtime guide above
covers Cloudflare deployment.

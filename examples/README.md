# Runnable bridge examples

These examples use the public `@webdyne/webdyne-zeroperl-ts` API against this checkout's
built package. Start with Hello Perl, then choose the capability you need.

| Example | Demonstrates |
| --- | --- |
| [Hello Perl](hello-perl/README.md) | Evaluation, output, errors and cleanup |
| [Data exchange](data-exchange/README.md) | Nested objects, scalar/list results and owned values |
| [Virtual filesystem](virtual-filesystem/README.md) | A separate Perl script, arguments, input and generated output |
| [Async host functions](async-host-functions/README.md) | Awaited callbacks, rejection and ownership |
| [Browser](browser/README.md) | A local editor with real browser WASM loading |
| [Lifecycle](lifecycle/README.md) | Async destruction, reset and awaited teardown |
| [Cloudflare Worker](cloudflare-worker/README.md) | Precompiled WASM and a request-local interpreter |

## Setup

Use Node.js/npm and Bun (the repository's existing build and test runner).
From the repository root:

```sh
npm ci
npm run runtime:prepare
npm run build
```

`runtime:prepare` verifies the local WASM and notices against the tracked manifest.
If they are missing, obtain the matching artifacts as described in the
[root README](../README.md#working-from-source), then run:

```sh
npm run runtime:prepare -- /absolute/path/to/runtime/artifacts
npm run build
```

Building generates local `dist/` files; it does not create an npm tarball,
publish a package or deploy anything. Rebuild after changing bridge source.
No host Perl installation is needed to run these examples.

The command-line examples use Bun to execute TypeScript directly. Their package
imports resolve through the root package's exports to the local build, so there
is no need to install a published bridge version or import internal source.
Keep this directory inside the checkout when following these instructions.

## Run and check

Every subdirectory has its own command, expected output and suggested experiment.
The command-line examples require no external services. Run all five with:

```sh
for example in hello-perl data-exchange virtual-filesystem async-host-functions lifecycle; do
    bun "examples/$example/main.ts" || break
done
```

Type-check the TypeScript examples after building:

```sh
./node_modules/.bin/tsc -p examples/tsconfig.json
```

Browser and Worker instructions include separate manual acceptance steps. A
command-line pass does not establish browser or Worker behavior. The Worker
example is a local bridge demonstration; full WebDyne/PAGI application setup
belongs in the [WebDyne runtime guide](../WEBDYNE.md).

All examples serialize interpreter entry, check Perl errors, and await cleanup.
See [USAGE.md](../USAGE.md#compatibility-notes) for the complete ownership contract.

## Local verification

Verified on macOS with Bun 1.4.0 and the manifest-matched Perl 5.44.0 build 1:
all five command-line examples, TypeScript checking, browser greeting/error/recovery,
and the Worker greeting/404/405 routes under local Wrangler 4.131.1.
No hosted Worker deployment was performed. The lifecycle README describes the
current runtime's `END` limitation.

# Cloudflare Worker

Complete the [shared setup](../README.md#setup). From the repository root, start
a local Worker using the pinned Wrangler version:

```sh
npm exec --yes --package=wrangler@4.131.1 -- wrangler dev --local --ip 127.0.0.1 --port 8787 --config examples/cloudflare-worker/wrangler.jsonc
```

The first invocation downloads Wrangler if it is not cached. This runs the local
Workers runtime without deployment or service bindings. Keep this terminal open.
In another terminal:

```sh
curl -sS 'http://127.0.0.1:8787/?name=Alice'
curl -sS 'http://127.0.0.1:8787/'
curl -i 'http://127.0.0.1:8787/missing'
curl -i -X POST 'http://127.0.0.1:8787/'
```

Expect `{"greeting":"Hello, Alice!"}`, then `{"greeting":"Hello, World!"}`,
then HTTP 404 and HTTP 405 respectively. Stop Wrangler with Ctrl-C.

The Worker imports the package's WASM as a precompiled module and passes it as
`wasmModule`. See Cloudflare's [WASM import documentation](https://developers.cloudflare.com/workers/runtime-apis/webassembly/javascript/)
and [Wrangler configuration reference](https://developers.cloudflare.com/workers/wrangler/configuration/).
The `nodejs_compat` flag accommodates the bridge bundle's Node loader branch;
`wasmModule` bypasses that loader at runtime.

Only the compiled module is shared. Each request creates its own interpreter,
passes the name as a value, and awaits value/interpreter disposal before finishing
the response. User input is never evaluated as Perl source. There are no remote
resources, secrets or database dependencies.

These instructions validate local execution only. Hosted execution, plan limits
and request-lifetime behavior require separate qualification before deployment.
For a complete WebDyne application, follow [WEBDYNE.md](../../WEBDYNE.md).

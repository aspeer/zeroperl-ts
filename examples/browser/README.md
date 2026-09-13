# Browser playground

Complete the [shared setup](../README.md#setup), then run from the repository root:

```sh
bun examples/browser/serve.ts
```

Open [http://127.0.0.1:8788](http://127.0.0.1:8788) and click **Run Perl**.
The output should be `Hello from your browser!`, with status **Finished**.
Change the greeting and run again. Try `die "demo error";`: the status should
be **Failed**, with the Perl error visible. Restore the greeting and verify a
subsequent run succeeds. Stop the server with Ctrl-C.

The server binds to loopback and serves only the demo files and the generated
ESM/WASM assets. An import map resolves the public package name to the built
bridge. The explicit `fetch` option loads `/zeroperl.wasm` from the same server;
no CDN or browser bundler is needed. Use HTTP, not a `file://` URL.

Each click creates and disposes a fresh interpreter. The Run button stays
disabled through cleanup; output is appended as text. The demo executes on the
browser's main thread: an infinite loop can freeze the page, and this example
does not provide cancellation. Use small snippets and reload the tab if needed.
For a responsive long-running editor, move interpreter execution into a Web Worker.

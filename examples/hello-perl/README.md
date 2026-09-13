# Hello Perl

From the repository root, complete the [shared setup](../README.md#setup) once.
Then run:

```sh
bun examples/hello-perl/main.ts
```

Expected output:

```text
Hello from Perl!
```

Change the greeting in `main.ts`, or replace the Perl code with `die "demo error"` to see the error path. Output is explicitly flushed; interpreter cleanup runs in `finally` even when evaluation fails.

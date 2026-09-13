# Data exchange

From the repository root, complete the [shared setup](../README.md#setup) once.
Then run:

```sh
bun examples/data-exchange/main.ts
```

Expected output:

```text
Total: 30
{"customer":"Alice","total":30}
ready, paid
```

Change the quantities in `order` and run again. JSON key order may vary. `PerlValue.project()` converts scalar values; `getHashVariable().project()` converts the flat summary hash. The example passes nested data directly, calls Perl in scalar and list context, and releases each owned wrapper before interpreter disposal. It checks `getLastError()` after every `call()` because a fulfilled promise does not by itself mean Perl succeeded.

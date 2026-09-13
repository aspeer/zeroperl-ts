# Virtual filesystem

From the repository root, complete the [shared setup](../README.md#setup) once.
Then run:

```sh
bun examples/virtual-filesystem/main.ts
```

Expected output:

```text
everywhere: 1
here: 1
perl: 2
runs: 2
```

Edit `input.txt` and run again. JavaScript loads that file and `report.pl` into memory; Perl receives virtual input/output paths through `@ARGV`. JavaScript retrieves the generated report. `/report.txt` exists only in the virtual filesystem; no report is written to your host filesystem. The root preopen exposes this in-memory tree, not your computer's root. See [report.pl documentation](report.pl.md) for the script interface.

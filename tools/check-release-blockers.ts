// Run each probe in a fresh process: a failed ABI call can poison the instance.
import { ZeroPerl } from "../index";
const selected = process.argv[2];
if (!["borrowed-return", "async-overwrite"].includes(selected ?? "")) {
    throw new Error("Usage: bun tools/check-release-blockers.ts borrowed-return|async-overwrite");
}
const perl = await ZeroPerl.create();
if (selected === "borrowed-return") {
    perl.registerFunction("identity", value => value);
    const result = await perl.eval('die "identity mismatch" unless identity(42) == 42;');
    if (!result.success) throw new Error(result.error);
} else {
    perl.registerFunction("pause", async () => { await new Promise(resolve => setTimeout(resolve, 1)); });
    const result = await perl.eval('package D; sub DESTROY { main::pause() }; package main; our @a=(bless {}, "D");');
    if (!result.success) throw new Error(result.error);
    const array = perl.getArrayVariable("a")!;
    await array.set(0, 0);
    const next = await perl.eval("1");
    if (!next.success) throw new Error(next.error);
    await array.dispose();
}
await perl.dispose();
console.log(`${selected}: release gate passed`);

import { test, expect } from "bun:test";
import { ZeroPerl, MemoryFileSystem } from "./index";
import { useClock } from "./wasi/features/clock";
import { useRandom } from "./wasi/features/random";
import { useStdio } from "./wasi/features/fd";
import { WASIAbi } from "./wasi/abi";

test("large JavaScript numbers survive conversion", async () => {
    const perl = await ZeroPerl.create();
    try {
        for (const number of [2147483648, 4294967296, -2147483649, Number.MAX_SAFE_INTEGER]) {
            const value = perl.toPerlValue(number);
            expect(value.project()).toBe(number);
            await value.dispose();
        }
        const hash = perl.createHash(JSON.parse('{"__proto__":"kept","constructor":42}'));
        expect(JSON.stringify(hash.project())).toContain('"__proto__":"kept"');
        await hash.dispose();
    } finally { await perl.dispose(); }
});

test("filesystem treats prototype names as ordinary paths", () => {
    const fs = new MemoryFileSystem();
    expect(fs.lookup("/constructor")).toBeNull();
    for (const name of ["__proto__", "constructor", "toString"]) {
        fs.addFile(`/data/${name}`, "contents");
        expect(fs.lookup(`/data/${name}`)?.type).toBe("file");
        fs.addFile(`/${name}/child`, "contents");
        expect(fs.lookup(`/${name}/child`)?.type).toBe("file");
    }
});

test("WASI fills large random buffers and complete clock results", () => {
    const memory = new ArrayBuffer(140000);
    const view = new DataView(memory);
    const abi = new WASIAbi();
    const random = useRandom({}, abi, () => view) as Record<string, Function>;
    expect(random.random_get!(0, 131072)).toBe(0);
    expect(new Uint8Array(memory, 65536, 65536).some(byte => byte !== 0)).toBe(true);
    const clock = useClock({}, abi, () => view) as Record<string, Function>;
    view.setBigUint64(0, 0xffffffffffffffffn, true);
    expect(clock.clock_res_get!(WASIAbi.WASI_CLOCK_REALTIME, 0)).toBe(0);
    expect(view.getBigUint64(0, true)).toBe(1000000n);
});

test("stdout preserves UTF-8 characters split across writes", () => {
    let output = "";
    const view = new DataView(new ArrayBuffer(100));
    const io = useStdio({ stdout: data => { output += data; } })({}, new WASIAbi(), () => view) as Record<string, Function>;
    view.setUint32(0, 20, true);
    view.setUint32(4, 1, true);
    for (const byte of new TextEncoder().encode("π")) {
        view.setUint8(20, byte);
        expect(io.fd_write!(1, 0, 1, 8)).toBe(0);
    }
    expect(output).toBe("π");
});

test("WASM fetch failures retain the HTTP diagnostic", async () => {
    await expect(ZeroPerl.create({fetch: async () => new Response("missing", {status: 404})})).rejects.toThrow("WASM fetch failed: 404");
});


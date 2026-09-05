import { WASIAbi } from "../abi.js";
import type { WASIOptions } from "../options.js";

/**
 * Create a feature provider that provides `random_get` with `crypto` APIs as backend by default.
 */
export function useRandom(_options: WASIOptions, _abi: WASIAbi, memoryView: () => DataView): WebAssembly.ModuleImports {
    return {
        random_get: (bufferOffset: number, length: number) => {
            const view = memoryView();
            const buffer = new Uint8Array(view.buffer, bufferOffset, length);
            for (let offset = 0; offset < buffer.length; offset += 65536) {
                crypto.getRandomValues(buffer.subarray(offset, offset + 65536));
            }
            return WASIAbi.WASI_ESUCCESS;
        },
    };
}
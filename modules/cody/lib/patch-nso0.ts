import { nsopatchInspect } from "./nsopatch-inspect.ts";
import { nsopatchParser } from "./nsopatch-parser.ts";
import { filetendo } from "../deps.ts";

export function patchNSO0(nso0: filetendo.SourceNSO0, patch: string, section: ".ro" | ".text" | ".data") {
    const patches = nsopatchParser(patch);
    const targetSection = section === ".data" ? nso0.sections.data
                            : section === ".text" ? nso0.sections.text
                            : nso0.sections.ro;

    for (const patch of patches) {
        console.log(`[patchNSO0]: ${section}: ${nsopatchInspect(patch)}`);

        for (let i = 0; i < patch.code.length; i++) {
            const targetAddress = patch.address + i;

            if (targetAddress > targetSection.length) throw new Error(`${section} is invalid, wrong patch?`);

            targetSection[targetAddress] = patch.code[i];
        }
    }
}
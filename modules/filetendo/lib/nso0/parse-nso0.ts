import type { ParsedNSO0 } from "./types.ts";

import { unpackNSO0Header } from "./unpack-header.ts";
import { parseFlags } from "./parse-flags.ts"
import { decode } from "../text.ts";
import { hashy } from "../../deps.ts";
import { lz4y } from "../../deps.ts";

const ModuleNameOffset = 0x100

export async function parseNSO0(data: Uint8Array) {
    // @ts-ignore .
    const nso0: ParsedNSO0 = {
        offsets: { // @ts-ignore .
            file: {}, // @ts-ignore .
            memory: {}, // @ts-ignore .
            extra: {}, // @ts-ignore .
        },

        // @ts-ignore .
        sizes: {}, // @ts-ignore .
        hash: {}, // @ts-ignore .
        flags: {},

        sections: { // @ts-ignore .
            text: {}, // @ts-ignore .
            ro: {}, // @ts-ignore .
            data: {} // @ts-ignore .
        }
    };

    const header = unpackNSO0Header(data);
    const expectedLength = header.DataFileOffset + header.DataFileSize;

    if (data.length < expectedLength) throw new Error("NSO body is too small, corrupted NSO?");

    nso0.version = header.Version;
    nso0.flags = parseFlags(header.Flags);

    nso0.offsets.file.text = header.TextFileOffset;
    nso0.offsets.memory.text = header.TextMemoryOffset;
    nso0.sizes.text = header.TextSize;

    nso0.offsets.file.ro = header.RoFileOffset;
    nso0.offsets.memory.ro = header.RoMemoryOffset;
    nso0.sizes.ro = header.RoSize;

    nso0.offsets.file.data = header.DataFileOffset;
    nso0.offsets.memory.data = header.DataMemoryOffset;
    nso0.sizes.data = header.DataSize;

    nso0.sizes.bss = header.BssSize;
    nso0.id = header.ModuleId;

    nso0.offsets.extra.embedded = header.EmbeddedOffset;
    nso0.sizes.embedded = header.EmbeddedSize;

    nso0.offsets.extra.dynStr = header.DynStrOffset;
    nso0.sizes.dynStr = header.DynStrSize;

    nso0.offsets.extra.dynSym = header.DynSymOffset;
    nso0.sizes.dynSym = header.DynSymSize;

    nso0.hash.text = hashy.parseSHA256(header.TextHash);
    nso0.hash.ro = hashy.parseSHA256(header.RoHash);
    nso0.hash.data = hashy.parseSHA256(header.DataHash);

    if (nso0.flags.UseZbicCompression) throw new Error("Unsupported zstd-based compression");

    nso0.sections.text.raw = data.slice(header.TextFileOffset, header.TextFileOffset + header.TextFileSize);
    nso0.sections.ro.raw = data.slice(header.RoFileOffset, header.RoFileOffset + header.RoFileSize);
    nso0.sections.data.raw = data.slice(header.DataFileOffset, header.DataFileOffset + header.DataFileSize);

    nso0.name = decode(data.slice(ModuleNameOffset, ModuleNameOffset + header.ModuleNameSize));

    nso0.sections.text.decompressed = nso0.flags.TextCompress ? lz4y.decompress(nso0.sections.text.raw) : nso0.sections.text.raw;
    nso0.sections.ro.decompressed = nso0.flags.RoCompress ? lz4y.decompress(nso0.sections.ro.raw) : nso0.sections.ro.raw;
    nso0.sections.data.decompressed = nso0.flags.DataCompress ? lz4y.decompress(nso0.sections.data.raw) : nso0.sections.data.raw;

    const actualTextHash = await hashy.calculateSHA256(nso0.sections.text.decompressed);
    const actualRoHash = await hashy.calculateSHA256(nso0.sections.ro.decompressed);
    const actualDataHash = await hashy.calculateSHA256(nso0.sections.data.decompressed);

    if (actualTextHash.hex !== nso0.hash.text.hex) throw new Error("Text section hashes don't match, corrupted .text section?");
    if (actualRoHash.hex !== nso0.hash.ro.hex) throw new Error("RO section hashes don't match, corrupted .ro section?");
    if (actualDataHash.hex !== nso0.hash.data.hex) throw new Error("Data section hashes don't match, corrupted .data section?");

    return nso0;
}
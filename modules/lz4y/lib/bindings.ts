import { way } from "../deps.ts";

const dll = import.meta.dirname ? way.join(import.meta.dirname, "../../../assets/Ninpatch-Native.dll") : way.join("./assets/Ninpatch-Native.dll");

console.log(dll);

export const lib = Deno.dlopen(dll, {
    LZ4_Compress: {
        parameters: ["pointer", "i32", "pointer", "i32"],
        result: "i32",
    },
    LZ4_MaxCompressedSize: {
        parameters: ["i32"],
        result: "i32",
    },
});
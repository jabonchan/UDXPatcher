import { toWString } from "./wstring.ts";

const user32 = Deno.dlopen("user32", {
    MessageBoxW: {
        result: "i32", parameters: [ "pointer", "pointer", "pointer", "u32" ]
    }
});

export function MessageBox(type: "error" | "ok" | "warning", title: string, text: string) {
    const textW = toWString(text);
    const titleW = toWString(title);

    let flags = 0;

    switch (type) {
        case "error":
            flags = 0x10; // MB_ICONERROR
            break;
        case "warning":
            flags = 0x30; // MB_ICONWARNING
            break;
        case "ok":
            flags = 0x40; // MB_ICONINFORMATION
            break;
    }

    return user32.symbols.MessageBoxW(
        null,
        textW,
        titleW,
        flags,
    );
}
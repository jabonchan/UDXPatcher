export function toWString(text: string) {
    const buffer = new ArrayBuffer((text.length + 1) * 2);
    const view = new Uint16Array(buffer);

    view.fill(0x00);

    for (let i = 0; i < text.length; i++) {
        view[i] = text.charCodeAt(i);
    }

    return Deno.UnsafePointer.of(buffer);
}

export function fromWString(ptr: Deno.PointerValue): string {
    if (!ptr) return "";

    const view = new Deno.UnsafePointerView(ptr);

    const chars: number[] = [];
    let offset = 0;

    while (true) {
        const char = view.getUint16(offset); // UTF-16LE

        if (char === 0)
            break;

        chars.push(char);
        offset += 2;
    }

    return String.fromCharCode(...chars);
}
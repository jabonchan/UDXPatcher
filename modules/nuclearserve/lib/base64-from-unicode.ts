export function base64FromUnicode(value: string): string {
    const bytes = new TextEncoder().encode(value);
    let binary = "";

    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        const slice = bytes.subarray(i, i + chunk);
        binary += String.fromCharCode(...slice);
    }

    return btoa(binary);
}
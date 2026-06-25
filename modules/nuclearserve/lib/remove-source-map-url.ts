const regex = /\/\/# sourceMappingURL=.*\r?\n?/g;

export function removeSourceMapUrl(code: string): string {
    return code.replace(regex, "");
}
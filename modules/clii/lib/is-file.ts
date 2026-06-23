export async function isFile(path: string) {
    try {
        return (await Deno.stat(path)).isFile;
    } catch {
        return false;
    }
}
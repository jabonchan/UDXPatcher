import { way } from "../deps.ts";

export function isDir(path: string) {
    path = way.normalize(path);

    if (way.isRelative(path)) {
        path = way.join(Deno.cwd(), path);
    }

    try {
        return Deno.statSync(path).isDirectory;
    } catch {
        return false;
    }
}
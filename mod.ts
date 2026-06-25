import { NuclearServer } from "./modules/nuclearserve/lib/class/nuclear-server.ts";
import { isFile } from "./lib/is-file.ts";
import { isDir } from "./lib/is-dir.ts";
import { way } from "./deps.ts";

import * as filetendo from "./modules/filetendo/mod.ts";
import * as cody from "./modules/cody/mod.ts";

type paths = ".sectext" | ".secro" | ".secdata" | ".nsotext" | ".nsoro" | ".nsodata" | "main" | "output" | "romfs";
type patches = ".nsotext" | ".nsoro" | ".nsodata";
type sections = ".sectext" | ".secro" | ".secdata";

let mode: "hardware" | "emulator" = "hardware";
let debug: boolean = false;

const tid = "0100ea80032ea000";
const pathsType = [ ".sectext", ".secro",  ".secdata", ".nsotext", ".nsoro", ".nsodata", "main", "output", "romfs" ] as paths[];
const sectionsType = [ ".sectext", ".secro", ".secdata" ] as sections[];
const patchesType = [ ".nsotext", ".nsoro", ".nsodata" ] as patches[];
const patchesObj: Record<patches, string | null> = { ".nsotext": null, ".nsoro": null, ".nsodata": null };
const pathsObj: Record<Exclude<paths, patches>, string | null> = {
    ".sectext": null,
    ".secro": null,
    ".secdata": null,

    "main": null,
    "output": null,
    "romfs": null
}

new NuclearServer({
    assets: way.join(import.meta.dirname ?? "./", "./assets/web")
}, {
    onError(err: unknown) {
        console.error(err);
        Deno.exit(1);
    },

    onRequest() {
        return null;
    },

    onAPI: {
        "set-debug": function setDebug(call) {
            const flag = !!call.body.json;

            if (isFile("./debug")) return { body: "Can't use debug as a directory", status: 400 };

            debug = flag;
            return { body: null, status: 200 };
        },

        "set-mode": function setMode(call) {
            if (call.body.json !== "hardware" && call.body.json !== "emulator") {
                return {
                    body: "Invalid output mode",
                    status: 400
                }
            }

            mode = call.body.json;

            return {
                body: null,
                status: 200
            }
        },

        "set-path": function filePath(call) {
            const entry = call.body.json;

            console.log(entry);
            if (entry === null || typeof entry !== "object" || !("type" in entry) || !("path" in entry) || typeof entry.path !== "string" || typeof entry.type !== "string" || !pathsType.includes(entry.type as paths)) {
                return {
                    body: "Invalid path",
                    status: 400
                }
            }

            const type = entry.type as paths;

            try {
                if (type.startsWith(".nso")) { // it means is .nsotext, .nsoro or .nsodata
                    if (!patchesType.includes(type as patches)) throw new Error("Invalid path");

                    const source = Deno.readTextFileSync(entry.path);
                    cody.nsopatchParser(source);

                    patchesObj[type as patches] = source;

                    return {
                        body: null,
                        status: 200
                    }
                }

                if (type === "main") {
                    if (!isFile(entry.path)) throw new Error("Invalid path");

                    pathsObj.main = entry.path;

                    return {
                        body: null,
                        status: 200
                    }
                }

                if (type.startsWith(".sec")) { // it means is .sectext, .secro or .secdata
                    if (!sectionsType.includes(type as sections) || !isFile(entry.path)) throw new Error("Invalid path");
                    pathsObj[type as sections] = entry.path;

                    return {
                        body: null,
                        status: 200
                    }
                }


                if (type === "output") {
                    if (!isDir(entry.path) ||
                        isFile(way.join(entry.path, "./atmosphere/contents")) ||
                        isFile(way.join(entry.path, "./atmosphere/contents", tid)) ||
                        isFile(way.join(entry.path, "./atmosphere/contents", tid, "./exefs")) ||
                        isDir(way.join(entry.path, "./atmosphere/contents", tid, "./exefs/main")) ||

                        isFile(way.join(entry.path, "./mods")) ||
                        isFile(way.join(entry.path, "./mods/contents")) ||
                        isFile(way.join(entry.path, "./mods/contents", tid)) ||
                        isFile(way.join(entry.path, "./mods/contents", tid, "./New Super Mario Bros. U - UDXPatch")) ||
                        isFile(way.join(entry.path, "./mods/contents", tid, "./New Super Mario Bros. U - UDXPatch/exefs")) ||
                        isDir(way.join(entry.path, "./mods/contents", tid, "./New Super Mario Bros. U - UDXPatch/exefs/main"))) {
                            throw new Error("Invalid path");
                        }

                    pathsObj.output = entry.path;

                    return {
                        body: null,
                        status: 200
                    }
                }

                if (type === "romfs") {
                    if (isFile(entry.path) || !isDir(entry.path)) throw new Error("Invalid path");
                    pathsObj.romfs = entry.path;

                    return {
                        body: null,
                        status: 200
                    }
                }

                throw new Error("Invalid path");
            } catch(e: unknown) {
                return {
                    body: (e as Error).message,
                    status: 400
                }
            }
        },

        async compile() {
            try {
                if (!pathsObj.main || !pathsObj.output) throw new Error("Missing required fields");

                const parsedNSO0 = await filetendo.parseNSO0(await Deno.readFile(pathsObj.main));
                const sourceNSO0 = filetendo.convertParsedNSO0ToSourceNSO0(parsedNSO0);

                if (debug) {
                    if (isDir("./debug")) await Deno.remove("./debug", { recursive: true });
                    await Deno.mkdir("./debug");

                    await Deno.writeFile("./debug/text.bin", sourceNSO0.sections.text);
                    await Deno.writeFile("./debug/ro.bin", sourceNSO0.sections.ro);
                    await Deno.writeFile("./debug/data.bin", sourceNSO0.sections.data);
                }

                if (pathsObj[".sectext"]) cody.extpatchNSO0(sourceNSO0, await Deno.readFile(pathsObj[".sectext"]), ".text");
                if (pathsObj[".secro"]) cody.extpatchNSO0(sourceNSO0, await Deno.readFile(pathsObj[".secro"]), ".ro");
                if (pathsObj[".secdata"]) cody.extpatchNSO0(sourceNSO0, await Deno.readFile(pathsObj[".secdata"]), ".data");
                
                if (patchesObj[".nsotext"]) cody.patchNSO0(sourceNSO0, patchesObj[".nsotext"], ".text");
                if (patchesObj[".nsodata"]) cody.patchNSO0(sourceNSO0, patchesObj[".nsodata"], ".data");
                if (patchesObj[".nsoro"]) cody.patchNSO0(sourceNSO0, patchesObj[".nsoro"], ".ro");

                if (debug) {
                    await Deno.writeFile("./debug/text-patched.bin", sourceNSO0.sections.text);
                    await Deno.writeFile("./debug/ro-patched.bin", sourceNSO0.sections.ro);
                    await Deno.writeFile("./debug/data-patched.bin", sourceNSO0.sections.data);
                }
                
                const encodedNSO0 = await filetendo.craftNSO0(sourceNSO0);

                await Deno.mkdir(mode === "hardware" ?
                    way.join(pathsObj.output, "./atmosphere/contents/", tid, "./exefs") :
                    way.join(pathsObj.output, "./mods/contents/", tid, "./New Super Mario Bros. U - UDXPatch/exefs"),
                    { recursive: true }
                )
                
                await Deno.writeFile(mode === "hardware" ?
                    way.join(pathsObj.output, "./atmosphere/contents", tid, "./exefs/main",) :
                    way.join(pathsObj.output, "./mods/contents", tid, "./New Super Mario Bros. U - UDXPatch/exefs/main"),
                    encodedNSO0
                )

                if (pathsObj.romfs) await Deno.rename(pathsObj.romfs,
                    mode === "hardware" ?
                        way.join(pathsObj.output, "./atmosphere/contents", tid, "./exefs/romfs") :
                        way.join(pathsObj.output, "./mods/contents", tid, "./New Super Mario Bros. U - UDXPatch/exefs/romfs")
                )

                return { body: null, status: 200 };
            } catch(e: unknown) {
                return {
                    body: (e as Error).message,
                    status: 400
                }
            }
        }
    },

    onListen(addr) {
        console.log("Listening on", addr);

        const worker = new Worker("file://" + way.join(import.meta.dirname ?? Deno.cwd(), "./assets/worker/main.ts"), { type: "module" });
        
        worker.onmessage = (ev) => {
            if (ev.data === "Ready") worker.postMessage(`http://${addr.hostname}:${addr.port}`);
            else Deno.exit(0);
        }
    }
})
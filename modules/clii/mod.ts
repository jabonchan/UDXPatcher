import { BrowseFile, BrowseFolder } from "./lib/browse.ts";
import { resolveArgv } from "./lib/resolve-args.ts";
import { MessageBox } from "./lib/bindings.ts";
import { way } from "./deps.ts";
import { isFile } from "./lib/is-file.ts";

export * from "./lib/bindings.ts";
export * from "./lib/browse.ts";

const args = resolveArgv();

if (!args.noGUI && !args.roPatch) {
    MessageBox("ok", "UDXPatcher", "Select a RO static patch (Optional)");
    args.roPatch = await BrowseFile([ "nsoro" ]);
}

if (!args.noGUI && !args.dataPatch) {
    MessageBox("ok", "UDXPatcher", "Select a DATA static patch (Optional)");
    args.dataPatch = await BrowseFile([ "nsodata" ]);
}

if (!args.noGUI && !args.textPatch) {
    MessageBox("ok", "UDXPatcher", "Select a TEXT static patch (Optional)");
    args.textPatch = await BrowseFile([ "nsotext" ]);
}

if (!args.noGUI && !args.roSection) {
    MessageBox("ok", "UDXPatcher", "Select a RO section patch (Optional)");
    args.roPatch = await BrowseFile([ "secro" ]);
}

if (!args.noGUI && !args.dataSection) {
    MessageBox("ok", "UDXPatcher", "Select a DATA section patch (Optional)");
    args.dataPatch = await BrowseFile([ "secdata" ]);
}

if (!args.noGUI && !args.textSection) {
    MessageBox("ok", "UDXPatcher", "Select a TEXT section patch (Optional)");
    args.textSection = await BrowseFile([ "sectext" ]);
}

if (!args.noGUI && !args.main) {
    MessageBox("ok", "UDXPatcher", "Select a New Super Mario Bros. U Delxue 'main' file (Mandatory)");
    args.main = await BrowseFile([]);
}

if (!args.noGUI && !args.output) {
    MessageBox("ok", "UDXPatcher", "Select an output folder (Mandatory)");
    args.output = await BrowseFolder();
}

if (!args.main) {
    if (args.noGUI) {
        console.error("Error: Missing main file");
        Deno.exit(1);
    }

    MessageBox("error", "UDXPatcher", "Missing New Super Mario Bros. U Deluxe 'main' file");
    Deno.exit(1);
}

if (!args.output) {
    if (args.noGUI) {
        console.error("Error: Missing output folder");
        Deno.exit(1);
    }

    MessageBox("error", "UDXPatcher", "Missing output folder");
    Deno.exit(1);
}

if (!args.textSection) {
    const file = way.join(way.cwd(), "./patch/patch.sectext");
    if (await isFile(file)) args.textSection = file;
}

if (!args.textPatch) {
    const file = way.join(way.cwd(), "./patch/patch.nsotext");
    if (await isFile(file)) args.textPatch = file;
}

if (!args.roSection) {
    const file = way.join(way.cwd(), "./patch/patch.secro");
    if (await isFile(file)) args.roSection = file;
}

if (!args.roPatch) {
    const file = way.join(way.cwd(), "./patch/patch.nsoro");
    if (await isFile(file)) args.roPatch = file;
}

if (!args.dataSection) {
    const file = way.join(way.cwd(), "./patch/patch.secdata");
    if (await isFile(file)) args.dataSection = file;
}

if (!args.dataPatch) {
    const file = way.join(way.cwd(), "./patch/patch.nsodata");
    if (await isFile(file)) args.dataPatch = file;
}

export const outputDirA = way.join(args.output, "./For Nintendo Switch/atmosphere/contents/0100ea80032ea000/exefs");
export const outputDirB = way.join(args.output, "./For Emulator/mods/contents/0100ea80032ea000/SSMBDX/exefs");
export const outputFileA = way.join(outputDirA, "./main");
export const outputFileB = way.join(outputDirB, "./main");
 
if (args.debug) {
    console.log(`

        Patches:
            - .text: ${args.textPatch}
            - .ro: ${args.roPatch}
            - .data: ${args.dataPatch}

        Sections:
            - .text: ${args.textSection}
            - .ro: ${args.roSection}
            - .data: ${args.dataSection}
            
        Main: ${args.main}
        
        Outputs:
            - ${outputFileA}
            - ${outputFileB}

    `)
}

try {
    await Deno.mkdir(outputDirA, { recursive: true });
    await Deno.writeFile(outputFileA, new Uint8Array([ 1 ]));
    await Deno.mkdir(outputDirB, { recursive: true });
    await Deno.writeFile(outputFileB, new Uint8Array([ 1 ]));
} catch {
    if (args.noGUI) {
        console.error(`
            
            Error: Failed to use output folder
            
        `);
        Deno.exit(1);
    }

    MessageBox("error", "UDXPatcher", "Failed to use output folder");
    Deno.exit(1); 
}

export const outputArgs = args;
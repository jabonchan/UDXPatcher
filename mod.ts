import { ParsedNSO0, SourceNSO0 } from "./modules/filetendo/lib/nso0/types.ts";
import { outputArgs } from "./modules/clii/mod.ts";
import { way } from "./deps.ts";

import * as filetendo from "./modules/filetendo/mod.ts";
import * as cody from "./modules/cody/mod.ts";
import * as clii from "./modules/clii/mod.ts";

if (outputArgs.debug) {
    console.log(`
        
        CWD: ${way.cwd()}  
        Extracted: ${way.join(way.cwd(), "./extracted")}  

    `)

    try {
        await Deno.mkdir("./extracted/", { recursive: true });

        await Deno.writeFile("./extracted/text.bin", new Uint8Array([ 1 ]));
        await Deno.writeFile("./extracted/ro.bin", new Uint8Array([ 1 ]));
        await Deno.writeFile("./extracted/data.bin", new Uint8Array([ 1 ]));
        
        await Deno.writeFile("./extracted/text-patched.bin", new Uint8Array([ 1 ]));
        await Deno.writeFile("./extracted/ro-patched.bin", new Uint8Array([ 1 ]));
        await Deno.writeFile("./extracted/data-patched.bin", new Uint8Array([ 1 ]));
    } catch {
        console.error(`

            Error: Failed to setup debug enviroment

        `);
    }
}

let data: Uint8Array<ArrayBuffer> = new Uint8Array();   // @ts-ignore .
let parsedNSO0: ParsedNSO0 = {};                        // @ts-ignore .
let sourceNSO0: SourceNSO0 = {};
let encodedNSO0: Uint8Array = new Uint8Array();

try {
    data = await Deno.readFile(outputArgs.main!);
    parsedNSO0 = await filetendo.parseNSO0(data);
    sourceNSO0 = filetendo.convertParsedNSO0ToSourceNSO0(parsedNSO0);
} catch {
    if (outputArgs.noGUI) {
        console.error(`

            Error: Invalid NSO file

        `)
    } else {
        clii.MessageBox("error", "UDXPatcher", "Invalid NSO file")
    }

    Deno.exit(2);
}

if (outputArgs.debug) {
    console.log(`
        
        Printing NSO information:

    `)

    console.log(parsedNSO0);

    await Deno.writeFile("./extracted/text.bin", parsedNSO0.sections.text.decompressed);
    await Deno.writeFile("./extracted/ro.bin", parsedNSO0.sections.ro.decompressed);
    await Deno.writeFile("./extracted/data.bin", parsedNSO0.sections.data.decompressed);

    console.log(`
        
        Stored source sections

    `)
}

if (outputArgs.textSection) {
    if (outputArgs.debug) console.log("Loaded text section patch");

    const patch = await Deno.readFile(outputArgs.textSection);
    cody.extpatchNSO0(sourceNSO0, patch, ".text");
}

if (outputArgs.roSection) {
    if (outputArgs.debug) console.log("Loaded ro section patch");

    const patch = await Deno.readFile(outputArgs.roSection);
    cody.extpatchNSO0(sourceNSO0, patch, ".ro");
}

if (outputArgs.dataSection) {
    if (outputArgs.debug) console.log("Loaded data section patch");

    const patch = await Deno.readFile(outputArgs.dataSection);
    cody.extpatchNSO0(sourceNSO0, patch, ".data");
}

try {
    if (outputArgs.textPatch) {
        const patch = await Deno.readTextFile(outputArgs.textPatch);
        cody.patchNSO0(sourceNSO0, patch, ".text");

        if (outputArgs.debug) console.log("Loaded text patch");
    }
    
    if (outputArgs.roPatch) {
        const patch = await Deno.readTextFile(outputArgs.roPatch);
        cody.patchNSO0(sourceNSO0, patch, ".ro");

        if (outputArgs.debug) console.log("Loaded ro patch");
    }
    
    if (outputArgs.dataPatch) {
        const patch = await Deno.readTextFile(outputArgs.dataPatch);
        cody.patchNSO0(sourceNSO0, patch, ".data");

        if (outputArgs.debug) console.log("Loaded datapatch");
    }
} catch {
    if (outputArgs.debug) {
        console.error(`
        
            One or more patches have syntax errors
            
        `);
        Deno.exit(3);
    }

    clii.MessageBox("error", "UDXPatcher", "One or more patches have syntax errors");
    Deno.exit(3);
}

if (outputArgs.debug) {
    await Deno.writeFile("./extracted/text-patched.bin", sourceNSO0.sections.text);
    await Deno.writeFile("./extracted/ro-patched.bin", sourceNSO0.sections.ro);
    await Deno.writeFile("./extracted/data-patched.bin", sourceNSO0.sections.data);

    console.log(`
        
        Stored patched sections

    `)
}

try {
    encodedNSO0 = await filetendo.craftNSO0(sourceNSO0);

    await Deno.writeFile(clii.outputFileA, encodedNSO0);
    await Deno.writeFile(clii.outputFileB, encodedNSO0);

    if (outputArgs.noGUI) {
        if (outputArgs.debug) console.log(`
        
            Successfully created patched NSO

        `)

        Deno.exit(0);
    }

    clii.MessageBox("ok", "UDXPatcher", "Successfully created patched NSO");
    Deno.exit(0);
} catch {
    if (outputArgs.noGUI) {
        if (outputArgs.debug) console.log(`
        
            Error: Failed to create patched NSO

        `)

        Deno.exit(4);
    }

    clii.MessageBox("error", "UDXPatcher", "Failed to create patched NSO");
    Deno.exit(4);
}
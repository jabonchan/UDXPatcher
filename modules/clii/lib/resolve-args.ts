import { parseArgs } from "../deps.ts";

export function resolveArgv() {
    const args = parseArgs(Deno.args, {
        boolean: [
            "debug",
            "no-gui",
        ],
        string: [
            "main",
            "output",
            "ro-patch",
            "data-patch",
            "text-patch",
            "ro-section",
            "data-section",
            "text-section",
        ],
        default: {
            main: null,
            output: null,

            "ro-patch": null,
            "ro-section": null,

            "data-patch": null,
            "data-section": null,

            "text-patch": null,
            "text-section": null,

            debug: false,
            "no-gui": false,
        },
    });

    return {
        main: args.main as string | null,
        output: args.output as string | null,

        roPatch: args["ro-patch"] as string | null,
        roSection: args["ro-section"] as string | null,

        dataPatch: args["data-patch"] as string | null,
        dataSection: args["data-section"] as string | null,

        textPatch: args["text-patch"] as string | null,
        textSection: args["text-section"] as string | null,

        debug: args.debug as boolean,
        noGUI: args["no-gui"] as boolean
    };
}
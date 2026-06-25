import { removeSourceMapUrl } from "./remove-source-map-url.ts";
import { base64FromUnicode } from "./base64-from-unicode.ts";
import { catchError } from "./catch-error.ts";
import { ts } from "../deps.ts";

export function transpile(
    source: string,
    filepath: string
) {
    const module = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
            jsx: ts.JsxEmit.React,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: false,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            sourceMap: true,
            inlineSources: true,
            inlineSourceMap: false,
        },

        fileName: filepath,
        reportDiagnostics: true,
    });

    const error = catchError(module.diagnostics);
    let result = module.outputText.trim();

    if (error) {
        const message =
            `${error.message}\n\t at ${error.path}:${error.line}:${error.character}`;
        result = `throw new SyntaxError(${JSON.stringify(message)});`;
    }

    let code = `"use strict";\n\n`;
    code += removeSourceMapUrl(result);

    if (!module.sourceMapText) return code;

    const base64Map = base64FromUnicode(module.sourceMapText);
    code += `\n//# sourceMappingURL=data:application/json;base64,${base64Map}`;

    return code;
}
import { ts } from "../deps.ts";

export function catchError(diagnostics?: ts.Diagnostic[]) {
    const error = diagnostics?.find(diagnostic => diagnostic.category === ts.DiagnosticCategory.Error);

    if (!error) return null;

    const message = ts.flattenDiagnosticMessageText(error.messageText, "\n");
    let character = 0;
    let line = 0;

    if (error.file) {
        const pos = error.file.getLineAndCharacterOfPosition(error.start!);

        line = pos.line;
        character = pos.character;
    }

    const description = {
        message,
        line: line + 1,
        character: character + 1, fileName: error.file?.fileName || "",
        path: "<anonymous>"
    };

    if (error.file?.fileName) description.path = error.file.fileName;
    if (description.path.startsWith("/")) description.path = description.path.slice(1);
    
    return description;
}
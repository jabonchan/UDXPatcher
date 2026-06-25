import { spawnSync } from "./deps.ts";

export function browse(
    type: "file" | "folder",
    options: {
        filename?: string;
        extension?: string;
    } = {}
) {
    const { filename, extension } = options;

    const filter = filename
        ? `${filename}|${filename}`
        : extension
            ? `Allowed Files (*${extension})|*${extension}`
            : "All Files (*.*)|*.*";

    const script = type === "folder"
        ? `
Add-Type -AssemblyName System.Windows.Forms

$dialog = New-Object System.Windows.Forms.FolderBrowserDialog

if ($dialog.ShowDialog() -eq "OK") {
    Write-Output $dialog.SelectedPath
}
`
        : `
Add-Type -AssemblyName System.Windows.Forms

$dialog = New-Object System.Windows.Forms.OpenFileDialog

$dialog.Filter = '${filter}'
$dialog.Multiselect = $false

if ($dialog.ShowDialog() -eq "OK") {
    Write-Output $dialog.FileName
}
`;

    const proc = spawnSync("powershell", [ "-NoProfile", "-STA", "-Command", script ]);
    return proc.output.toString().slice(1, -1).trim().replaceAll("\\", "/") || null;
}
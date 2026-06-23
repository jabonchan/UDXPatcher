import { $, way } from "../deps.ts";

export async function BrowseFile(extensions: string[] = []): Promise<string | null> {
    const filter = extensions.length
        ? extensions.map(x => `*.${x}`).join(",")
        : "*.*";

    const { decoded } = await $`powershell -NoProfile -Command "
        Add-Type -AssemblyName System.Windows.Forms;
        $d = New-Object System.Windows.Forms.OpenFileDialog;
        $d.Filter = 'Files|${filter}';
        if ($d.ShowDialog() -eq 'OK') {
            $d.FileName
        }
    "`;

    const path = decoded.stdout.trim();

    if (path) return way.normalize(path);
    return null;
}

export async function BrowseFolder(): Promise<string | null> {
    const { decoded } = await $`powershell -NoProfile -Command "
        Add-Type -AssemblyName System.Windows.Forms;
        $d = New-Object System.Windows.Forms.FolderBrowserDialog;
        if ($d.ShowDialog() -eq 'OK') {
            $d.SelectedPath
        }
    "`;

    const path = decoded.stdout.trim();

    if (path) return way.normalize(path);
    return null;
}
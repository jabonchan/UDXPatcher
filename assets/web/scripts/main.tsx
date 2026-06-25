import { createRoot, React } from "./deps.tsx";
import { apiSync } from "./api.ts";

import FilePickerField from "./components/file-picker-field.tsx";

export default function App() {
    return (
        <>
            <h1>⭐ UDXPatcher  🚀</h1>
            <br /><br />
            <h2>Folders</h2>

            <FilePickerField
                fieldName="Main NSO (Mandatory)"
                mode="file"
                filename="main"
                onSelect={(file, setText) => {
                    if (!file || Array.isArray(file)) {
                        return;
                    }

                    apiSync("set-path", {
                        type: "main",
                        path: file
                    });

                    setText(file);
                }}
            />

            <FilePickerField
                fieldName="Output Folder (Mandatory)"
                mode="folder"
                onSelect={(folder, setText) => {
                    if (!folder || Array.isArray(folder)) {
                        return;
                    }

                    apiSync("set-path", {
                        type: "output",
                        path: folder
                    });

                    setText(folder);
                }}
            />


            <FilePickerField
                fieldName="RomFS"
                mode="folder"
                onSelect={(folder, setText) => {
                    if (!folder || Array.isArray(folder)) {
                        return;
                    }

                    apiSync("set-path", {
                        type: "romfs",
                        path: folder
                    });

                    setText(folder);
                }}
            />

            <br /><br />
            <h2>Files</h2>

            <FilePickerField
                fieldName="Text Section"
                mode="file"
                accept=".sectext"
                onSelect={(file, setText) => {
                    if (!file || Array.isArray(file)) return;

                    apiSync("set-path", {
                        type: ".sectext",
                        path: file
                    });

                    setText(file);
                }}
            />

            <FilePickerField
                fieldName="Text Patch"
                mode="file"
                accept=".nsotext"
                onSelect={(file, setText) => {
                    if (!file || Array.isArray(file)) return;

                    apiSync("set-path", {
                        type: ".nsotext",
                        path: file
                    });

                    setText(file);
                }}
            />


            <FilePickerField
                fieldName="RO Section"
                mode="file"
                accept=".secro"
                onSelect={(file, setText) => {
                    if (!file || Array.isArray(file)) return;

                    apiSync("set-path", {
                        type: ".secro",
                        path: file
                    });

                    setText(file);
                }}
            />

            <FilePickerField
                fieldName="RO Patch"
                mode="file"
                accept=".nsoro"
                onSelect={(file, setText) => {
                    if (!file || Array.isArray(file)) return;

                    apiSync("set-path",
                    {
                        type: ".nsoro",
                        path: file
                    });

                    setText(file);
                }}
            />


            <FilePickerField
                fieldName="Data Section"
                mode="file"
                accept=".secdata"
                onSelect={(file, setText) => {
                    if (!file || Array.isArray(file)) return;

                    apiSync("set-path", {
                        type: ".secdata",
                        path: file
                    });

                    setText(file);
                }}
            />

            <FilePickerField
                fieldName="Data Patch"
                mode="file"
                accept=".nsodata"
                onSelect={(file, setText) => {
                    if (!file || Array.isArray(file)) return;

                    apiSync("set-path", {
                        type: ".nsodata",
                        path: file
                    });

                    setText(file);
                }}
            />

            <br /><br />

            <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                    className="discord-button-big"
                    onClick={() => {
                        apiSync("set-mode", "emulator");
                        alert("Enabled Emulator Output. Restart app to disable it");
                }}>
                    Enable Emulator Output
                </button>

                <button
                    className="discord-button-big"
                    onClick={() => {
                        apiSync("set-debug", true);
                        alert("Enabled Debug Mode. Restart app to disable it");
                }}>
                    Enable Debug Mode
                </button>

                <button
                    className="discord-button-big"
                    onClick={() => {
                        alert("Patching of the main NSO will begin. This will take sometime, the app is not frozen, don't close the program");
                        
                        if (apiSync("compile").status === 200) {
                            alert("Patching finished! Enjoy gaming :)");
                        }
                }}>
                    Compile
                </button>
            </div>
            
            <br /><br />
        </>
    );
}

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
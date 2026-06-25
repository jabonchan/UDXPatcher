import { React, useState } from "../deps.tsx";

interface FilePickerFieldProps {
    fieldName: string;
    buttonText?: string;
    mode: "file" | "folder";
    accept?: string;
    filename?: string;

    onSelect?: (
        selected: string | string[] | null,
        setText: (text: string) => void
    ) => void;
}

declare global {
    interface Window {
        browse: (
            mode: "file" | "folder",
            options?: {
                extension?: string;
                filename?: string;
            }
        ) => Promise<string | string[] | null>;
    }
}

export default function FilePickerField({
    fieldName,
    buttonText = "Browse",
    mode,
    accept,
    filename,
    onSelect
}: FilePickerFieldProps) {
    const [text, setText] = useState(
        mode === "folder"
            ? "No folder selected"
            : "No file selected"
    );

    const handleBrowse = async () => {
        try {
            const result = await window.browse(mode, {
                extension: accept
                    ?.replace(".", "")
                    .replace("*", ""),
                filename
            });

            if (!result) {
                onSelect?.(null, setText);
                return;
            }

            const value = Array.isArray(result)
                ? result.join(", ")
                : result;

            setText(value);
            onSelect?.(result, setText);

        } catch (err) {
            console.error("Browse failed:", err);
            onSelect?.(null, setText);
        }
    };

    return (
        <div className="discord-field">

            <div className="discord-row">

                <div className="discord-value">
                    {text}
                </div>

                <div className="discord-action-box">

                    <span className="discord-action-label">
                        {fieldName}
                    </span>

                    <button
                        className="discord-button"
                        onClick={handleBrowse}
                    >
                        {buttonText}
                    </button>

                </div>

            </div>

        </div>
    );
}
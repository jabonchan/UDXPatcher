import { webview } from "./deps.ts";
import { browse } from "./browse.ts";

self.onmessage = ({ data: url }) => {
    const view = new webview.Webview(true);

    view.bind("browse", (
        type: "file" | "folder",
        options: {
            filename?: string;
            extension?: string;
        } = {}
    ) => {
        return browse(type, options);
    });

    view.size = {
        height: 720,
        width: 1280,
        hint: webview.SizeHint.FIXED
    }

    view.navigate(url as string);
    view.run();

    self.postMessage(null);
}

self.postMessage("Ready");

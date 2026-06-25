import { transpile } from "../transpile.ts";
import { mime, way } from "../../deps.ts";

const TypedArray = Object.getPrototypeOf(Uint8Array.prototype).constructor;
const decode = TextDecoder.prototype.decode.bind(new TextDecoder());
const encode = TextEncoder.prototype.encode.bind(new TextEncoder());

export interface APICall {
    method: "POST" | "GET" | "UPDATE" | "DELETE" | "PUT";
    parameters: Record<string, string>;
    request: Request;

    body: {
        buffer: Uint8Array;
        string: string;
        json: unknown;
    };
}

export interface APIResponse {
    status: number;
    body: unknown;
}

export class NuclearServer {
    #assets: string;
    #index: string;
    #onError: (error: unknown) => void;
    #onListen: (addr: Deno.NetAddr) => void;
    #onRequest: (req: Request) => Response | Promise<Response> | null | void;
    #onAPI: {
        [endpoint: string]: (
            call: APICall,
        ) => APIResponse | Promise<APIResponse>;
    };

    constructor(options: {
        assets: string;
        index?: string;
        hostname?: string;
        port?: number;
    }, handlers: {
        onError: (error: unknown) => void;
        onListen: (addr: Deno.NetAddr) => void;
        onRequest: (req: Request) => Response | Promise<Response> | null | void;

        onAPI: {
            [endpoint: string]: (
                call: APICall,
            ) => APIResponse | Promise<APIResponse>;
        };
    }) {
        let assets = options.assets;
        let index = options.index ?? "index.html";

        if (way.isRelative(options.assets)) {
            assets = way.join(way.cwd(), options.assets);
        }

        if (way.isRelative(index)) index = way.join(assets, index);

        this.#assets = assets;
        this.#index = index;
        this.#onAPI = handlers.onAPI;
        this.#onError = handlers.onError;
        this.#onListen = handlers.onListen;
        this.#onRequest = handlers.onRequest;

        const hostname = options.hostname;
        const port = options.port;

        Deno.serve({
            hostname,
            port,

            onError: async (error) => {
                await Promise.resolve();
                this.#onError(error);

                return new Response("Internal Server Error", { status: 500 });
            },

            onListen: async (addr) => {
                if (addr.hostname === "0.0.0.0") addr.hostname = "127.0.0.1";

                await Promise.resolve();
                this.#onListen(addr);
            },
        }, async (req) => {
            const requestResponse = await this.#onRequest(req);

            if (requestResponse instanceof Response) return requestResponse;

            const apiResponse = await this.#parseAPIRequest(req);

            if (apiResponse) {
                const body = this.#prepareBody(apiResponse.body);
                return new Response(body, { status: apiResponse.status });
            }
            
            const url = new URL(req.url);
            const filepath = decodeURI(url.pathname);

            if (filepath === "/") return this.#prepareAsset(this.#index);
            return this.#prepareAsset(filepath);
        });
    }

    #prepareBody(body: unknown) {
        if (body instanceof TypedArray) {
            return body as Uint8Array<ArrayBuffer>;
        } else if (typeof body === "string") {
            return encode(body);
        } else if (typeof body === "object") {
            return encode(JSON.stringify(body));
        } else {
            return encode(String(body));
        }
    }

    #parseJSON(string: string) {
        try {
            return JSON.parse(string);
        } catch {
            return null;
        }
    }

    async #prepareCode(filepath: string) {
        const fullpath = way.join(this.#assets, filepath);

        try {
            const contents = await Deno.readTextFile(fullpath);

            return new Response(transpile(contents, filepath), {
                status: 200,
                headers: { "Content-Type": "application/javascript" },
            });
        } catch (e) {
            console.error("❌ [Transpilation error]:", filepath, e);
            return new Response("Internal Server Error", { status: 500 });
        }
    }

    async #getBody(req: Request) {
        const chunks: number[] = [];
        const reader = req.body?.getReader();

        if (reader) {
            let chunk: ReadableStreamReadResult<Uint8Array<ArrayBuffer>>;

            while ((chunk = await reader.read()).value) {
                await Promise.resolve();
                chunks.push(...chunk.value);
            }
        }

        return new Uint8Array(chunks);
    }

    async #prepareAsset(filepath: string) {
        const fullpath = filepath === this.#index ? this.#index : way.join(this.#assets, filepath);
        const extname = way.extname(fullpath) ?? "";
        const type = mime.contentType(extname) || "application/octet-stream";

        if (!way.isSandboxed(this.#assets, fullpath)) {
            return new Response("Unauthorized", { status: 401 });
        }

        switch (extname) {
            case ".ts":
            case ".tsx":
            case ".jsx":
                return await this.#prepareCode(filepath);
        }

        try {
            const contents = await Deno.readFile(fullpath);

            return new Response(contents, {
                status: 200,
                headers: { "Content-Type": type },
            });
        } catch {
            console.error("❌ [Asset error]:", filepath);
            return new Response("Internal Server Error", { status: 500 });
        }
    }

    async #parseAPIRequest(req: Request) {
        await Promise.resolve();

        const method = req.method as APICall["method"];
        const url = new URL(req.url);
        const path = url.pathname;
        const endpoint = path.slice(5).replace(/\/$/g, "");

        if (!path.startsWith("/api/")) {
            return null;
        }

        const handler = this.#onAPI[endpoint];

        if (!handler) {
            return {
                status: 500,
                body: null,
            };
        }

        const params: Record<string, string> = {};

        for (const [key, value] of url.searchParams.entries()) {
            params[key] = value;
        }

        const buffer = await this.#getBody(req);
        const string = decode(buffer);
        const json = this.#parseJSON(string);

        const call: APICall = {
            method,
            parameters: params,
            request: req,

            body: {
                buffer,
                string,
                json,
            },
        };

        try {
            return await this.#onAPI[endpoint](call);
        } catch (e) {
            console.error("❌ [API error]:", endpoint, e);

            return {
                status: 500,
                body: null,
            };
        }
    }
}

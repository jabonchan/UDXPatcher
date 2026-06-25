import { load } from "./deps.tsx"; load();

export async function api(
    apiName: string,
    value: unknown = null,
    params: Record<string, string> = {},
): Promise<{ status: number; body: string | null }> {
    const url = new URL(`/api/${apiName}`, window.location.origin);

    if (params) {
        for (const [key, val] of Object.entries(params)) {
            url.searchParams.set(key, val);
        }
    }

    let response: Response;

    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: value === null || value === undefined ? undefined : JSON.stringify(value),
        });
    } catch {
        return {
            status: 500,
            body: null
        }
    }

    const body = response.body ? await response.text() : null;

    if (response.status === 400) alert(body);

    return {
        status: response.status,
        body: null,
    };
}

export function apiSync(
    apiName: string,
    value: unknown = null,
    params: Record<string, string> = {},
): { status: number; body: string | null } {
    const url = new URL(`/api/${apiName}`, window.location.origin);

    for (const [key, val] of Object.entries(params)) {
        url.searchParams.set(key, val);
    }

    const xhr = new XMLHttpRequest();

    try {
        // false = synchronous request
        xhr.open("POST", url.toString(), false);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(
            value === null || value === undefined
                ? null
                : JSON.stringify(value),
        );
    } catch {
        return {
            status: 500,
            body: null,
        };
    }

    const body = xhr.responseText || null;

    if (xhr.status === 400) {
        alert(body);
    }

    return {
        status: xhr.status,
        body,
    }
}
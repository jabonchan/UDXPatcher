export function nsopatchParser(code: string) {
    code = code.trim().replaceAll("\r", "").replaceAll("\n", ";").replace(/\s+/g, "").toUpperCase().replaceAll("0X", "");
    const isValid = /^[0-9a-fA-F;:]+$/.test(code);

    if (!isValid) throw new Error("Failed to parse patch, invalid syntax?");

    const patches: { code: number[], address: number }[] = []

    for (const line of code.split(";")) {
        let [location, machineCode] = line.split(":");

        if (location.length !== 8 || !machineCode || !location || (machineCode.length % 2)) throw new Error("Failed to parse patch, invalid syntax?");
        if (location.startsWith("6")) location = "0" + location.slice(1);

        const address = parseInt(location, 16);
        const patch: number[] = [];

        for (let i = 0; i < machineCode.length; i += 2) {
            patch.push(parseInt(machineCode.slice(i, i + 2), 16));
        }

        patches.push({ code: patch, address });
    }

    return patches;
}
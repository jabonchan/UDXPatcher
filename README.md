# UDXPatcher
A TypeScript tool for patching and injecting code into the **New Super Mario Bros. U Deluxe** ``main`` NSO.

The patches are generated from C++ code that is compiled into a portable raw binary of code by the UDXCompiler. Work in progress. Most tests have been with Ryubing and real hardware.

## Compatibility

**IMPORTANT: This tool only works with the base game (version 1.0.0).** This is because version 1.0.0 is written in ARM 32-bit architecture, while Update 1.0.2 converts it to ARM aArch64 to add support for the Switch 2 console. Please ensure Update 1.0.2 is removed from your emulator or Switch console before using this patcher.

Currently patched NSOs have been tested on:
- Ryubing
- KenjiNX
- Eden
- Real Hardware

And based on the results we can say that it works on ``Ryubing``, ``KenjiNX`` (And likely other ``Ryujinx`` based emulators) and ``Real Hardware``. ``yuzu`` based emulators (like ``eden``) have issues running custom NSOs, and randomly crash. This is an emulator problem.

## Usage

For detailed step‑by‑step instructions, please see the **[Guide.md](./Guide.md)**.

**Quick start:**
1. Place your patch files (`patch.sectext` and `patch.nsotext`) into `UDXPatcher/patch`.
2. Place the game's `main` executable (extracted from the `exefs` of *New Super Mario Bros. U Deluxe*) into `UDXPatcher/source/exefs/(Your Original main)`.
3. Run `UDXPatcher.exe` – a terminal window will appear, show progress, and close when finished.
4. The patched `main` will be generated at `UDXPatcher/NSMBUDXMOD/exefs/(The New Patched main)`.

That patched file can then be used with emulators or on real hardware via LayeredFS (see the guide for details).

## CREDITS:

[**jabonchan**](https://github.com/jabonchan)**:** Main developer <br />
[**Mario Possamato**](https://github.com/mariopossamato)**:** Developer and researcher <br />
[**Steam_DuB**](https://github.com/Steammaker212)**:** Tester

*Dependency:* [**Ninpatch-Native**](https://github.com/jabonchan/Ninpatch-Native) by [**jabonchan**](https://github.com/jabonchan) - Licensed under **MIT** <br />
*Dependency:* [**lz4**](https://github.com/lz4/lz4) by [**lz4 Team**](https://github.com/lz4) - Licensed under **BSD 2-Clause**  (see LZ4_LICENSE) <br />
*Dependency:* [**deno**](https://github.com/denoland/deno) by [**Deno Team**](https://github.com/denoland) - Licensed under **MIT**  <br />

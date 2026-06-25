# UDXPatcher
A TypeScript tool for patching and injecting code into the **New Super Mario Bros. U Deluxe v1.0.0** ``main`` NSO.

The patches are generated from C++ code that is compiled into a portable raw binary of code by [**UDXCompiler**](https://github.com/jabonchan/UDXCompiler).

## Compatibility

**IMPORTANT: This tool only works with the base game (version 1.0.0).** This is because version 1.0.0 is written in ARM 32-bit architecture, while Update 1.0.2 converts it to ARM aArch64 to add support for the Switch 2 console. Please ensure Update 1.0.2 is removed from your emulator or Switch console before using this patcher.

Currently patched NSOs have been tested on:
- Ryubing
- KenjiNX
- Eden
- Real Hardware

## BUILDING

Have `deno` in `PATH`, place `Ninpatch-Native.dll` from [**Ninpatch-Native**](https://github.com/jabonchan/Ninpatch-Native) inside `./assets/` then run
```
compile.bat
```

## CREDITS:

[**jabonchan**](https://github.com/jabonchan)**:** Main developer <br />
[**Mario Possamato**](https://github.com/mariopossamato)**:** Developer and researcher <br />
[**Steam_DuB**](https://github.com/Steammaker212)**:** Tester

*Dependency:* [**Ninpatch-Native**](https://github.com/jabonchan/Ninpatch-Native) by [**jabonchan**](https://github.com/jabonchan) - Licensed under **MIT** <br />
*Dependency:* [**deno_webview**](https://github.com/webview/webview_deno) by [**Deno_WebView Team**](https://github.com/webview) - Licensed under **MIT** <br />
*Dependency:* [**lz4**](https://github.com/lz4/lz4) by [**lz4 Team**](https://github.com/lz4) - Licensed under **BSD 2-Clause**  (see LZ4_LICENSE) <br />
*Dependency:* [**deno**](https://github.com/denoland/deno) by [**Deno Team**](https://github.com/denoland) - Licensed under **MIT**  <br />

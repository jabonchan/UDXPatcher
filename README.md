# UDXPatcher
A TypeScript tool for patching and injecting code into the **New Super Mario Bros. U Deluxe** ``main`` NSO.

The patches are generated from C++ code that is compiled into a portable raw binary of code by the UDXCompiler. Will publish it soon on GitHub
It works on KenjiNX, Ryubing and real hardware

## Compatibility

Currently patched NSOs have been tested on:
- Ryubing
- KenjiNX
- Eden
- Real Hardware

And based on the results we can say that it works on ``Ryubing``, ``KenjiNX`` (And likely other ``Ryujinx`` based emulators) and ``Real Hardware``. ``yuzu`` based emulators (like ``eden``) have issues running custom NSOs, and randomly crash. This is an emulator problem.

## CREDITS:

[**jabonchan**](https://github.com/jabonchan)**:** Main developer <br />
[**Mario Possamato**](https://github.com/mariopossamato)**:** Developer and researcher <br />
**Steam_Deb:** Tester

*Dependency:* [**deno_lz4**](https://github.com/denosaurs/deno_lz4) by [**denosaurs Team**](https://github.com/denosaurs) - Licensed under **MIT** <br />
*Dependency:* [**lz4**](https://github.com/lz4/lz4) by [**lz4 Team**](https://github.com/lz4) - Licensed under **BSD 2-Clause**  (see LZ4_LICENSE) <br />
*Dependency:* [**deno**](https://github.com/denoland/deno) by [**Deno Team**](https://github.com/denoland) - Licensed under **MIT**  <br />

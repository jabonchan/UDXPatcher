# UDXPatcher – Usage Guide

This guide walks you through patching the `main` executable of **New Super Mario Bros. U Deluxe** using UDXPatcher.

---

## What You Need

- The patch files: `patch.sectext` and `patch.nsotext` (provided by a mod or the UDXCompiler).
- The original `main`, extracted from the game’s `exefs` folder.
- The UDXPatcher executable (`UDXPatcher.exe`) – included in this repository.

> **Important:** This tool only works with the base game (version 1.0.0). Update 1.0.2 changes the game's architecture to ARM aArch64 and is not compatible. Please ensure Update 1.0.2 is removed from your emulator or Switch console.

---

## Step‑by‑Step Instructions

### 1. Place the patch files
- Copy `patch.sectext` and `patch.nsotext` into the `UDXPatcher/patch` folder.  
  *(If the folder doesn’t exist, create it.)*

### 2. Place the game executable
- Extract the `main` NSO from your game dump.  
  You can use tools like:
  - [**nxdumptool**](https://github.com/DarkMatterCore/nxdumptool) – a powerful dumping tool for the Nintendo Switch[reference:0].
  - [**hactool**](https://github.com/SciresM/hactool) – a tool to view information, decrypt, and extract common file formats for Nintendo Switch files[reference:1].
- Copy that `main` file into `UDXPatcher/source/exefs/(Your Original main)`.  
  *(Create the `source/exefs` subfolders if they are missing.)*

### 3. Run the patcher
- Double‑click `UDXPatcher.exe` (or run it from a command prompt).
- A terminal window will open, displaying progress messages.
- When patching is complete, the window will close automatically.

### 4. Locate the patched executable
- The patched `main` file is saved to:  
  **`UDXPatcher/NSMBUDXMOD/exefs/(The New Patched main)`**

---

## Using the Patched Executable

You can now use this modified `main` with **LayeredFS** on:
- **Real hardware** (Atmosphere, etc.)
- **Emulators** that support LayeredFS (Ryubing, KenjiNX, etc.)

**Placement example for Atmosphere:**
- Copy the patched `main` to:  
  `atmosphere/contents/0100EA80032EA000/exefs/(The New Patched main)`  
  *(Create the `exefs` folder if needed.)*

> **Note:** The title ID `0100EA80032EA000` is for *New Super Mario Bros. U Deluxe*. If your game version differs, adjust accordingly.

---

## Troubleshooting

| Problem | What to check |
|---------|---------------|
| `UDXPatcher.exe` does nothing or closes instantly | Make sure both patch files are present in `UDXPatcher/patch`. |
| Error about missing `main` | Verify that the source file is at `UDXPatcher/source/exefs/(Your Original main)`. |
| Patched game crashes on yuzu‑based emulators | This is a known emulator issue – use Ryubing, KenjiNX, or real hardware. |
| Output folder is empty | Ensure the patcher has write permissions in its directory. |
| Patched game doesn't boot or crashes on startup | **Make sure you are using the base game (version 1.0.0) and that Update 1.0.2 is not installed.** |

---

## Credits

See the main [README.md](readme.md) for the full list of developers and dependencies.
@Echo Off

CD %~dp0

deno run -A mod.ts --no-gui --output ./output --main ./source/exefs/main

Exit /b
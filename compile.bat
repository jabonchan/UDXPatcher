@Echo Off

CD %~dp0

deno compile --include ./assets -A mod.ts

Exit /b
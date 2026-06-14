# Node Setup

## Goal
Prepare a stable Node.js, npm, and Appium CLI environment for driver setup.

## Decision Logic
- If `node` is missing or the major version is too old for Appium drivers, use an existing maintained version manager (`nvm`, `fnm`, or `asdf`) to install or switch to active LTS.
- If no version manager is present on Windows, prefer `fnm` via `winget`.
- If `npm` is unavailable, repair the Node/npm environment before installing Appium.
- If `npm ping` fails, treat it as registry, proxy, DNS, or network policy evidence; do not continue to driver installs until it is explained or fixed.
- Use global npm/Appium commands by default. Use `npx appium` only when the user explicitly asks for local mode.

## Preflight Commands
macOS/Linux:

```bash
uname -s
command -v node || true
node -v
npm -v
npm ping
command -v appium || true
appium -v
appium driver list --installed
```

Windows PowerShell:

```powershell
[System.Environment]::OSVersion.VersionString
Get-Command node.exe -ErrorAction SilentlyContinue
node -v
npm -v
npm ping
Get-Command appium.cmd -ErrorAction SilentlyContinue
appium -v
appium driver list --installed
```

If PowerShell blocks npm scripts with `npm.ps1 cannot be loaded`, ask before changing policy and use:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

## Install Or Repair
1. Prefer an existing `nvm`, `fnm`, or `asdf` install.
2. Install active LTS only when the current Node version is missing or incompatible.
3. Install Appium globally only when `appium -v` is unavailable:

```bash
npm install -g appium
appium -v
```

## Verification
Verify:

```bash
node -v
npm -v
npm ping
node -p 'process.versions.node'
appium -v
appium driver list --installed
```

Report the Node version, npm version, Appium version, installed drivers, and whether npm connectivity passed.

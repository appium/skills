---
name: "environment-setup-node"
description: "Prepare and validate Node.js and npm environment"
metadata:
   last_modified: "Thu, 12 Mar 2026 03:45:00 GMT"

---
# environment-setup-node

## Goal
Prepares a stable Node.js and npm environment by validating the active Node runtime, confirming npm availability, and checking basic npm connectivity and health diagnostics.

## Decision Logic
- If `node` is missing or major version is `< 20`: install/upgrade Node.js to active LTS.
- If a maintained Node version manager exists (`nvm`, `fnm`, `asdf`): use it as the primary way to install/switch Node versions.
- If no Node version manager is available on Windows: install `fnm` with `winget` and continue non-interactively.
- If Windows shell cannot find `node` after `fnm` setup: configure PowerShell profile to initialize `fnm`, then open a new terminal (or reload profile).
- If `npm` is unavailable: repair npm environment before continuing.
- If `npm ping` fails: resolve registry/network configuration before continuing.

## Instructions
1. **Detect Node version management tools**
   ```bash
   command -v nvm || true
   command -v fnm || true
   command -v asdf || true
   ```
   Windows PowerShell:
   ```powershell
   Get-Command fnm -ErrorAction SilentlyContinue
   Get-Command nvm -ErrorAction SilentlyContinue
   Get-Command winget -ErrorAction SilentlyContinue
   ```
   Prefer this order when available: `fnm` / `nvm` / `asdf`.
   If none is available on Windows, install `fnm` non-interactively and continue:
   ```powershell
   winget install Schniz.fnm --accept-source-agreements --accept-package-agreements
   ```
   Then initialize `fnm` in the current shell:
   ```powershell
   $fnmDir = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe"
   if (Test-Path $fnmDir) { $env:PATH = "$fnmDir;$env:PATH" }
   fnm env --shell powershell | Invoke-Expression
   fnm install --lts
   fnm use lts-latest
   fnm default lts-latest
   ```
   Persist for all new Windows PowerShell sessions (beginner-friendly):
   ```powershell
   $profileDir = Split-Path -Parent $PROFILE
   if (-not (Test-Path $profileDir)) { New-Item -ItemType Directory -Force $profileDir | Out-Null }
   if (-not (Test-Path $PROFILE)) { New-Item -ItemType File -Force $PROFILE | Out-Null }
   $fnmDir = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe"
   Add-Content $PROFILE "`n# fnm bootstrap"
   Add-Content $PROFILE ('$env:PATH = "{0};$env:PATH"' -f $fnmDir)
   Add-Content $PROFILE 'fnm env --shell powershell | Invoke-Expression'
   ```
   Profile location example on Windows PowerShell:
   ```powershell
   $PROFILE
   ```
   If `npm` is blocked with a script policy error (`npm.ps1 cannot be loaded`), set per-user execution policy:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
   ```
   Then open a new terminal tab, or reload profile in current terminal:
   ```powershell
   . $PROFILE
   ```

2. **Verify Node and npm availability**
   ```bash
   node -v
   npm -v
   ```
   Windows PowerShell:
   ```powershell
   node -v
   npm -v
   ```

3. **Validate npm connectivity**
   ```bash
   npm ping
   ```
   Windows PowerShell:
   ```powershell
   npm ping
   ```
   Ensure connectivity succeeds before continuing.

4. **Validate active Node runtime details**
   ```bash
   node -p 'process.versions.node'
   ```
   Windows PowerShell:
   ```powershell
   node -p "process.versions.node"
   ```
   Confirm the runtime is an active LTS release; if not, switch Node version using the detected version manager.

5. **Windows troubleshooting quick checks (when `node` is still not found)**
   ```powershell
   $PROFILE
   Test-Path $PROFILE
   Get-Content $PROFILE
   Get-Command fnm -ErrorAction SilentlyContinue
   Get-Command node -ErrorAction SilentlyContinue
   ```
   If `Get-Command node` is empty, run:
   ```powershell
   . $PROFILE
   fnm use lts-latest
   node -v
   npm -v
   ```

6. **Agent completion criteria**
   Mark complete only when all are true:
   - `node -v` and `npm -v` succeed
   - npm registry connectivity check succeeds (`npm ping`)
   - active Node runtime is an LTS release

## Constraints
- Prefer Node.js LTS versions only.
- Prefer maintained version-managed Node installations (`fnm`, `nvm`, `asdf`) when available.
- Avoid using `sudo` in setup commands; prefer user-space tooling when permissions are restricted.
- Use deterministic terminal checks, not assumptions.

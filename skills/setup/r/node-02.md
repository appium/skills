---
name: "node-02"
description: "Preserved node setup procedure part 2 of 4"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# node Part 2

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-node.md; strip this generated header when comparing -->

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

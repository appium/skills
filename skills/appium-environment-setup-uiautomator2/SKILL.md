---
name: "appium-environment-setup-uiautomator2"
description: "Set up and validate a UiAutomator2 Appium environment on Android"
metadata:
  model: "GPT-5.3-Codex"
  last_modified: "Sun, 08 Mar 2026 00:00:00 GMT"

---
# appium-uiautomator2-environment-setup

## Goal
Prepares a reliable Appium UiAutomator2 execution environment by installing Node.js and Appium prerequisites, configuring Android and Java dependencies, running Appium doctor checks, and iterating until all mandatory checks pass.

## Decision Logic
- If the host OS is not macOS, Linux, or Windows: stop and ask the user to use a supported OS.
- If current Node.js does not satisfy `engines.node` for both `appium` and `appium-uiautomator2-driver`: install/upgrade Node.js to a compatible active LTS version.
- If npm health checks fail (`npm doctor`, `npm ping`): resolve npm environment issues before driver setup.
- If Appium CLI is not installed: install `appium` globally.
- If global npm install is blocked: install Appium locally and use `npx appium` commands.
- If Android SDK prerequisites are missing (`adb`, emulator binary, SDK packages): run `appium-android-environment-setup` first.
- If the `uiautomator2` driver is not installed: install it via Appium CLI.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor uiautomator2` reports missing dependencies: resolve each missing item and re-run doctor.

## Instructions
1. **Prepare Node.js + npm environment**
   macOS/Linux:
   ```bash
   node -v
   npm -v
   npm config get prefix
   npm config get cache
   npm ping
   npm doctor
   ```
   Windows PowerShell:
   ```powershell
   node -v
   npm -v
   npm config get prefix
   npm config get cache
   npm ping
   npm doctor
   ```
   If `node` is missing, install a compatible active LTS release and re-run the commands.
   If npm checks fail, resolve npm environment issues before continuing.

2. **Install Appium npm command (global or local fallback)**
   ```bash
   npm install -g appium
   appium driver install uiautomator2 || appium driver update uiautomator2
   appium driver list --installed
   ```
   If the install command fails only because `uiautomator2` is already installed, continue and do not stop preparation.
   If global install is not allowed, use project-local installation:
   ```bash
   npm init -y
   npm install --save-dev appium
   npx appium driver install uiautomator2 || npx appium driver update uiautomator2
   npx appium driver list --installed
   ```

3. **Validate Appium npm commands and Node compatibility (after driver setup)**
   macOS/Linux:
   ```bash
   appium -v
   appium driver list --installed
   npx appium -v
   npx appium driver list --installed
   npm view appium engines --json
   npm view appium-uiautomator2-driver engines --json
   ```
   Windows PowerShell:
   ```powershell
   appium -v
   appium driver list --installed
   npx appium -v
   npx appium driver list --installed
   npm view appium engines --json
   npm view appium-uiautomator2-driver engines --json
   ```
   If current Node.js does not satisfy the reported `engines.node` ranges, install/upgrade Node.js to a compatible active LTS version and re-run the setup checks.

4. **Run Android environment prerequisite skill**
   Before UiAutomator2 doctor checks, execute `appium-android-environment-setup` and do not continue until it passes completion criteria.

5. **Verify Android prerequisites from this skill context**
   macOS/Linux:
   ```bash
   command -v adb
   adb version
   echo "$ANDROID_HOME"
   ls "$ANDROID_HOME/emulator/emulator"
   test -x "$ANDROID_HOME/emulator/emulator" && echo "emulator binary: OK"
   ```
   Windows PowerShell:
   ```powershell
   Get-Command adb.exe -ErrorAction SilentlyContinue
   adb.exe version
   $env:ANDROID_HOME
   Test-Path "$env:ANDROID_HOME\emulator\emulator.exe"
   if (Test-Path "$env:ANDROID_HOME\emulator\emulator.exe") { "emulator binary: OK" }
   ```

6. **Run Appium doctor for UiAutomator2 and fix in a loop**
   ```bash
   appium driver doctor uiautomator2
   ```
   Also validate local-install command path when relevant:
   ```bash
   npx appium driver doctor uiautomator2
   ```
   If doctor reports issues, apply targeted fixes and re-run until mandatory checks pass.

7. **Start Appium server smoke test**
   ```bash
   appium server
   ```
   Keep this server process running in Terminal A.
   In Terminal B, run:
   ```bash
   curl -s http://127.0.0.1:4723/status
   ```
   First confirm `/status` responds successfully from `curl`.
   Then confirm startup/readiness from server logs and ensure the `Available drivers:` block contains `uiautomator2` (for example: `- uiautomator2@7.0.0 (automationName 'UiAutomator2')`).
   If using local Appium install:
   ```bash
   npx appium server
   ```
   Keep this server process running in Terminal A.
   In Terminal B, run:
   ```bash
   curl -s http://127.0.0.1:4723/status
   ```
   After smoke validation, clean up the running Appium server:
   - In Terminal A, stop the server with `Ctrl+C`.
    - Verify no leftover Appium server process (Terminal B, macOS/Linux):
   ```bash
   pgrep -fl "appium.*server" || echo "no appium server process"
   ```
    - Verify no leftover Appium server process (Terminal B, Windows PowerShell):
    ```powershell
    if (Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'appium.*server' }) {
       Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'appium.*server' } | Select-Object ProcessId, Name, CommandLine
    } else {
       "no appium server process"
    }
    ```

8. **Agent completion criteria**
   Mark the skill complete only when all are true:
   - `appium driver list --installed` includes `uiautomator2`
   - npm environment is healthy (`npm doctor` without blocking failures)
   - at least one Appium npm command mode works (`appium` or `npx appium`)
   - `appium driver doctor uiautomator2` has no failing mandatory checks
   - `appium-android-environment-setup` completion criteria are satisfied
   - `curl -s http://127.0.0.1:4723/status` returns a successful status response
   - Appium server logs show startup/readiness successfully after the curl check
   - Appium server logs include `Available drivers:` with a `uiautomator2` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Constraints
- Always run `appium driver doctor uiautomator2` after each environment change.
- Always validate npm environment (`npm doctor`) before driver installation.
- Do not skip Android prerequisite validation; rely on `appium-android-environment-setup` for source-of-truth checks.
- Use shell-appropriate commands (`bash` for macOS/Linux, PowerShell/cmd for Windows).
- Treat optional doctor warnings as non-blocking.
- Ask the user before installing optional dependencies, and install them only when the user explicitly needs that capability.
- Prefer deterministic CLI checks over assumptions.
- If elevated privileges are required, pause and provide exact commands for the user to run.
- Do not claim success until doctor and smoke-test checks are actually green.

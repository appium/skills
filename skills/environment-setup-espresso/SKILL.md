---
name: "environment-setup-espresso"
description: "Set up and validate an Espresso Appium environment on Android"
metadata:
  last_modified: "Mon, 09 Mar 2026 12:30:00 GMT"

---
# appium-espresso-environment-setup

## Goal
Prepares a reliable Appium Espresso execution environment by installing Node.js and Appium prerequisites, configuring Android and Java dependencies, running Appium doctor checks, and iterating until all mandatory checks pass.

## Decision Logic
- If the host OS is not macOS, Linux, or Windows: stop and ask the user to use a supported OS.
- If current Node.js does not satisfy `engines.node` for both `appium` and `appium-espresso-driver`: install/upgrade Node.js to a compatible active LTS version.
- If Appium CLI is not installed: install `appium` globally.
- Use global npm/Appium commands by default (`npm install -g appium`, `appium ...`).
- Use local Appium commands (`npx appium ...`) only when the user explicitly requests local execution.
- If Android SDK prerequisites are missing (`adb`, emulator binary, SDK packages): run `android-environment-setup` first.
- Always include host device/emulator inventory in the final skill result (connected devices, emulator version, and AVD list).
- If the `espresso` driver is not installed: install it via Appium CLI.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor espresso` reports missing dependencies: resolve each missing item and re-run doctor.

## Instructions
1. **Prepare Node.js + npm environment**
   macOS/Linux:
   ```bash
   node -v
   npm -v
   ```
   Windows PowerShell:
   ```powershell
   node -v
   npm -v
   ```
   If `node` is missing, install a compatible active LTS release and re-run the commands.

2. **Install Appium npm command**
   ```bash
   npm install -g appium
   appium driver install espresso || appium driver update espresso
   appium driver list --installed
   ```
   If the install command fails only because `espresso` is already installed, continue and do not stop preparation.

3. **Validate Appium npm commands and Node compatibility (after driver setup)**
   macOS/Linux:
   ```bash
   appium -v
   appium driver list --installed
   npm view appium engines --json
   npm view appium-espresso-driver engines --json
   ```
   Windows PowerShell:
   ```powershell
   appium -v
   appium driver list --installed
   npm view appium engines --json
   npm view appium-espresso-driver engines --json
   ```
   If current Node.js does not satisfy the reported `engines.node` ranges, install/upgrade Node.js to a compatible active LTS version and re-run the setup checks.

4. **Run Android environment prerequisite skill**
   Before Espresso doctor checks, execute `android-environment-setup` and do not continue until it passes completion criteria.

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

6. **Report connected devices and emulator inventory in task result**
   macOS/Linux:
   ```bash
   adb devices -l
   "$ANDROID_HOME/emulator/emulator" -version
   "$ANDROID_HOME/emulator/emulator" -list-avds
   ```
   Windows PowerShell:
   ```powershell
   adb.exe devices -l
   & "$env:ANDROID_HOME\emulator\emulator.exe" -version
   & "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds
   ```
   In the result summary, explicitly state whether emulator preparation was skipped because either connected devices already existed or one/more AVDs already existed.

7. **Run Appium doctor for Espresso and fix in a loop**
   ```bash
   appium driver doctor espresso
   ```
   If doctor reports issues, apply targeted fixes and re-run until mandatory checks pass.

8. **Start Appium server smoke test**
   ```bash
   appium server
   ```
   Keep this server process running in Terminal A.
   In Terminal B, run:
   ```bash
   curl -s http://127.0.0.1:4723/status
   ```
   First confirm `/status` responds successfully from `curl`.
   Then confirm startup/readiness from server logs and ensure the `Available drivers:` block contains `espresso` (for example: `- espresso@<version> (automationName 'Espresso')`).
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

9. **Agent completion criteria**
   Mark the skill complete only when all are true:
   - `appium driver list --installed` includes `espresso`
   - `appium -v` succeeds
   - `appium driver doctor espresso` has no failing mandatory checks
   - `android-environment-setup` completion criteria are satisfied
   - task result includes connected-device output (`adb devices -l`) and emulator inventory (`emulator -version`, `emulator -list-avds`)
   - task result explicitly states whether emulator preparation was skipped (and why)
   - `curl -s http://127.0.0.1:4723/status` returns a successful status response
   - Appium server logs show startup/readiness successfully after the curl check
   - Appium server logs include `Available drivers:` with an `espresso` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Constraints
- Always run `appium driver doctor espresso` after each environment change.
- Use global npm/Appium commands as the default execution mode.
- Use `npx appium` only if the user explicitly asks for local execution.
- Do not skip Android prerequisite validation; rely on `android-environment-setup` for source-of-truth checks.
- Use shell-appropriate commands (`bash` for macOS/Linux, PowerShell/cmd for Windows).
- Treat optional doctor warnings as non-blocking.
- Ask the user before installing optional dependencies, and install them only when the user explicitly needs that capability.
- Prefer deterministic CLI checks over assumptions.
- If elevated privileges are required, pause and provide exact commands for the user to run.
- Do not claim success until doctor and smoke-test checks are actually green.

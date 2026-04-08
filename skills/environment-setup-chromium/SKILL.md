---
name: "environment-setup-chromium"
description: "Set up and validate an Appium Chromium Driver environment"
metadata:
   last_modified: "Wed, 08 Apr 2026 00:00:00 GMT"

---
# appium-chromium-environment-setup

## Goal
Prepares a reliable Appium Chromium Driver environment by validating Node.js/npm, ensuring Appium 3 compatibility, installing the Chromium driver, validating browser/runtime prerequisites, and running a smoke test that confirms driver availability and server readiness.

## Decision Logic
- If the host OS is not macOS, Linux, or Windows: stop and ask the user to use a supported OS.
- If current Node.js does not satisfy `engines.node` for both `appium` and `appium-chromium-driver`: install/upgrade Node.js to a compatible active LTS version.
- If current npm does not satisfy `appium-chromium-driver` `engines.npm`: upgrade npm before continuing.
- If Appium CLI is not installed: install `appium` globally.
- Use global npm/Appium commands by default (`npm install -g appium`, `appium ...`).
- Use local Appium commands (`npx appium ...`) only when the user explicitly requests local execution.
- If Appium major version is `< 3`: upgrade Appium to 3.x before installing or validating `chromium`.
- If the `chromium` driver is not installed: install it via Appium CLI.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor chromium` is supported and reports required fixes: resolve each required item and re-run doctor.
- If doctor is not supported for `chromium` in the active Appium/driver version: use install/list/smoke checks as the completion gate.
- If no supported Chromium-based browser is available (`chrome`/`chromium`/`msedge`): pause and ask the user which browser to automate and install.
- If the user does not request a pinned chromedriver version and no chromedriver binary is present in the environment: run `appium driver run chromium install-chromedriver` before smoke validation.

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
   If `node` is missing, run `environment-setup-node` first (including Windows PowerShell profile bootstrap), then open a new terminal or run `. $PROFILE`, and re-run the commands.

2. **Install/upgrade Appium and Chromium driver**
   ```bash
   npm install -g appium@latest
   appium driver install chromium || appium driver update chromium
   appium driver list --installed --json || appium driver list --installed
   ```
   Prefer `--json` output for machine-readable verification. Confirm a `chromium` key is present; only fallback to plain-text output when `--json` is unsupported.
   If the install command fails only because `chromium` is already installed, continue and do not stop preparation.

3. **Validate Appium command health and compatibility**
   macOS/Linux:
   ```bash
   appium -v
   appium driver list --installed --json || appium driver list --installed
   npm view appium engines --json
   npm view appium-chromium-driver engines peerDependencies --json
   ```
   Windows PowerShell:
   ```powershell
   appium -v
   appium driver list --installed --json; if ($LASTEXITCODE -ne 0) { appium driver list --installed }
   npm view appium engines --json
   npm view appium-chromium-driver engines peerDependencies --json
   ```
   Verify Appium major version is `3` and that active Node/npm versions satisfy the reported ranges.

4. **Validate browser availability (Chrome/Chromium/Edge)**
   macOS/Linux:
   ```bash
   command -v google-chrome || true
   command -v chromium || true
   command -v chromium-browser || true
   command -v msedge || true
   ```
   Windows PowerShell:
   ```powershell
   Get-Command chrome.exe -ErrorAction SilentlyContinue
   Get-Command msedge.exe -ErrorAction SilentlyContinue
   ```
   Confirm at least one Chromium-based browser is available and note the target browser in the result summary.

5. **Install chromedriver when missing (default) or pin it (on request)**
   If the user does not request a specific chromedriver version, first check whether a chromedriver binary is available:
   macOS/Linux:
   ```bash
   command -v chromedriver || true
   ```
   Windows PowerShell:
   ```powershell
   Get-Command chromedriver.exe -ErrorAction SilentlyContinue
   ```
   If no chromedriver binary is found, run:
   ```bash
   appium driver run chromium install-chromedriver
   ```
   Use version/directory pinning only when the user explicitly requests manual pinning or mirrored download flows.
   macOS/Linux examples:
   ```bash
   CHROMEDRIVER_VERSION=131.0.6778.3 appium driver run chromium install-chromedriver
   CHROMEDRIVER_EXECUTABLE_DIR=/path/to/dir appium driver run chromium install-chromedriver
   ```
   Windows PowerShell examples:
   ```powershell
   $env:CHROMEDRIVER_VERSION='131.0.6778.3'; appium driver run chromium install-chromedriver; Remove-Item Env:\CHROMEDRIVER_VERSION
   $env:CHROMEDRIVER_EXECUTABLE_DIR='C:\path\to\folder'; appium driver run chromium install-chromedriver; Remove-Item Env:\CHROMEDRIVER_EXECUTABLE_DIR
   ```

6. **Run Appium doctor for Chromium when supported**
   ```bash
   appium driver doctor chromium
   ```
   Use `0 required fixes needed` as the pass/fail gate when doctor is supported. Optional warnings are non-blocking. If required fixes remain, apply targeted fixes and re-run.
   If command output indicates the driver does not expose doctor checks, mark doctor as `not-supported` and continue with install/list/smoke checks.

7. **Start Appium server smoke test**
   ```bash
   appium server
   ```
   Windows PowerShell recommended form (for deterministic log checks):
   ```powershell
   appium server --log "$env:TEMP\appium-chromium-smoke.log" --log-level info
   ```
   Keep this server process running in Terminal A.

   In Terminal B, run:
   ```bash
   curl -s http://127.0.0.1:4723/status
   ```
   First confirm `/status` responds successfully.

   Then confirm startup/readiness from server logs and ensure the `Available drivers:` block contains `chromium` (for example: `- chromium@<version> (automationName 'Chromium')`).
   If startup banner logs are not available in your terminal integration, use this fallback verification path:
   - `appium driver list --installed --json` includes `chromium`
   - `/status` reports server readiness

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
   - `appium driver list --installed --json` includes `chromium` (fallback to `appium driver list --installed` if `--json` is unsupported)
   - `appium -v` succeeds and is Appium 3.x
   - active Node/npm versions satisfy `appium` and `appium-chromium-driver` engines
   - if supported, `appium driver doctor chromium` reports `0 required fixes needed` (optional warnings are allowed)
   - if unsupported, result explicitly marks doctor status as `not-supported`
   - if no chromedriver binary was present initially and no pinned version was requested, task result includes successful execution of `appium driver run chromium install-chromedriver`
   - task result includes browser availability check and the selected browser target (`chrome`, `chromium`, or `msedge`)
   - `/status` check returns a successful status response (`curl` on macOS/Linux, `Invoke-RestMethod` retry loop recommended on Windows)
   - Appium server logs show startup/readiness successfully after the status check, or readiness is confirmed by `/status` plus JSON driver listing that includes `chromium`
   - if logs are available, `Available drivers:` includes a `chromium` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Constraints
- Use global npm/Appium commands as the default execution mode.
- Use `npx appium` only if the user explicitly asks for local execution.
- Treat optional doctor warnings as non-blocking.
- Ask before installing optional dependencies or browser packages.
- Prefer deterministic CLI checks over assumptions.
- If elevated privileges are required, pause and provide exact commands for the user to run.
- Do not claim success until compatibility checks and smoke-test checks are green.
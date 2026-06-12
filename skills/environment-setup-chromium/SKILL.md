---
name: "environment-setup-chromium"
description: "Set up and validate an Appium Chromium Driver environment"
metadata:
   last_modified: "Thu, 09 Apr 2026 00:00:00 GMT"

---
# appium-chromium-environment-setup

## Goal
Prepare Appium Chromium Driver by validating Node/npm, Appium 3, driver install, browser prerequisites, and smoke checks.

## Do Not Use For
- Do not use this skill for native Android, iOS, tvOS, or non-Chromium desktop browser automation.
- Do not use this skill to install a browser when the user has not approved OS-level package installation; pause and ask for approval first.

## Decision Logic
- If host OS is not macOS, Linux, or Windows: stop.
- If Node.js misses `appium`/`appium-chromium-driver` engines: install active LTS.
- If npm misses `appium-chromium-driver` engines: upgrade npm.
- If Appium CLI is not installed: install `appium` globally.
- Use global npm/Appium (`npm install -g appium`, `appium ...`) unless the user asks for `npx`.
- If Appium major version is `< 3`: upgrade Appium to 3.x before installing or validating `chromium`.
- If the `chromium` driver is not installed: install it via Appium CLI.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor chromium` is supported and reports required fixes: resolve each required item and re-run doctor.
- If doctor is not supported for `chromium` in the active Appium/driver version: use install/list/smoke checks as the completion gate.
- If no supported Chromium-based browser is available (`chrome`/`chromium`/`msedge`): pause and ask the user which browser to automate and install.
- If no supported Chromium-based browser is available and the user explicitly approves optional browser setup: install Chrome or Chromium with OS-native package tooling, then re-run browser availability checks.
- If running inside WSL and browser install is requested: prefer distro package-manager installation as root in WSL (for example via `wsl -u root`) rather than user-space `.deb` extraction, because runtime shared-library dependencies are otherwise easy to miss.
- If Chrome is present but fails to start with missing shared libraries (for example `libnspr4.so`): treat this as an incomplete Linux dependency install and fix with package-manager dependencies before continuing.
- If the user does not request a pinned chromedriver version and no chromedriver binary is present in the environment: run `appium driver run chromium install-chromedriver` before smoke validation.
- If the user explicitly targets Microsoft Edge: treat `msedgedriver` setup as a separate optional step, require a driver version matching the installed Edge build, and pass it through `appium:executable` because automatic chromedriver download does not cover Edge.

## Instructions
1. **Run prerequisite skill**
   Run `environment-setup-node`. Continue only after its completion criteria pass.

2. **Install/upgrade Appium and Chromium driver**
   ```bash
   npm install -g appium@latest
   appium driver install chromium || appium driver update chromium
   appium driver list --installed --json || appium driver list --installed
   ```
   Only use `appium driver update chromium --unsafe` after the user approves the risk of a major driver update.
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

   Optional browser setup (run only when the user explicitly requests it):
   - macOS (Homebrew):
   ```bash
   brew install --cask google-chrome
   # or
   brew install --cask chromium
   # or
   brew install --cask microsoft-edge
   ```
   - Linux (Debian/Ubuntu examples):
  - After explicit user approval for privileged package installation, update package metadata.
  - Install either `chromium-browser`, `chromium`, or the approved Chrome/Edge package with the approved package-manager command.
  - For Microsoft Edge, get explicit user approval before adding the Microsoft package repository or keyring.

- WSL from Windows host:
  - After explicit user approval for root package installation inside WSL, install the browser runtime libraries and selected Chromium-based browser.

- Windows PowerShell (winget):
   ```powershell
   winget install --id Google.Chrome --exact --accept-source-agreements --accept-package-agreements
   # or
   winget install --id Hibbiki.Chromium --exact --accept-source-agreements --accept-package-agreements
   # or
   winget install --id Microsoft.Edge --exact --accept-source-agreements --accept-package-agreements
   ```
   After installation, re-run the browser availability checks in this step.

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

   Optional Edge WebDriver setup (run only when the user explicitly requests Microsoft Edge automation):
   - Appium Chromium Driver does not autodownload `msedgedriver`.
   - Download the Microsoft Edge WebDriver version matching the installed Edge build from the official Microsoft Edge WebDriver page:
       `https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/`
   - Verify the installed Edge version first:
   macOS:
   ```bash
   defaults read "/Applications/Microsoft Edge.app/Contents/Info" CFBundleShortVersionString
   ```
   Linux:
   ```bash
   microsoft-edge --version
   ```
   Windows PowerShell:
   ```powershell
   (Get-Item "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe").VersionInfo.ProductVersion
   ```
   - After downloading and extracting `msedgedriver`, place it in a stable path and confirm it works:
   macOS/Linux:
   ```bash
   chmod +x /path/to/msedgedriver
   /path/to/msedgedriver --version
   ```
   Windows PowerShell:
   ```powershell
   & "C:\path\to\msedgedriver.exe" --version
   ```
   - For Edge sessions, pass the absolute driver path through capabilities:
   ```json
   {
      "platformName": "macOS",
      "browserName": "MicrosoftEdge",
      "appium:automationName": "Chromium",
      "appium:executable": "/absolute/path/to/msedgedriver"
   }
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
   If `pgrep` output appears to match only the check command itself, run a stricter verification:
   ```bash
   if ps -C node -o pid=,args= | grep -E 'appium.*server' > /dev/null; then
      ps -C node -o pid=,args= | grep -E 'appium.*server'
   else
      echo "no appium server process"
   fi
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
   - if Microsoft Edge automation was explicitly requested, task result includes installed Edge version, `msedgedriver --version` output, and the absolute path intended for `appium:executable`
   - task result includes browser availability check and the selected browser target (`chrome`, `chromium`, or `msedge`)
   - if optional browser setup was requested, task result includes browser install command(s) used and the post-install browser detection output
   - `/status` check returns a successful status response (`curl` on macOS/Linux, `Invoke-RestMethod` retry loop recommended on Windows)
   - Appium server logs show startup/readiness successfully after the status check, or readiness is confirmed by `/status` plus JSON driver listing that includes `chromium`
   - if logs are available, `Available drivers:` includes a `chromium` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Doctor Gate

Prefer doctor `--json`; fall back to text. If Chromium has no doctor, mark `not-supported` and require install/list/browser/smoke gates.

If doctor output changes and cannot be classified deterministically, mark the run as `needs-manual-review` and do not mark the skill complete unless doctor is explicitly not supported and all fallback gates pass.

## Evidence To Report

- `appium -v`
- installed `chromium` driver version from `appium driver list --installed --json` or text fallback
- selected browser target and browser version
- chromedriver or `msedgedriver` version and path when used
- doctor result or explicit `not-supported` status
- `/status` smoke-test response
- server log evidence that `Available drivers:` includes `chromium`
- cleanup check showing no leftover Appium server process

## Self-Improvement Prompt

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

## Constraints
- Use global npm/Appium.
- Use `npx appium` only if asked.
- Optional warnings are non-blocking.
- Ask before optional/browser installs.
- Prefer CLI evidence.
- For privileged commands, pause and provide exact command.
- Claim success only after compatibility and smoke pass.

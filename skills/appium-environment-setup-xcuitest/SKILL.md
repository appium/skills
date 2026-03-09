---
name: "appium-environment-setup-xcuitest"
description: "Set up and validate an XCUITest Appium environment on macOS"
metadata:
  last_modified: "Sun, 08 Mar 2026 07:30:00 GMT"

---
# appium-xcuitest-environment-setup

## Goal
Prepares a stable Appium XCUITest execution environment on macOS by validating Node.js and Appium installation, installing and validating Xcode toolchains, and iterating Appium doctor checks until required items pass.

## Decision Logic
- If host OS is not macOS: stop and tell the user this skill only supports macOS.
- If Xcode is missing or command line tools are unconfigured: install/configure them before continuing.
- If current Node.js does not satisfy `engines.node` for both `appium` and `appium-xcuitest-driver`: install/upgrade Node.js to a compatible active LTS version.
- If Appium CLI or `xcuitest` driver is missing: install them via Appium CLI.
- Use global npm/Appium commands by default (`npm install -g appium`, `appium ...`).
- Use local Appium commands (`npx appium ...`) only when the user explicitly requests local execution.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor xcuitest` reports missing dependencies: fix each reported dependency and re-run doctor.

## Instructions
1. **Prepare Node.js + npm environment on macOS**
   ```bash
   sw_vers
   node -v
   npm -v
   ```
   If `node` is missing, install a compatible active LTS release and re-run the commands.

2. **Install Appium npm command and XCUITest driver**
   ```bash
   npm install -g appium
   appium driver install xcuitest || appium driver update xcuitest
   appium driver list --installed
   ```
   If the install command fails only because `xcuitest` is already installed, continue and do not stop preparation.

3. **Validate Appium npm commands and Node compatibility (after driver setup)**
   ```bash
   appium -v
   appium driver list --installed
   npm view appium engines --json
   npm view appium-xcuitest-driver engines --json
   ```
   If current Node.js does not satisfy the reported `engines.node` ranges, install/upgrade Node.js to a compatible active LTS version and re-run the setup checks.

4. **Verify Xcode command line setup and license**
   First validate Xcode availability:
   ```bash
   xcodebuild -version
   ```
   If version info is returned, continue without changing `xcode-select`.
   If version info is not returned, check the selected developer path:
   ```bash
   xcode-select -p
   ```
   If the selected path does not contain `Contents/Developer`, try setting it to the default Xcode app path:
   ```bash
   xcode-select --switch /Applications/Xcode.app/Contents/Developer
   ```
   Re-validate:
   ```bash
   xcodebuild -version
   xcode-select -p
   ```
   Then ensure license and first-launch tasks are complete (use privilege escalation only if prompted/required):
   ```bash
   xcodebuild -license accept
   xcodebuild -runFirstLaunch
   ```

5. **Optional helper tools**
   Install additional iOS helper tools only if the user explicitly requests capabilities that require them.

6. **Run Appium doctor for XCUITest and fix in a loop**
   ```bash
   appium driver doctor xcuitest
   ```
   Resolve each failing mandatory check, then re-run until the doctor output is clean.

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
   Then confirm readiness from server logs and ensure the `Available drivers:` block contains `xcuitest` (for example: `- xcuitest@10.23.3 (automationName 'XCUITest')`).
   After smoke validation, clean up the running Appium server:
   - In Terminal A, stop the server with `Ctrl+C`.
   - Verify no leftover Appium server process (Terminal B):
   ```bash
   pgrep -fl "appium.*server" || echo "no appium server process"
   ```

8. **Agent completion criteria**
   Mark the skill complete only when all are true:
   - `appium driver list --installed` includes `xcuitest`
   - `appium -v` succeeds
   - `appium driver doctor xcuitest` has no failing mandatory checks
   - `curl -s http://127.0.0.1:4723/status` returns a successful status response
   - Appium server logs show startup/readiness successfully after the curl check
   - Appium server logs include `Available drivers:` with an `xcuitest` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Constraints
- This skill is macOS-only; do not provide Linux/Windows alternatives.
- Use global npm/Appium commands as the default execution mode.
- Use `npx appium` only if the user explicitly asks for local execution.
- Always re-run `appium driver doctor xcuitest` after every fix.
- Treat optional doctor warnings as non-blocking.
- Ask the user before installing optional dependencies, and install them only when explicitly needed.
- Do not skip Xcode license and first-launch checks.
- If privileged commands are required, pause and provide the exact command for user execution.
- Do not report readiness until doctor and smoke tests pass.

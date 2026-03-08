---
name: "appium-environment-setup-xcuitest"
description: "Set up and validate an XCUITest Appium environment on macOS"
metadata:
  model: "GPT-5.3-Codex"
  last_modified: "Sun, 08 Mar 2026 00:00:00 GMT"

---
# appium-xcuitest-environment-setup

## Goal
Prepares a stable Appium XCUITest execution environment on macOS by validating Node.js and Appium installation, installing and validating Xcode toolchains, preparing iOS simulator/device tooling, and iterating Appium doctor checks until required items pass.

## Decision Logic
- If host OS is not macOS: stop and tell the user this skill only supports macOS.
- If Xcode is missing or command line tools are unconfigured: install/configure them before continuing.
- If current Node.js does not satisfy `engines.node` for both `appium` and `appium-xcuitest-driver`: install/upgrade Node.js to a compatible active LTS version.
- If npm health checks fail (`npm doctor`, `npm ping`): resolve npm environment issues before driver setup.
- If Appium CLI or `xcuitest` driver is missing: install them via Appium CLI.
- If global npm install is blocked: install Appium locally and use `npx appium` commands.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor xcuitest` reports missing dependencies: fix each reported dependency and re-run doctor.
- If iOS simulator runtime is unavailable: install at least one simulator runtime and retry validation.

## Instructions
1. **Prepare Node.js + npm environment on macOS**
   ```bash
   sw_vers
   node -v
   npm -v
   npm config get prefix
   npm config get cache
   npm ping
   npm doctor
   xcodebuild -version
   xcode-select -p
   ```
   If `node` is missing, install a compatible active LTS release and re-run the commands.
   If npm health checks fail, resolve issues before continuing.

2. **Install Appium npm command (global or local fallback) and XCUITest driver**
   ```bash
   npm install -g appium
   appium driver install xcuitest || appium driver update xcuitest
   appium driver list --installed
   ```
   If the install command fails only because `xcuitest` is already installed, continue and do not stop preparation.
   If global install is restricted, use local install:
   ```bash
   npm init -y
   npm install --save-dev appium
   npx appium driver install xcuitest || npx appium driver update xcuitest
   npx appium driver list --installed
   ```

3. **Validate Appium npm commands and Node compatibility (after driver setup)**
   ```bash
   appium -v
   appium driver list --installed
   npx appium -v
   npx appium driver list --installed
   npm view appium engines --json
   npm view appium-xcuitest-driver engines --json
   ```
   If current Node.js does not satisfy the reported `engines.node` ranges, install/upgrade Node.js to a compatible active LTS version and re-run the setup checks.

4. **Verify Xcode command line setup and license**
   If needed:
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   xcodebuild -runFirstLaunch
   ```

5. **Validate iOS simulator tooling**
   ```bash
   xcrun simctl list devices
   xcrun simctl list runtimes
   ```
   Ensure at least one available iOS runtime and bootable simulator device exist.

6. **Optional helper tools**
   Install additional iOS helper tools only if the user explicitly requests capabilities that require them.

7. **Run Appium doctor for XCUITest and fix in a loop**
   ```bash
   appium driver doctor xcuitest
   ```
   Also validate local-install command path when relevant:
   ```bash
   npx appium driver doctor xcuitest
   ```
   Resolve each failing mandatory check, then re-run until the doctor output is clean.

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
   Then confirm readiness from server logs and ensure the `Available drivers:` block contains `xcuitest` (for example: `- xcuitest@10.23.3 (automationName 'XCUITest')`).
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
   - Verify no leftover Appium server process (Terminal B):
   ```bash
   pgrep -fl "appium.*server" || echo "no appium server process"
   ```

9. **Agent completion criteria**
   Mark the skill complete only when all are true:
   - `appium driver list --installed` includes `xcuitest`
   - npm environment is healthy (`npm doctor` without blocking failures)
   - at least one Appium npm command mode works (`appium` or `npx appium`)
   - `appium driver doctor xcuitest` has no failing mandatory checks
   - `xcrun simctl list devices` returns available simulator targets
   - `curl -s http://127.0.0.1:4723/status` returns a successful status response
   - Appium server logs show startup/readiness successfully after the curl check
   - Appium server logs include `Available drivers:` with an `xcuitest` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Constraints
- This skill is macOS-only; do not provide Linux/Windows alternatives.
- Always re-run `appium driver doctor xcuitest` after every fix.
- Always validate npm environment (`npm doctor`) before driver installation.
- Treat optional doctor warnings as non-blocking.
- Ask the user before installing optional dependencies, and install them only when explicitly needed.
- Do not skip Xcode license and first-launch checks.
- If privileged commands are required, pause and provide the exact command for user execution.
- Do not report readiness until doctor and smoke tests pass.

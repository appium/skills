---
name: "environment-setup-xcuitest"
description: "Set up and validate an XCUITest Appium environment on macOS"
metadata:
   last_modified: "Mon, 06 Apr 2026 00:00:00 GMT"

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
- If the user explicitly requests media features that require FFmpeg: run `environment-setup-ffmpeg` before final validation.
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
   appium driver list --installed --json || appium driver list --installed
   ```
   Prefer `--json` output for machine-readable verification. Confirm an `xcuitest` key is present; only fallback to plain-text output when `--json` is unsupported.
   If the install command fails only because `xcuitest` is already installed, continue and do not stop preparation.

3. **Validate Appium npm commands and Node compatibility (after driver setup)**
   ```bash
   appium -v
   appium driver list --installed --json || appium driver list --installed
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
   sudo xcodebuild -license accept
   xcodebuild -runFirstLaunch
   ```

5. **Optional helper tools**
   Install additional iOS helper tools only if the user explicitly requests capabilities that require them.
   - For FFmpeg-related capabilities, run `environment-setup-ffmpeg`.

6. **Run Appium doctor for XCUITest and fix in a loop**
   ```bash
   appium driver doctor xcuitest
   ```
   Use `0 required fixes needed` as the pass/fail gate. Optional warnings are non-blocking. Resolve required fixes, then re-run until this gate is met.
   For deterministic automation, parse the doctor output for that exact phrase instead of relying on visual formatting.
   `applesimutils` warnings are optional for basic simulator session creation, but recommended when you need permission-management helper APIs.

7. **Optional simulator readiness preflight**
   Before smoke testing, you may verify simulator availability to reduce false failures in session creation:
   ```bash
   xcrun simctl list devices
   ```
   If required by your flow, boot a target simulator before session creation.

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
   If startup banner logs are not available in your terminal integration, use this fallback verification path:
   - `appium driver list --installed --json` includes `xcuitest`
   - `/status` reports server readiness
   After smoke validation, clean up the running Appium server:
   - In Terminal A, stop the server with `Ctrl+C`.
   - Verify no leftover Appium server process (Terminal B):
   ```bash
   pgrep -fl "appium.*server" || echo "no appium server process"
   ```

9. **Agent completion criteria**
   Mark the skill complete only when all are true:
   - `appium driver list --installed --json` includes `xcuitest` (fallback to `appium driver list --installed` if `--json` is unsupported)
   - `appium -v` succeeds
   - `appium driver doctor xcuitest` reports `0 required fixes needed` (optional warnings are allowed)
   - `curl -s http://127.0.0.1:4723/status` returns a successful status response
   - Appium server logs show startup/readiness successfully after the curl check, or (if banner logs are unavailable) readiness is confirmed by `/status` plus JSON driver listing that includes `xcuitest`
   - If logs are available, `Available drivers:` includes an `xcuitest` entry
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

---
name: "environment-setup-xcuitest"
description: "Set up and validate an XCUITest Appium environment on macOS"
metadata:
   last_modified: "Mon, 06 Apr 2026 00:00:00 GMT"

---
# appium-xcuitest-environment-setup

## Goal
Prepare Appium XCUITest on macOS by validating Node/Appium, Xcode, doctor, and smoke checks until `0 required fixes needed`.

## Decision Logic
- If host OS is not macOS: stop.
- If Xcode is missing or command line tools are unconfigured: install/configure them before continuing.
- If Node.js misses `appium`/`appium-xcuitest-driver` engines: install active LTS.
- If Appium CLI or `xcuitest` driver is missing: install them via Appium CLI.
- Use global npm/Appium (`npm install -g appium`, `appium ...`) unless the user asks for `npx`.
- If requested, run `environment-setup-ffmpeg` before final validation.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor xcuitest` reports missing dependencies: fix each reported dependency and re-run doctor.

## Do Not Use For
- Do not use this skill for physical iOS/tvOS device provisioning, signing, or WDA preinstall flows; use `xcuitest-real-device-config` after this skill passes.
- Do not use this skill for Android, Chromium, FFmpeg-only, or Node-only setup.


## Instructions
1. **Run prerequisite skill**
   Run `environment-setup-node`. On macOS, also verify Xcode basics before continuing.

2. **Install XCUITest driver**
   ```bash
   npm install -g appium
   appium driver install xcuitest || appium driver update xcuitest
   appium driver list --installed --json || appium driver list --installed
   ```
   Use `--unsafe` update only with user approval. Confirm `xcuitest` is installed.

3. **Validate Xcode and simulator access**
   ```bash
   xcodebuild -version
   xcode-select -p
   xcrun simctl list devices available
   ```
   Run Xcode license acceptance or first-launch setup only after explicit user approval for the exact command; report why it is needed and how to retry if it fails.

4. **Optional FFmpeg**
   If requested, run `environment-setup-ffmpeg`.

5. **Run Appium doctor for XCUITest and fix in a loop**
   ```bash
   appium driver doctor xcuitest
   ```
   Use `0 required fixes needed` as the pass/fail gate. Optional warnings are non-blocking. Resolve required fixes, then re-run until this gate is met.
   For deterministic automation, parse the doctor output for that exact phrase instead of relying on visual formatting.
   `applesimutils` warnings are optional for basic simulator session creation, but recommended when you need permission-management helper APIs.
   Bash gate example:
   ```bash
   DOCTOR_OUT="$(appium driver doctor xcuitest 2>&1)"
   echo "$DOCTOR_OUT" | grep -q "0 required fixes needed" || { echo "$DOCTOR_OUT"; exit 1; }
   echo "$DOCTOR_OUT" | grep -E "0 required fixes needed|optional fix"
   ```
   PowerShell gate example:
   ```powershell
   $doctorOut = appium driver doctor xcuitest 2>&1 | Out-String
   if ($doctorOut -notmatch '0 required fixes needed') { throw "Doctor required fixes remain" }
   $doctorOut | Select-String '0 required fixes needed|optional fix'
   ```
   Changed doctor wording fallback:
   1. Re-run doctor once with `appium driver doctor xcuitest --json`.
   2. If JSON is unsupported, capture full text output.
   3. Accept a pass only when structured output or the text summary clearly indicates zero required issues.
   4. If still ambiguous, mark status as `needs-manual-review` and do not mark the skill complete.

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
   - task result includes the doctor summary line with required/optional fix counts
   - `curl -s http://127.0.0.1:4723/status` returns a successful status response
   - Appium server logs show startup/readiness successfully after the curl check, or (if banner logs are unavailable) readiness is confirmed by `/status` plus JSON driver listing that includes `xcuitest`
   - If logs are available, `Available drivers:` includes an `xcuitest` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Doctor Gate

Prefer doctor `--json`; fall back to text. Require `0 required fixes needed`.

If doctor output changes and cannot be classified deterministically, mark the run as `needs-manual-review` and do not mark the skill complete.

## Evidence To Report

- `appium -v`
- installed `xcuitest` driver version from `appium driver list --installed --json` or text fallback
- `xcodebuild -version`
- active `xcode-select -p`
- doctor result, preferring structured required/optional fix counts
- simulator inventory when simulator validation is run
- `/status` smoke-test response
- server log evidence that `Available drivers:` includes `xcuitest`
- cleanup check showing no leftover Appium server process

## Self-Improvement Prompt

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

## Constraints
- This skill is macOS-only; do not provide Linux/Windows alternatives.
- Use global npm/Appium.
- Use `npx appium` only if asked.
- Always re-run `appium driver doctor xcuitest` after every fix.
- Optional warnings are non-blocking.
- Ask before optional installs.
- Do not skip Xcode license and first-launch checks.
- If privileged commands are required, pause and provide the exact command for user execution.
- Report readiness only after doctor and smoke pass.

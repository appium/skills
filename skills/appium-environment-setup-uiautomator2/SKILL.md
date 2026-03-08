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
- If Node.js major version is `< 20`: install/upgrade Node.js to an active LTS version.
- If npm health checks fail (`npm doctor`, `npm ping`): resolve npm environment issues before driver setup.
- If Appium CLI is not installed: install `appium` globally.
- If global npm install is blocked: install Appium locally and use `npx appium` commands.
- If Android SDK prerequisites are missing (`adb`, emulator binary, SDK packages): run `appium-android-environment-setup` first.
- If the `uiautomator2` driver is not installed: install it via Appium CLI.
- If `appium driver doctor uiautomator2` reports missing dependencies: resolve each missing item and re-run doctor.

## Instructions
1. **Prepare Node.js + npm environment**
   Run:
   ```bash
   node -v
   npm -v
   npm config get prefix
   npm config get cache
   npm ping
   npm doctor
   ```
   If `node` is missing or outdated, install a current LTS release and re-run the commands.
   If npm checks fail, resolve npm environment issues before continuing.

2. **Install Appium npm command (global or local fallback)**
   ```bash
   npm install -g appium
   appium driver install uiautomator2
   appium driver list --installed
   ```
   If global install is not allowed, use project-local installation:
   ```bash
   npm init -y
   npm install --save-dev appium
   npx appium driver install uiautomator2
   npx appium driver list --installed
   ```

3. **Validate Appium npm commands**
   ```bash
   appium -v
   appium driver list --installed
   npx appium -v
   npx appium driver list --installed
   ```

4. **Run Android environment prerequisite skill**
   Before UiAutomator2 doctor checks, execute `appium-android-environment-setup` and do not continue until it passes completion criteria.

5. **Verify Android prerequisites from this skill context**
   ```bash
   command -v adb
   adb version
   echo "$ANDROID_HOME"
   ls "$ANDROID_HOME/emulator/emulator"
   test -x "$ANDROID_HOME/emulator/emulator" && echo "emulator binary: OK"
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
   In another terminal:
   ```bash
   curl -s http://127.0.0.1:4723/status
   ```
   If using local Appium install:
   ```bash
   npx appium server
   ```

8. **Agent completion criteria**
   Mark the skill complete only when all are true:
   - `appium driver list --installed` includes `uiautomator2`
   - npm environment is healthy (`npm doctor` without blocking failures)
   - at least one Appium npm command mode works (`appium` or `npx appium`)
   - `appium driver doctor uiautomator2` has no failing mandatory checks
   - `appium-android-environment-setup` completion criteria are satisfied
   - Appium status endpoint responds successfully

## Constraints
- Always run `appium driver doctor uiautomator2` after each environment change.
- Always validate npm environment (`npm doctor`) before driver installation.
- Do not skip Android prerequisite validation; rely on `appium-android-environment-setup` for source-of-truth checks.
- Treat optional doctor warnings as non-blocking.
- Ask the user before installing optional dependencies, and install them only when the user explicitly needs that capability.
- Prefer deterministic CLI checks over assumptions.
- If elevated privileges are required, pause and provide exact commands for the user to run.
- Do not claim success until doctor and smoke-test checks are actually green.

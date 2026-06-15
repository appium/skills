---
name: "xcui-01"
description: "Preserved xcuitest setup procedure part 1 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# xcuitest Part 1

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-xcuitest.md; strip this generated header when comparing -->

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

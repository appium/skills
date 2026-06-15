---
name: "espresso-01"
description: "Preserved espresso setup procedure part 1 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# espresso Part 1

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-espresso.md; strip this generated header when comparing -->

---
name: "environment-setup-espresso"
description: "Set up and validate an Espresso Appium environment on Android"
metadata:
   last_modified: "Mon, 06 Apr 2026 00:00:00 GMT"

---
# appium-espresso-environment-setup

## Goal
Prepare Appium Espresso by validating Node/Appium, Android/Java, doctor, and smoke checks until `0 required fixes needed`.

## Decision Logic
- If host OS is not macOS, Linux, or Windows: stop.
- If Node.js misses `appium`/`appium-espresso-driver` engines: install active LTS.
- If Appium CLI is not installed: install `appium` globally.
- Use global npm/Appium (`npm install -g appium`, `appium ...`) unless the user asks for `npx`.
- If Android SDK prerequisites are missing (`adb`, emulator, SDK packages): run `environment-setup-android`.
- If requested, run `environment-setup-ffmpeg` or `environment-setup-bundletool` before final validation.
- Report device/emulator inventory.
- If the `espresso` driver is not installed: install it via Appium CLI.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor espresso` reports missing dependencies: resolve each missing item and re-run doctor.

## Instructions
1. **Run prerequisite skills**
   Run `environment-setup-node`, then `environment-setup-android`. Continue only after both completion criteria pass.

2. **Install Espresso driver**
   ```bash
   npm install -g appium
   appium driver install espresso || appium driver update espresso
   appium driver list --installed --json || appium driver list --installed
   ```
   Use `--unsafe` update only with user approval. Confirm `espresso` is installed.


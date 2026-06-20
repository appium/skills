---
id: setup-references-environment-setup-uiautomator2
owner: skills/setup
status: stable
source: skills/setup/references/environment-setup-uiautomator2.md
---

# appium-uiautomator2-environment-setup

## Goal

Prepare Appium UiAutomator2 by validating Node/Appium, Android prerequisites, driver installation, doctor checks, and server smoke evidence until required fixes are zero.

## Routing

Load these references in order:

1. `environment-setup-node.md` for Node.js and npm.
2. `environment-setup-android.md` for Java, Android SDK, ADB, emulator, device, and SDK package validation.
3. `uiautomator2/uiautomator2-decision-logic.md` for driver setup triggers and optional dependency boundaries.
4. `uiautomator2/uiautomator2-driver-install.md` for global Appium and UiAutomator2 driver installation.
5. `uiautomator2/uiautomator2-doctor-validation.md` for required doctor pass criteria.
6. `uiautomator2/uiautomator2-smoke-status.md` for server `/status`, log evidence, and cleanup.

For deterministic read-only validation, run:

```bash
node skills/setup/scripts/check-uiautomator2-env.mjs
```

## Completion Criteria

- `environment-setup-android` completion criteria are satisfied.
- `appium -v` succeeds in the selected command mode.
- `appium driver list --installed --json` or text fallback includes `uiautomator2`.
- `appium driver doctor uiautomator2` reports `0 required fixes needed`; optional warnings do not block completion.
- `/status` returns a successful Appium server response during smoke validation.
- Server logs show available drivers and include `uiautomator2`.
- Cleanup check reports no leftover Appium server process.

## Evidence To Report

Report Appium version, UiAutomator2 driver version, doctor required/optional summary, Android prerequisite summary, `/status` result, server log driver evidence, and cleanup result.

## Constraints

Use global npm/Appium commands by default. Use `npx appium` only when the user explicitly asks for local mode. Ask before installing optional FFmpeg, bundletool, or screen-streaming dependencies.

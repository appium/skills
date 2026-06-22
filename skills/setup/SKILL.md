---
owner: appium
name: "setup"
description: "Route Appium environment setup requests to canonical setup contexts for Node.js, Appium drivers, Android, XCUITest, Espresso, Gecko, Chromium, Safari, Mac2, bundletool, FFmpeg, and smoke validation evidence."
requires_context: contexts/tools/appium/setup/routing.md, contexts/tools/appium/setup/node-environment.md, contexts/tools/appium/setup/uiautomator2-environment.md, contexts/tools/appium/setup/espresso-environment.md, contexts/tools/appium/setup/gecko-environment.md, contexts/tools/appium/setup/mac2-environment.md, contexts/tools/appium/setup/ffmpeg-environment.md
---

# Appium Router Entry

## Required inputs

Before running this workflow, confirm the target platform, Appium driver, command mode (`appium` global by default or `npx appium` only when requested), host OS, relevant devices or simulators, available permissions, and whether the user explicitly requested optional dependencies such as FFmpeg or bundletool.

## Route

Use this thin entrypoint for Appium environment setup work. Load `contexts/tools/appium/setup/routing.md` first, then load only the setup contexts, profiles, references, examples, and scripts that match the requested driver, platform, and install mode. Canonical setup assets live under `contexts/tools/appium/setup/`; executable helpers live under `tools/appium/setup/scripts/`.

## When Not To Use

do not use for mismatched requests; choose the routed alternative below.

Do not use this skill for diagnosing a failing session after setup has run; route that input to `skills/appium-troubleshooting/SKILL.md`. Do not use this skill for real iOS or tvOS signing and WebDriverAgent deployment; route that input to `skills/xcuitest-real-device-config/SKILL.md`.

## Evidence

Example input: `Set up Appium UiAutomator2 and verify Android SDK, Java, ADB, emulator, and driver readiness.` Verify by running the matching helper from `tools/appium/setup/scripts/` when a context asks for it, then report pass/fail evidence.

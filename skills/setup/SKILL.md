---
name: "setup"
description: "Route Appium setup to Node.js, Android, UiAutomator2, Espresso, Chromium, Gecko, Mac2, Safari, XCUITest, FFmpeg, or bundletool references; keep optional installs gated."
---

# setup

## Use When

Use for Appium environment setup. This router selects setup profiles, references, and examples for the requested platform/driver.

## Do Not Use For

- Failing Appium sessions: use `skills/appium-troubleshooting/SKILL.md`.
- Real iOS device signing/WDA setup after simulator setup: use `skills/xcuitest-real-device-config/SKILL.md`.
- Optional FFmpeg or bundletool setup unless explicitly requested.

## Preflight

Confirm target platform, driver, host OS, command mode (`appium` default, `npx appium` only when requested), available devices/browsers, and optional dependency requests.

## Routing

Always load the matching profile, `references/environment-setup-node.md`, and only the required target references:

- Android SDK: `references/environment-setup-android.md`
- UiAutomator2: `references/environment-setup-uiautomator2.md`
- Espresso: `references/environment-setup-espresso.md`
- Chromium: `references/environment-setup-chromium.md`
- Gecko: `references/environment-setup-gecko.md`
- Mac2: `references/environment-setup-mac2.md`
- Safari: `references/environment-setup-safari.md`
- XCUITest: `references/environment-setup-xcuitest.md`
- FFmpeg: `references/environment-setup-ffmpeg.md` only on explicit request
- bundletool: `references/environment-setup-bundletool.md` only on explicit request

Profiles: `profiles/android.md`, `profiles/chromium.md`, `profiles/gecko.md`, `profiles/mac2.md`, `profiles/macos.md`, `profiles/safari.md`, `profiles/xcuitest.md`, plus `profiles/global-appium.md` or `profiles/local-npx.md`.

Examples: `examples/uiautomator2.md`, `examples/espresso.md`, `examples/chromium.md`, `examples/gecko.md`, `examples/mac2.md`, `examples/safari.md`, `examples/xcuitest.md`.

## Rules

Run commands step by step. Ask before optional installs, privileged package-manager commands, or `sudo`. Prefer user-space/global Appium setup. Re-run checks after each fix.

## Done

Completion requires the selected reference criteria. Driver doctor required fixes must be `0` when doctor is supported; optional warnings do not block. Apply the loaded reference's self-improvement prompt before the final response.

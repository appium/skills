---
name: "setup"
description: "Route first-time or corrective Appium environment preparation to Node.js, Android, UiAutomator2, Espresso, Chromium, Gecko, Mac2, Safari, XCUITest, FFmpeg, or bundletool references; keep optional installs gated."
requires_context: contexts/tools/appium/setup/routing.md, contexts/tools/appium/setup/node-environment.md, contexts/tools/appium/setup/uiautomator2-environment.md, contexts/tools/appium/setup/espresso-environment.md, contexts/tools/appium/setup/gecko-environment.md, contexts/tools/appium/setup/mac2-environment.md, contexts/tools/appium/setup/ffmpeg-environment.md
---

# Appium Router

## Use When

Use this skill for Appium environment preparation. This router selects setup profiles, references, and samples for the requested platform or driver.

## Out Of Scope

- Post-setup Appium failures: use `skills/appium-troubleshooting/SKILL.md`.
- Real iOS device signing or WDA setup after simulator setup: use `skills/xcuitest-real-device-config/SKILL.md`.
- Optional FFmpeg or bundletool preparation unless explicitly requested.

## Intake

Load `contexts/tools/appium/setup/routing.md`. Confirm target platform, driver, host OS, command mode (`appium` default, `npx appium` only when requested), available devices or browsers, and optional dependency requests.

## Routing

Load the matching profile, `contexts/tools/appium/setup/node-environment.md`, and only the required target references:

- Android SDK: `references/environment-setup-android.md`
- UiAutomator2: `contexts/tools/appium/setup/uiautomator2-environment.md`
- Espresso: `contexts/tools/appium/setup/espresso-environment.md`
- Chromium: `references/environment-setup-chromium.md`
- Gecko: `contexts/tools/appium/setup/gecko-environment.md`
- Mac2: `contexts/tools/appium/setup/mac2-environment.md`
- Safari: `references/environment-setup-safari.md`
- XCUITest: `references/environment-setup-xcuitest.md`
- FFmpeg: `contexts/tools/appium/setup/ffmpeg-environment.md` only on explicit request
- bundletool: `references/environment-setup-bundletool.md` only on explicit request

Profiles: `profiles/android.md`, `profiles/chromium.md`, `profiles/gecko.md`, `profiles/mac2.md`, `profiles/macos.md`, `profiles/safari.md`, `profiles/xcuitest.md`, plus `profiles/global-appium.md` or `profiles/local-npx.md`.

Samples: `examples/uiautomator2.md`, `examples/espresso.md`, `examples/chromium.md`, `examples/gecko.md`, `examples/mac2.md`, `examples/safari.md`, `examples/xcuitest.md`.

Nested setup support inventory: `references/support-inventory.md`.

## Execution

Run commands step by step. Ask before optional installs, privileged package-manager commands, or `sudo`. Prefer user-space and global Appium setup. Re-run checks after each fix.

## Completion

Completion requires the selected reference criteria. Driver doctor required fixes must be `0` when doctor is supported; optional warnings do not block. Apply the loaded reference's self-improvement prompt before the final response.

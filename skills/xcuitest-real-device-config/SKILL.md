---
name: "xcuitest-real-device-config"
description: "Route macOS real iOS or tvOS device preparation for Appium XCUITest, including device trust, Developer Mode, provisioning profiles, WebDriverAgent signing, and deployment patterns."
---

# xcuitest-real-device-config

## Use When

Use this skill after XCUITest setup is complete and the user needs a physical iOS or tvOS device prepared for Appium automation.

## Do Not Use For

Do not use this skill for simulators, Android devices, desktop Chromium, or first-time XCUITest prerequisite setup. Use `skills/setup/SKILL.md` and `references/environment-setup-xcuitest.md` before this skill.

## Preflight

Confirm the host is macOS, the target device is connected and trusted, XCUITest setup has passed, and the user has identified the intended signing approach: free Apple ID, paid Apple Developer account, enterprise profile, prebuilt WDA, preinstalled WDA, or running WDA URL.

## Reference Map

Load `references/real-device-procedure.md` for the complete procedure. Follow its steps one at a time, and pause for physical-device actions such as Trust prompts or Developer Mode toggles.

## Examples

- "Configure my iPhone for real-device XCUITest" -> verify XCUITest setup, then load the real-device procedure.
- "Use preinstalled WDA on iOS 17" -> load the real-device procedure and follow its WDA signing and verification path.

## Verification

Completion requires the device to appear in `xcrun xctrace list devices`, a signing/provisioning path to be applied without WDA install errors, code signatures to verify after any WDA bundle modification, and at least one WDA deployment method to work.

After completing configuration, apply the loaded procedure's `Self-Improvement Prompt` section.

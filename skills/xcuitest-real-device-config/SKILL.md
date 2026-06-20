---
name: "xcuitest-real-device-config"
description: "Route macOS real iOS or tvOS device preparation for Appium XCUITest, including device trust, Developer Mode, provisioning profiles, WebDriverAgent signing, and deployment patterns."
---

# XCUITest Real Device Router

## Use When

Use this skill after XCUITest setup is complete and the user needs a physical iOS or tvOS device prepared for Appium automation.

## Out Of Scope

For simulators, Android devices, desktop Chromium, or first-time XCUITest prerequisite setup, use `skills/setup/SKILL.md` and `references/environment-setup-xcuitest.md` before this skill.

## Intake

Load `contexts/xcuitest-real-device-readiness.md`. Confirm the host is macOS, the target device is connected and trusted, XCUITest setup has passed, and the user has identified the intended signing approach: free Apple ID, paid Apple Developer account, enterprise profile, prebuilt WDA, preinstalled WDA, or running WDA URL.

## Reference Map

Load these references in order for the complete procedure:
1. `references/real-device-procedure-part1.md`
2. `references/real-device-procedure-part2.md`
3. `references/real-device-procedure-part3.md`
4. `references/real-device-procedure-part4.md`
5. `references/real-device-procedure-part5.md`
6. `references/real-device-procedure-part6.md`
7. `references/real-device-procedure-part7.md`
8. `references/real-device-procedure-part8.md`
9. `references/real-device-procedure-part9.md`

Follow the steps one at a time, and pause for physical-device actions such as Trust prompts or Developer Mode toggles.

## Profile Map

Load only the signing and deployment profiles that match the user's path:

- Free Apple ID signing: `profiles/free-apple-id.md`
- Paid Apple Developer signing: `profiles/paid-developer.md`
- Enterprise provisioning profile: `profiles/enterprise-profile.md`
- Preinstalled WDA: `profiles/preinstalled-wda.md`
- Prebuilt WDA: `profiles/prebuilt-wda.md`
- Running WDA URL attach mode: `profiles/running-wda-url.md`

## Samples

- Real iOS/tvOS device setup: `examples/real-device.md`

## Completion

Completion requires the device to appear in `xcrun xctrace list devices`, a signing or provisioning path to be applied without WDA install errors, code signatures to verify after any WDA bundle modification, and at least one WDA deployment method to work.

After completing configuration, apply the loaded procedure's self-improvement prompt.

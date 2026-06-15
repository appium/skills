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

## Profile Map

Load only the signing and deployment profiles that match the user's path:

- Free Apple ID signing: `profiles/free-apple-id.md`
- Paid Apple Developer signing: `profiles/paid-developer.md`
- Enterprise provisioning profile: `profiles/enterprise-profile.md`
- Preinstalled WDA: `profiles/preinstalled-wda.md`
- Prebuilt WDA: `profiles/prebuilt-wda.md`
- Running WDA URL attach mode: `profiles/running-wda-url.md`

## Examples

- Real iOS/tvOS device setup: `examples/real-device.md`

## Verification

Completion requires the device to appear in `xcrun xctrace list devices`, a signing/provisioning path to be applied without WDA install errors, code signatures to verify after any WDA bundle modification, and at least one WDA deployment method to work.
## Preserved Split References
When a split index is selected, load these parts in order; they preserve original procedures exactly: references/realdev-01.md references/realdev-02.md references/realdev-03.md references/realdev-04.md references/realdev-05.md references/realdev-06.md references/realdev-07.md references/realdev-08.md references/realdev-09.md references/realdev-10.md references/realdev-11.md references/realdev-12.md references/realdev-13.md references/realdev-14.md

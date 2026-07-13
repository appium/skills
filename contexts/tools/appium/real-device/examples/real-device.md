---
security_profile: appium-local-workflows
owner: appium
id: appium.real-device.examples.real-device

---

# Example: Real iOS/tvOS Device Setup

Use this repository's skills to prepare macOS + XCUITest for a real iOS or tvOS device.

1. Load `skills/setup/SKILL.md`.
2. Load `contexts/platform/macos/profile.md`.
3. Load `contexts/tools/appium/setup/profiles/xcuitest.md`.
4. Load `contexts/tools/appium/setup-basics.md`.
5. Load `contexts/platform/ios/simulator-setup.md`.
6. Load `skills/xcuitest-real-device-config/SKILL.md`.
7. Load the signing and WDA deployment profiles that match the user's path.
8. Load `contexts/tools/appium/real-device/references/real-device-procedure-part1.md`, `contexts/tools/appium/real-device/references/real-device-procedure-part2.md`, `contexts/tools/appium/real-device/references/real-device-procedure-part3.md`, `contexts/tools/appium/real-device/references/real-device-procedure-part4.md`, `contexts/tools/appium/real-device/references/real-device-procedure-part5.md`, `contexts/tools/appium/real-device/references/real-device-procedure-part6.md`, `contexts/tools/appium/real-device/references/real-device-procedure-part7.md`, `contexts/tools/appium/real-device/references/real-device-procedure-part8.md`, and `contexts/tools/appium/real-device/references/real-device-procedure-part9.md` in order.

Rules:

- Pause for physical-device actions such as Trust prompts or Developer Mode toggles.
- Ask before installing optional third-party device tools.
- When a WDA bundle is modified after signing, always re-sign with `codesign` before installing.

Completion criteria:

1. Device is visible in `xcrun xctrace list devices`.
2. A provisioning profile approach has been fully applied without WDA install signing errors.
3. If WDA was modified, `codesign --verify --verbose` confirms a valid signature.
4. At least one WDA deployment method is confirmed working.

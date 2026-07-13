---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.profiles.xcuitest

---

# XCUITest Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile for iOS/tvOS XCUITest setup on macOS.

- Load Node.js and XCUITest references.
- Validate Xcode, command line tools, simulator availability, Appium XCUITest driver, and doctor output.
- For real iOS or tvOS devices, complete the shared setup prerequisites first, then continue with signing and WebDriverAgent deployment in `skills/xcuitest-real-device-config/SKILL.md`.

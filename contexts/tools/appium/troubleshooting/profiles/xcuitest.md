---
security_profile: appium-local-workflows
owner: appium
id: appium.troubleshooting.profiles.xcuitest

---

# XCUITest Troubleshooting Profile

Base skill: `skills/appium-troubleshooting/SKILL.md`

Use this profile when the failing session uses `appium:automationName` `XCUITest`.

- Keep scope on Xcode, simulator or device state, WebDriverAgent build/signing/deployment, and XCUITest driver logs.
- Load `contexts/tools/appium/troubleshooting/references/xcuitest-troubleshooting.md` for WDA startup, signing, or deployment failures.
- Load `contexts/tools/appium/troubleshooting/references/xcuitest-element-lookup.md` and `contexts/tools/appium/troubleshooting/references/xcuitest-locators.md` for element lookup or locator strategy failures.

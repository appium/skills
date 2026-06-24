---
maint_scope: "contexts/tools/appium/troubleshooting/profiles/xcuitest.md"
owner: appium
policy_scope: "contexts/tools/appium/troubleshooting/profiles/xcuitest.md"
id: appium.troubleshooting.profiles.xcuitest
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/troubleshooting/profiles/xcuitest.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/troubleshooting/profiles/xcuitest.md bounded command output, local paths, driver names, IDs, and logs

---

# XCUITest Troubleshooting Profile

Base skill: `skills/appium-troubleshooting/SKILL.md`

Use this profile when the failing session uses `appium:automationName` `XCUITest`.

- Keep scope on Xcode, simulator or device state, WebDriverAgent build/signing/deployment, and XCUITest driver logs.
- Load `contexts/tools/appium/troubleshooting/references/xcuitest-troubleshooting.md` for WDA startup, signing, or deployment failures.
- Load `contexts/tools/appium/troubleshooting/references/xcuitest-element-lookup.md` and `contexts/tools/appium/troubleshooting/references/xcuitest-locators.md` for element lookup or locator strategy failures.

---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/xcuitest.md"
id: appium.setup.profiles.xcuitest
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/setup/profiles/xcuitest.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/xcuitest.md bounded command output, local paths, driver names, IDs, and logs

---

# XCUITest Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile for macOS simulator-focused XCUITest setup.

- Load Node.js and XCUITest references.
- Validate Xcode, command line tools, simulator availability, Appium XCUITest driver, and doctor output.
- For real iOS or tvOS devices, complete setup first, then switch to `skills/xcuitest-real-device-config/SKILL.md`.

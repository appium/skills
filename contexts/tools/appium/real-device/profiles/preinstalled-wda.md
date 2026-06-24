---
owner: appium
policy_scope: "contexts/tools/appium/real-device/profiles/preinstalled-wda.md"
id: appium.real-device.profiles.preinstalled-wda
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/profiles/preinstalled-wda.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/profiles/preinstalled-wda.md bounded command output, local paths, driver names, IDs, and logs

---

# Preinstalled WDA Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user wants Appium to launch an already installed WDA runner.

- Prefer iOS or tvOS 17+ for WebDriverAgent v13+ preinstalled flows.
- Confirm the installed WDA bundle ID and `.xctrunner` suffix expectations.
- Verify the app is signed and launchable before starting the Appium session.

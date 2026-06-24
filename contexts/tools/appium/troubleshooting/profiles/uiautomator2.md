---
maint_scope: "contexts/tools/appium/troubleshooting/profiles/uiautomator2.md"
owner: appium
policy_scope: "contexts/tools/appium/troubleshooting/profiles/uiautomator2.md"
id: appium.troubleshooting.profiles.uiautomator2
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/troubleshooting/profiles/uiautomator2.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/troubleshooting/profiles/uiautomator2.md bounded command output, local paths, driver names, IDs, and logs

---

# UiAutomator2 Troubleshooting Profile

Base skill: `skills/appium-troubleshooting/SKILL.md`

Use this profile when the failing session uses `appium:automationName` `UiAutomator2`.

- Keep scope on Android device visibility, `adb`, UiAutomator2 driver version, server logs, and app install/startup evidence.
- Load `contexts/tools/appium/troubleshooting/references/uiautomator2-session-startup.md` for session creation failures.
- Load `contexts/tools/appium/troubleshooting/references/uiautomator2-locators.md` for element lookup failures.

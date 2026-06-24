---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/android.md"
id: appium.setup.profiles.android
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/android.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/android.md bounded command output, local paths, driver names, IDs, and logs

---

# Android Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile for UiAutomator2 or Espresso setup.

- Load Node.js and Android references before driver-specific references.
- Treat Android SDK, Java, `adb`, emulator/device visibility, and Appium driver doctor required fixes as blocking.
- Load bundletool only when the user explicitly requests app-bundle tooling.
- Load FFmpeg only when the user explicitly requests media-related capabilities.

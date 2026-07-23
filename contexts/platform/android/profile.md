---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.profiles.android

---

# Android Setup Profile

Base skills: `skills/setup-uiautomator2/SKILL.md` and
`skills/setup-espresso/SKILL.md`

Use this profile for UiAutomator2 or Espresso setup.

- Load Node.js and Android references before driver-specific references.
- Treat Android SDK, Java, `adb`, emulator/device visibility, and Appium driver doctor required fixes as blocking.
- Load bundletool only when the user explicitly requests app-bundle tooling.
- Load FFmpeg only when the user explicitly requests media-related capabilities.

---
security_profile: appium-local-workflows
owner: appium
id: appium.troubleshooting.profiles.espresso

---

# Espresso Troubleshooting Profile

Base skill: `skills/appium-troubleshooting/SKILL.md`

Use this profile when the failing session uses `appium:automationName` `Espresso`.

- Keep scope on Android device visibility, `adb`, Espresso driver version, server build/signing/Compose configuration, server logs, and app install/startup evidence.
- Load `contexts/tools/appium/troubleshooting/references/espresso-session-startup.md` for session creation, server build, Compose alignment, or startup failures.
- Load `contexts/tools/appium/troubleshooting/references/espresso-locators.md` for element lookup, subdriver (`espresso` vs `compose`), or locator strategy failures.

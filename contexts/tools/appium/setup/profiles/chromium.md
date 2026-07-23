---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.profiles.chromium

---

# Chromium Setup Profile

Base skill: `skills/setup-chromium/SKILL.md`

Use this profile for desktop Chrome, Chromium, or Edge automation.

- Load Node.js and Chromium references.
- Validate browser availability, selected executable, driver installation, and Chromium doctor or smoke checks.
- For Microsoft Edge, account for `msedgedriver` and explicit executable capabilities where automatic chromedriver handling does not apply.

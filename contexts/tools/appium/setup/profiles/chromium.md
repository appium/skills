---
maint_scope: "contexts/tools/appium/setup/profiles/chromium.md"
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/chromium.md"
id: appium.setup.profiles.chromium
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/chromium.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/chromium.md bounded command output, local paths, driver names, IDs, and logs

---

# Chromium Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile for desktop Chrome, Chromium, or Edge automation.

- Load Node.js and Chromium references.
- Validate browser availability, selected executable, driver installation, and Chromium doctor or smoke checks.
- For Microsoft Edge, account for `msedgedriver` and explicit executable capabilities where automatic chromedriver handling does not apply.

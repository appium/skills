---
owner: appium
policy_scope: "contexts/tools/appium/troubleshooting/profiles/chromium.md"
id: appium.troubleshooting.profiles.chromium
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/troubleshooting/profiles/chromium.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/troubleshooting/profiles/chromium.md bounded command output, local paths, driver names, IDs, and logs

---

# Chromium Troubleshooting Profile

Base skill: `skills/appium-troubleshooting/SKILL.md`

Use this profile when the failing session targets desktop Chrome, Chromium, or Edge through Appium Chromium driver.

- Keep scope on browser executable, browser version, chromedriver or msedgedriver compatibility, and Appium Chromium driver logs.
- Use the main troubleshooting procedure first, then consult official Chromium driver documentation before community search.

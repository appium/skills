---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/gecko.md"
id: appium.setup.profiles.gecko
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/gecko.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/gecko.md bounded command output, local paths, driver names, IDs, and logs

---

# Gecko Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile for desktop Firefox automation through Appium Gecko Driver.

- Load Node.js and Gecko references.
- Validate Firefox availability, selected Firefox executable, Appium Gecko driver installation, GeckoDriver availability when required, and Gecko doctor or smoke checks.
- Account for Firefox release, ESR, Developer Edition, and Nightly executable names or app paths.

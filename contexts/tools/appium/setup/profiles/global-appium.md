---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/global-appium.md"
id: appium.setup.profiles.global-appium
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/global-appium.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/global-appium.md bounded command output, local paths, driver names, IDs, and logs

---

# Global Appium Profile

Base skill: `skills/setup/SKILL.md`

Use this profile when the user accepts the repository default global command mode.

- Prefer `npm -g` installs and the `appium` executable.
- Validate with `appium -v`, `appium driver list --installed`, and driver doctor or smoke checks.
- Do not switch to `npx appium` unless the user explicitly requests local execution.

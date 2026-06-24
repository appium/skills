---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/local-npx.md"
id: appium.setup.profiles.local-npx
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/local-npx.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/local-npx.md bounded command output, local paths, driver names, IDs, and logs

---

# Local npx Profile

Base skill: `skills/setup/SKILL.md`

Use this profile only when the user explicitly requests local Appium execution.

- Prefer project-local dependencies and `npx appium`.
- Validate with `npx appium -v`, `npx appium driver list --installed`, and the matching local driver doctor or smoke check.
- Keep local mode separate from global mode; do not mix driver installs unless the user asks.

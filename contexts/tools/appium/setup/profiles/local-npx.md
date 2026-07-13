---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.profiles.local-npx

---

# Local npx Profile

Base skill: `skills/setup/SKILL.md`

Use this profile only when the user explicitly requests local Appium execution.

- Prefer project-local dependencies and `npx appium`.
- Validate with `npx appium -v`, `npx appium driver list --installed`, and the matching local driver doctor or smoke check.
- Keep local mode separate from global mode; do not mix driver installs unless the user asks.

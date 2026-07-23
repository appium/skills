---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.profiles.global-appium

---

# Global Appium Profile

Base workflows: the driver-specific setup Skills selected by
`skills/setup/SKILL.md`.

Use this profile when the user accepts the repository default global command mode.

- Prefer `npm -g` installs and the `appium` executable.
- Validate with `appium -v`, `appium driver list --installed`, and driver doctor or smoke checks.
- Run repository read-only helpers without `--appium-mode`; global mode is their default.
- Do not switch to `npx appium` unless the user explicitly requests local execution.

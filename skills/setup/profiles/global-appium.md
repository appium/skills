# Global Appium Profile

Base skill: `skills/setup/SKILL.md`

Use this profile when the user accepts the repository default global command mode.

- Prefer `npm -g` installs and the `appium` executable.
- Validate with `appium -v`, `appium driver list --installed`, and driver doctor or smoke checks.
- Do not switch to `npx appium` unless the user explicitly requests local execution.

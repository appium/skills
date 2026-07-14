---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.profiles.local-npx

---

# Local npx Profile

Base skill: `skills/setup/SKILL.md`

Use this profile only when the user explicitly requests local Appium execution. Run each selected local Appium command from the project root.

- Prefer project-local dependencies and invoke the existing binary with `npx --no-install appium`; plain `npx appium` is not allowed because it can download a missing package.
- Treat unqualified `appium ...` examples in routed assets as global-mode examples and translate them to `npx --no-install appium ...`. Never execute `npm install -g` in this mode.
- Install or upgrade project-local Appium with the project's package manager only when the request authorizes dependency-file changes. Otherwise report a missing or incompatible local Appium package as a blocker.
- Validate with `npx --no-install appium -v`, `npx --no-install appium driver list --installed`, and the matching local driver doctor or smoke check.
- Run repository read-only helpers with `--appium-mode local`; helpers must use the existing project-local Appium installation without downloading a package or falling back to global Appium.
- Keep local mode separate from global mode; do not mix driver installs unless the user asks.

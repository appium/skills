---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.uiautomator2

---

# Example: Android + UiAutomator2 Setup

Use `skills/setup-uiautomator2/SKILL.md` to prepare Android + UiAutomator2.
The Skill owns Context loading order, command-mode selection, approval gates,
and completion criteria; this example only illustrates the smoke check.

Smoke test:

```bash
node tools/appium/setup/scripts/smoke-appium-server.mjs --driver uiautomator2 --report auto
```

Use `--appium-mode local` only when requested. Require
`summary.requiredOk: true`; inspect the saved report on failure.

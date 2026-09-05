---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.espresso

---

# Example: Android + Espresso Setup

Use `skills/setup-espresso/SKILL.md` to prepare Android + Espresso. The Skill
owns Context loading order, command-mode selection, approval gates, and
completion criteria; this example only illustrates the smoke check.

Rules:

- Treat `appium driver doctor espresso` required fixes as blocking.
- Ask before installing optional dependencies.
- Show command output for each step.

Smoke test:

```bash
node tools/appium/setup/scripts/smoke-appium-server.mjs --driver espresso --report auto
```

Use `--appium-mode local` only when requested. Require
`summary.requiredOk: true`; inspect the saved report on failure.

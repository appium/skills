---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.chromium

---

# Example: Desktop Chromium Setup

Use `skills/setup-chromium/SKILL.md` to prepare Appium Chromium Driver for
desktop browser automation. The Skill owns Context loading order, command-mode
selection, approval gates, and completion criteria; this example only
illustrates the smoke check.

Rules:

- If `appium driver doctor chromium` is supported, treat required fixes as blocking.
- If doctor is not supported for `chromium`, use install, list, and smoke checks as blocking gates.

Smoke test:

```bash
node tools/appium/setup/scripts/smoke-appium-server.mjs --driver chromium --report auto
```

Use `--appium-mode local` only when requested. Require
`summary.requiredOk: true`; inspect the saved report on failure.
For Edge, add `--browser edge`. Browser-driver downloads require explicit approval.

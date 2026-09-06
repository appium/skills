---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.xcuitest

---

# Example: iOS/tvOS + XCUITest Setup

Use `skills/setup-xcuitest/SKILL.md` to prepare iOS/tvOS + XCUITest on macOS.
The Skill owns Context loading order, command-mode selection, approval gates,
and completion criteria; this example only illustrates the smoke check.

Rules:

- Treat `appium driver doctor xcuitest` required fixes as blocking.
- Ask before installing optional dependencies.
- Show command output for each step.

Smoke test:

```bash
node tools/appium/setup/scripts/smoke-appium-server.mjs --driver xcuitest --report auto
```

Use `--appium-mode local` only when requested. Require
`summary.requiredOk: true`; inspect the saved report on failure.

---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.safari

---

# Example: Safari Setup

Follow `skills/setup-safari/SKILL.md` for macOS Safari setup. Use this example
only for its final server check after the Skill has applied the selected
command mode, authorization boundaries, and required gates.

Rules:

- Use global Appium commands by default: `appium`, `npm -g`.
- Run `safaridriver --enable` only when the user accepts the required macOS authorization prompt.
- Treat Appium Safari driver doctor as optional. If unsupported, continue with install/list, `safaridriver`, and smoke checks.

Smoke test:

```bash
node tools/appium/setup/scripts/smoke-appium-server.mjs --driver safari --report auto
```

Use `--appium-mode local` only when requested. Require
`summary.requiredOk: true`; inspect the saved report on failure.

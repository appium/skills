---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.gecko

---

# Gecko Setup

Use `skills/setup-gecko/SKILL.md` for the complete Firefox route. Apply the
Skill's Context, command-mode, approval, and completion rules before using the
server smoke sequence below.

Rules:

- Use global Appium commands by default: `appium`, `npm -g`.
- If `appium driver doctor gecko` is supported, treat required fixes as blocking.
- If doctor is not supported for `gecko`, use install, list, Firefox availability, and smoke checks as blocking gates.
- Ask before privileged package-manager commands or browser installs.

Smoke test:

```bash
node tools/appium/setup/scripts/smoke-appium-server.mjs --driver gecko --report auto
```

Use `--appium-mode local` only when requested. Require
`summary.requiredOk: true`; inspect the saved report on failure.

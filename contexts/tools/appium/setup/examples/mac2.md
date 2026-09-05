---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.mac2

---

# Mac2 Setup

Start with `skills/setup-mac2/SKILL.md` for native macOS automation. The
following smoke commands supplement that Skill and never replace its loading,
privacy-approval, doctor, or completion requirements.

Rules:

- Use global Appium commands by default: `appium`, `npm -g`.
- Treat `appium driver doctor mac2` required fixes as blocking.
- Do not change Accessibility, Screen Recording, or other macOS privacy settings without explicit user authorization.
- Ask before privileged package-manager commands or `sudo`.

Smoke test:

```bash
node tools/appium/setup/scripts/smoke-appium-server.mjs --driver mac2 --report auto
```

Use `--appium-mode local` only when requested. Require
`summary.requiredOk: true`; inspect the saved report on failure.

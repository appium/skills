---
owner: appium
policy_scope: "contexts/tools/appium/setup/examples/gecko.md"
id: appium.setup.examples.gecko
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/examples/gecko.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/examples/gecko.md bounded command output, local paths, driver names, IDs, and logs

---

# Gecko Setup

Use skills to prepare Appium Gecko Driver for Firefox desktop automation.

1. Load `skills/setup/SKILL.md`.
2. Load `contexts/tools/appium/setup/profiles/global-appium.md` unless the user explicitly requested `npx appium`.
3. Load `contexts/tools/appium/setup/profiles/gecko.md`.
4. Load `contexts/tools/appium/setup/node-environment.md`.
5. Load `contexts/tools/appium/setup/gecko-environment.md`.

Rules:

- Use global Appium commands by default: `appium`, `npm -g`.
- If `appium driver doctor gecko` is supported, treat required fixes as blocking.
- If doctor is not supported for `gecko`, use install, list, Firefox availability, and smoke checks as blocking gates.
- Ask before privileged package-manager commands or browser installs.

Smoke:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm readiness.
3. In Terminal A logs confirm `Available drivers:` contains `gecko`.
4. Stop Appium with `Ctrl+C`.
5. Run `pgrep -fl "appium.*server" || echo "no appium server process"`.

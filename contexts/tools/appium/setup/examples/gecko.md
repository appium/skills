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

Smoke:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm readiness.
3. In Terminal A logs confirm `Available drivers:` contains `gecko`.
4. Stop Appium with `Ctrl+C`.
5. Run `pgrep -fl "appium.*server" || echo "no appium server process"`.

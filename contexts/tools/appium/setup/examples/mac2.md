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

Smoke:

If port 4723 is occupied, use an unused port with `--port` and update the
status/session URLs below. Follow the driver smoke reference for process checks.

1. Start Appium server in Terminal A: `appium server`; record its PID or terminal-job identity.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm readiness.
3. In Terminal A logs confirm `Available drivers:` contains `mac2`.
4. Stop this server with `Ctrl+C` in Terminal A.
5. Verify the recorded server process exits; preserve pre-existing servers.

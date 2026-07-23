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

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm readiness.
3. In Terminal A logs confirm `Available drivers:` contains `mac2`.
4. Stop Appium with `Ctrl+C`.
5. Run `pgrep -fl "appium.*server" || echo "no appium server process"`.

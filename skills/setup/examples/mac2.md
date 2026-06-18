# Mac2 Setup

Use skills to prepare Appium Mac2 Driver for macOS desktop app automation.

1. Load `skills/setup/SKILL.md`.
2. Load `profiles/global-appium.md` unless the user explicitly requested `npx appium`.
3. Load `profiles/macos.md`.
4. Load `profiles/mac2.md`.
5. Load `references/environment-setup-node.md`.
6. Load `references/environment-setup-mac2.md`.

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

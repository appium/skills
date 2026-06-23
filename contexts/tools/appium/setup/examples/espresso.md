---
owner: appium
id: appium.setup.examples.espresso

---

# Example: Android + Espresso Setup

Use this repository's skills to prepare Android + Espresso.

1. Load `skills/setup/SKILL.md`.
2. Load `contexts/tools/appium/setup/profiles/global-appium.md` unless the user requests local mode.
3. Load `contexts/tools/appium/setup/profiles/android.md`.
4. Load `contexts/tools/appium/setup/node-environment.md`.
5. Load `contexts/tools/appium/setup/references/environment-setup-android.md`.
6. Load `contexts/tools/appium/setup/espresso-environment.md`.

Rules:

- Treat `appium driver doctor espresso` required fixes as blocking.
- Ask before installing optional dependencies.
- Show command output for each step.

Smoke test:

- Terminal A: start the server with `appium server`.
- Terminal B: run `curl -s http://127.0.0.1:4723/status` and confirm success.
- Terminal A logs: confirm `Available drivers:` contains `espresso`.
- Cleanup: stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.

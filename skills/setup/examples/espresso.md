# Example: Android + Espresso Setup

Use this repository's skills to prepare Android + Espresso.

1. Load `skills/setup/SKILL.md`.
2. Load `profiles/global-appium.md` unless the user requests local mode.
3. Load `profiles/android.md`.
4. Load `contexts/tools/appium/setup/node-environment.md`.
5. Load `references/environment-setup-android.md`.
6. Load `contexts/tools/appium/setup/espresso-environment.md`.

Rules:

- Treat `appium driver doctor espresso` required fixes as blocking.
- Ask before installing optional dependencies.
- Show command output for each step.

Smoke test:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `espresso`.
4. Stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.

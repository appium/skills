# Example: Safari Setup

Appium Safari Driver on macOS.

1. Load `skills/setup/SKILL.md`.
2. Load `profiles/global-appium.md` unless the user explicitly asks for local `npx appium`.
3. Load `profiles/macos.md`.
4. Load `profiles/safari.md`.
5. Load `contexts/tools/appium/setup/node-environment.md`.
6. Load `references/environment-setup-safari.md`.

Rules:

- Use global Appium commands by default: `appium`, `npm -g`.
- Run `safaridriver --enable` only when the user accepts the required macOS authorization prompt.
- Treat Appium Safari driver doctor as optional. If unsupported, continue with install/list, `safaridriver`, and smoke checks.

Smoke test:

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status`.
3. In Terminal A logs confirm `Available drivers:` contains `safari`.
4. Stop Appium with `Ctrl+C`.
5. Run `pgrep -fl "appium.*server" || echo "no appium server process"`.

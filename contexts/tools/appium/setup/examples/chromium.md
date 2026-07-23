---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.examples.chromium

---

# Example: Desktop Chromium Setup

Use `skills/setup-chromium/SKILL.md` to prepare Appium Chromium Driver for
desktop browser automation. The Skill owns Context loading order, command-mode
selection, approval gates, and completion criteria; this example only
illustrates the smoke check.

Rules:

- If `appium driver doctor chromium` is supported, treat required fixes as blocking.
- If doctor is not supported for `chromium`, use install, list, and smoke checks as blocking gates.

Smoke test (translate every Appium command through the selected command profile):

1. Start Appium server in Terminal A: `appium server`.
2. In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
3. In Terminal A logs confirm `Available drivers:` contains `chromium`.
4. Create and delete one minimal browser session using the host `platformName` and `appium:automationName` set to `chromium`; obtain approval before any automatic browser-driver download.
5. Stop Appium with `Ctrl+C`, then run `pgrep -fl "appium.*server" || echo "no appium server process"`.

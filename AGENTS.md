# AGENTS Guide for Appium Skills

This file defines how AI agents should execute the skills in this repository.

## Execution Rules

- Execute skills one at a time in dependency order.
- Run commands step-by-step; avoid very long chained command blocks.
- Re-run checks after each fix.
- Use Appium doctor required fixes as the pass/fail gate:
  - Pass: `0 required fixes needed`
  - Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Avoid `sudo` in setup unless the user explicitly requests it.
- Prefer user-space installs and local project fallbacks when permissions are restricted.
- Use global npm/Appium commands by default (`npm -g`, `appium`).
- Use local execution (`npx appium`) only when the user explicitly asks for a local mode.
- If output is incomplete/truncated, rerun only that step and capture logs.

## Recommended Skill Order

### Android + UiAutomator2

1. `node-environment-setup`
2. `android-environment-setup`
3. `environment-setup-uiautomator2`

### Android + Espresso

1. `node-environment-setup`
2. `android-environment-setup`
3. `environment-setup-espresso`

### iOS + XCUITest (macOS only)

1. `node-environment-setup`
2. `environment-setup-xcuitest`

## Completion Policy

A skill is complete only when its own completion criteria in `SKILL.md` are satisfied.

- Required doctor checks must pass.
- Optional doctor warnings do not block completion.
- Validate global command mode (`appium`) as the default completion path.
- Validate local command mode (`npx appium`) only when the user explicitly requests local execution.

## Prompt Templates

### Template: UiAutomator2

Use this as a starting prompt for an AI agent:

```text
Use this repository's skills to prepare Android + UiAutomator2.
Follow exactly, in order:
1) skills/node-environment-setup/SKILL.md
2) skills/android-environment-setup/SKILL.md
3) skills/environment-setup-uiautomator2/SKILL.md

Rules:
  1) Start Appium server in Terminal A (`appium server`) and keep it running.
  2) In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
  3) In Terminal A logs confirm `Available drivers:` contains `uiautomator2`.
  4) In Terminal A stop Appium with `Ctrl+C`, then in Terminal B run `pgrep -fl "appium.*server" || echo "no appium server process"`.
```

### Template: Espresso

Use this as a starting prompt for an AI agent:

```text
Use this repository's skills to prepare Android + Espresso.
Follow exactly, in order:
1) skills/node-environment-setup/SKILL.md
2) skills/android-environment-setup/SKILL.md
3) skills/environment-setup-espresso/SKILL.md

Rules:
- Run one step at a time.
- Treat `appium driver doctor espresso` required fixes as blocking.
- Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Do not use sudo unless I explicitly ask.
- Show command output for each step.
- Smoke test sequence:
  1) Start Appium server in Terminal A (`appium server`) and keep it running.
  2) In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
  3) In Terminal A logs confirm `Available drivers:` contains `espresso`.
  4) In Terminal A stop Appium with `Ctrl+C`, then in Terminal B run `pgrep -fl "appium.*server" || echo "no appium server process"`.
```

### Template: XCUITest

Use this as a starting prompt for an AI agent:

```text
Use this repository's skills to prepare macOS + XCUITest.
Follow exactly, in order:
1) skills/node-environment-setup/SKILL.md
2) skills/environment-setup-xcuitest/SKILL.md

Rules:
- Run one step at a time.
- Treat `appium driver doctor xcuitest` required fixes as blocking.
- Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Do not use sudo unless I explicitly ask.
- Show command output for each step.
- Smoke test sequence:
  1) Start Appium server in Terminal A (`appium server`) and keep it running.
  2) In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
  3) In Terminal A logs confirm `Available drivers:` contains `xcuitest`.
  4) In Terminal A stop Appium with `Ctrl+C`, then in Terminal B run `pgrep -fl "appium.*server" || echo "no appium server process"`.
```

## Notes for Tooling Integrations

- If your agent platform supports repository-level instruction files, prioritize this file before running skill commands.
- If your platform does not auto-load this file, copy one prompt template above and provide it manually.

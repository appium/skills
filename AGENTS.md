---
description: "Use this repository guide to route Appium setup and troubleshooting work across the included skills, execute them in dependency order, and verify required doctor and smoke-test gates."
---

# AGENTS Guide for Appium Skills

## When To Use

Use this guide when selecting or sequencing the Appium skills in this repository.

## Do Not Use For

Do not use this guide as a replacement for the individual skill instructions once a specific setup or troubleshooting path has been selected.

## Execution Rules

- Execute skills one at a time in dependency order.
- Run commands step by step; avoid very long chained command blocks.
- Re-run checks after each fix.
- Use Appium doctor required fixes as the pass/fail gate:
  - Pass: `0 required fixes needed`
  - Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Avoid `sudo` in setup unless the user explicitly requests it.
- Prefer user-space installs and local project fallbacks when permissions are restricted.
- Use global npm/Appium commands by default (`npm -g`, `appium`).
- Use local execution (`npx appium`) only when the user explicitly asks for a local mode.
- Use `setup` reference `ffmpeg.md` as a shared optional dependency across drivers only when the user explicitly requests FFmpeg-related setup.
- Use `setup` reference `bundletool.md` as a shared optional dependency for UiAutomator2/Espresso only when the user explicitly requests bundletool setup.
- If output is incomplete or truncated, rerun only that step and capture logs.

## Recommended Skill Order

### Android + UiAutomator2

1. `setup` reference `node.md`
2. `setup` reference `android.md`
3. `setup` reference `uiautomator2.md`

### Android + Espresso

1. `setup` reference `node.md`
2. `setup` reference `android.md`
3. `setup` reference `espresso.md`

### Desktop Chromium Browsers

1. `setup` reference `node.md`
2. `setup` reference `chromium.md`

### Shared Optional Setup

1. `setup` reference `ffmpeg.md` only when the user explicitly requests FFmpeg-related capabilities.
2. `setup` reference `bundletool.md` only when the user explicitly requests bundletool setup for UiAutomator2/Espresso.

### iOS + XCUITest Simulator

1. `setup` reference `node.md`
2. `setup` reference `xcuitest.md`

### iOS + XCUITest + Real Device

1. `setup` reference `node.md`
2. `setup` reference `xcuitest.md`
3. `xcuitest-real-device-config`

### Troubleshooting

1. If prerequisites or doctor checks are failing, run the relevant `setup` reference first.
2. Then run `appium-troubleshooting` in the failing driver path and load only the platform reference files that match the symptom.

## Completion Policy

A skill is complete only when its own completion criteria in `SKILL.md` are satisfied.

- Required doctor checks must pass.
- Optional doctor warnings do not block completion.
- Validate global command mode (`appium`) as the default completion path.
- Validate local command mode (`npx appium`) only when the user explicitly requests local execution.

## Prompt Templates

### Template: UiAutomator2

```text
Use this repository's setup skill to prepare Android + UiAutomator2.
Follow exactly, in order:
1) skills/setup/SKILL.md
2) skills/setup/references/node.md
3) skills/setup/references/android.md
4) skills/setup/references/uiautomator2.md

Rules:
  1) Start Appium server in Terminal A (`appium server`) and keep it running.
  2) In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
  3) In Terminal A logs confirm `Available drivers:` contains `uiautomator2`.
  4) In Terminal A stop Appium with `Ctrl+C`, then in Terminal B run `pgrep -fl "appium.*server" || echo "no appium server process"`.
```

### Template: Espresso

```text
Use this repository's setup skill to prepare Android + Espresso.
Follow exactly, in order:
1) skills/setup/SKILL.md
2) skills/setup/references/node.md
3) skills/setup/references/android.md
4) skills/setup/references/espresso.md

Rules:
- Run one step at a time.
- Treat `appium driver doctor espresso` required fixes as blocking.
- Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Do not run privileged commands unless the user explicitly approves the exact command; report the reason, expected effect, and recovery path before running it.
- Show command output for each step.
- Smoke test sequence:
  1) Start Appium server in Terminal A (`appium server`) and keep it running.
  2) In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
  3) In Terminal A logs confirm `Available drivers:` contains `espresso`.
  4) In Terminal A stop Appium with `Ctrl+C`, then in Terminal B run `pgrep -fl "appium.*server" || echo "no appium server process"`.
```

### Template: XCUITest

```text
Use this repository's setup skill to prepare macOS + XCUITest.
Follow exactly, in order:
1) skills/setup/SKILL.md
2) skills/setup/references/node.md
3) skills/setup/references/xcuitest.md

Rules:
- Run one step at a time.
- Treat `appium driver doctor xcuitest` required fixes as blocking.
- Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Do not run privileged commands unless the user explicitly approves the exact command; report the reason, expected effect, and recovery path before running it.
- Show command output for each step.
- Smoke test sequence:
  1) Start Appium server in Terminal A (`appium server`) and keep it running.
  2) In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
  3) In Terminal A logs confirm `Available drivers:` contains `xcuitest`.
  4) In Terminal A stop Appium with `Ctrl+C`, then in Terminal B run `pgrep -fl "appium.*server" || echo "no appium server process"`.
```

### Template: Chromium

```text
Use this repository's setup skill to prepare Appium Chromium Driver for desktop browser automation.
Follow exactly, in order:
1) skills/setup/SKILL.md
2) skills/setup/references/node.md
3) skills/setup/references/chromium.md

Rules:
- Run one step at a time.
- If `appium driver doctor chromium` is supported, treat required fixes as blocking.
- If doctor is not supported for `chromium`, use install/list/smoke checks as blocking gates.
- Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Do not run privileged commands unless the user explicitly approves the exact command; report the reason, expected effect, and recovery path before running it.
- Show command output for each step.
- Smoke test sequence:
  1) Start Appium server in Terminal A (`appium server`) and keep it running.
  2) In Terminal B run `curl -s http://127.0.0.1:4723/status` and confirm success.
  3) In Terminal A logs confirm `Available drivers:` contains `chromium`.
  4) In Terminal A stop Appium with `Ctrl+C`, then in Terminal B run `pgrep -fl "appium.*server" || echo "no appium server process"`.
```

### Template: XCUITest Real Device

```text
Use this repository's skills to prepare macOS + XCUITest for a real iOS/tvOS device.
Follow exactly, in order:
1) skills/setup/SKILL.md
2) skills/setup/references/node.md
3) skills/setup/references/xcuitest.md
4) skills/xcuitest-real-device-config/SKILL.md

Rules:
- Run one step at a time.
- Complete XCUITest setup before starting xcuitest-real-device-config.
- Ask before installing optional 3rd-party device tools (ios-deploy, go-ios, pymobiledevice3, tidevice).
- Do not run privileged commands unless the user explicitly approves the exact command; report the reason, expected effect, and recovery path before running it.
- For steps requiring physical device interaction (Trust popup, Developer Mode toggle), pause and give the exact on-device instruction.
- Show command output for each step.
- When the WDA bundle is modified after signing, always re-sign with `codesign` before installing.
- Completion criteria:
  1) Device is visible in `xcrun xctrace list devices`.
  2) A provisioning profile approach has been fully applied (no code-signing errors on WDA install).
  3) If any WDA bundle was modified, `codesign --verify --verbose` confirms a valid signature.
  4) At least one WDA deployment method is confirmed working (default xcodebuild, preinstalled, prebuilt, or attach).
```

### Template: Troubleshooting

```text
Use this repository's troubleshooting skill to diagnose an Appium failure.
Follow this order:
1) If setup or doctor output is failing, run the matching setup reference first.
2) skills/appium-troubleshooting/SKILL.md

Rules:
- Run one step at a time.
- Keep troubleshooting scoped to the failing driver unless the user explicitly asks for cross-driver comparison.
- Re-run the smallest failing check after each fix.
- Treat Appium doctor required fixes as blocking.
- Prefer the official Appium references bundled with the troubleshooting skill before using discuss.appium.io.
- Use discuss.appium.io only when the official references do not explain the exact stack trace or symptom.
- Show command output for each step.
```

## Notes for Tooling Integrations

- If your agent platform supports repository-level instruction files, prioritize this file before running skill commands.
- If your platform does not auto-load this file, copy one prompt template above and provide it manually.

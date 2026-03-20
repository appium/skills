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
- Use `environment-setup-ffmpeg` as a shared optional dependency across drivers only when the user explicitly requests FFmpeg-related setup.
- Use `environment-setup-bundletool` as a shared optional dependency for UiAutomator2/Espresso only when the user explicitly requests bundletool setup.
- If output is incomplete/truncated, rerun only that step and capture logs.

## Recommended Skill Order

### Android + UiAutomator2

1. `environment-setup-node`
2. `environment-setup-android`
3. `environment-setup-uiautomator2`

### Android + Espresso

1. `environment-setup-node`
2. `environment-setup-android`
3. `environment-setup-espresso`

### Shared Optional Skill

1. `environment-setup-ffmpeg` (run only when user explicitly requests FFmpeg-related capabilities)
2. `environment-setup-bundletool` (run only when user explicitly requests bundletool setup for UiAutomator2/Espresso)

### iOS + XCUITest (macOS only)

1. `environment-setup-node`
2. `environment-setup-xcuitest`

### iOS + XCUITest + Real Device (macOS only)

1. `environment-setup-node`
2. `environment-setup-xcuitest`
3. `xcuitest-real-device-config`

### Troubleshooting

1. If prerequisites or doctor checks are failing, run the relevant environment setup skill first.
2. Then run `appium-troubleshooting` in the failing driver path and load only the platform reference files that match the symptom.

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
1) skills/environment-setup-node/SKILL.md
2) skills/environment-setup-android/SKILL.md
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
1) skills/environment-setup-node/SKILL.md
2) skills/environment-setup-android/SKILL.md
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
1) skills/environment-setup-node/SKILL.md
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

### Template: XCUITest Real Device

Use this as a starting prompt for an AI agent:

```text
Use this repository's skills to prepare macOS + XCUITest for a real iOS/tvOS device.
Follow exactly, in order:
1) skills/environment-setup-node/SKILL.md
2) skills/environment-setup-xcuitest/SKILL.md
3) skills/xcuitest-real-device-config/SKILL.md

Rules:
- Run one step at a time.
- Complete environment-setup-xcuitest before starting xcuitest-real-device-config.
- Ask before installing optional 3rd-party device tools (ios-deploy, go-ios, pymobiledevice3, tidevice).
- Do not use sudo unless I explicitly ask.
- For steps requiring physical device interaction (Trust popup, Developer Mode toggle), pause and give the exact on-device instruction.
- Show command output for each step.
- When the WDA bundle is modified after signing (frameworks removed for iOS 17+), always re-sign with `codesign` before installing.
- Completion criteria:
  1) Device is visible in `xcrun xctrace list devices`.
  2) A provisioning profile approach has been fully applied (no code-signing errors on WDA install).
  3) If any WDA bundle was modified, `codesign --verify --verbose` confirms a valid signature.
  4) At least one WDA deployment method is confirmed working (default xcodebuild, preinstalled, prebuilt, or attach).
```

### Template: Troubleshooting

Use this as a starting prompt for an AI agent:

```text
Use this repository's troubleshooting skill to diagnose an Appium failure.
Follow this order:
1) If setup or doctor output is failing, run the matching environment setup skill first.
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

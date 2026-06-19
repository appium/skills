# Appium Context

Use this shared context for Appium setup, troubleshooting, and real-device configuration skills in this repository.

## Scope

- Skills prepare or diagnose Appium automation for Android, iOS, macOS, desktop browsers, and related optional tooling.
- Setup work starts at `skills/setup/SKILL.md`.
- Troubleshooting already-failing sessions starts at `skills/appium-troubleshooting/SKILL.md`.
- iOS real-device signing and WebDriverAgent configuration starts at `skills/xcuitest-real-device-config/SKILL.md` after simulator setup is complete.

## Execution Rules

- Confirm platform, Appium driver, command mode, host OS, permissions, and target device/browser/app before changing anything.
- Prefer global Appium mode: `appium` and `npm -g`.
- Use local `npx appium` mode only when explicitly requested.
- Run setup references one at a time in dependency order.
- Re-run the smallest relevant check after each fix.
- Ask before optional tooling, privileged package-manager commands, `sudo`, or macOS privacy-setting changes.

## Verification

- Appium driver setup is complete only when the selected reference criteria pass.
- Driver doctor required fixes are the pass/fail gate when doctor is supported: `0 required fixes needed`.
- Optional doctor warnings are non-blocking, but report warnings that affect the requested target.
- Server smoke checks should verify `/status`, expected `Available drivers:` log output, and cleanup of the Appium server process.

## Optional Tooling

- FFmpeg setup is only for explicit FFmpeg-related requests.
- bundletool setup is only for explicit bundletool, UiAutomator2, or Espresso needs that require it.
- Third-party real-device tooling is not installed unless the user explicitly asks for that capability.

## Self-Improvement

After completing a skill, apply the loaded reference's self-improvement prompt. Report missing, ambiguous, outdated, or retry-causing instructions with the section and proposed wording; do not edit skill files unless asked.

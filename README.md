# Appium Agent Skills

This repository contains AI Agent skills for Appium automation, including environment setup, real-device configuration, and troubleshooting common failures.

Each skill includes a self-improvement prompt asking agents to note missing, ambiguous, outdated, or retry-causing instructions after use. When a gap is found, consider opening a PR that updates `SKILL.md` with clearer steps, verification, or newer commands.

## Available Skills

| Skill | Description |
|---|---|
| [setup](skills/setup/SKILL.md) | Routes Appium environment setup to the preserved Node.js, Android, UiAutomator2, Espresso, Chromium, XCUITest, FFmpeg, or bundletool reference procedure |
| [appium-troubleshooting](skills/appium-troubleshooting/SKILL.md) | Troubleshoots UiAutomator2 or XCUITest failures with a driver-scoped workflow that starts from the failing symptom and re-checks the smallest reproduction after each fix |
| [xcuitest-real-device-config](skills/xcuitest-real-device-config/SKILL.md) | Prepares a real iOS/tvOS device for Appium XCUITest automation |

## Reliable Execution Notes

- Run one skill at a time in dependency order.
- If output appears incomplete, rerun only the affected step and collect logs from that step.
- Treat Appium doctor as the source of truth for pass/fail (`0 required fixes needed`).
- For FFmpeg-dependent capabilities, use `setup` reference `environment-setup-ffmpeg.md` only when explicitly requested.
- For bundletool-dependent capabilities, use `setup` reference `environment-setup-bundletool.md` only when explicitly requested.
- For startup, WDA, or locator failures after setup is complete, use `appium-troubleshooting` in a single driver path and follow the checks documented in that skill.

## Agent Instructions

- See [AGENTS.md](AGENTS.md) for strict execution rules and copy-paste prompt templates.
- Use the template matching your target (`uiautomator2`, `espresso`, `chromium`, `xcuitest`, `xcuitest real device`, or `troubleshooting`) and run skills in the documented order.

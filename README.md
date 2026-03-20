# Appium Agent Skills

This repository contains AI Agent skills for helping with Appium automation, including environment setup, real-device configuration, and troubleshooting common failures.

## Available Skills

| Skill | Description |
|---|---|
| [environment-setup-node](skills/environment-setup-node/SKILL.md) | Prepares Node.js and npm environment |
| [environment-setup-android](skills/environment-setup-android/SKILL.md) | Prepares Android SDK, Java, and ADB prerequisites for Appium Android drivers |
| [environment-setup-ffmpeg](skills/environment-setup-ffmpeg/SKILL.md) | Optional shared FFmpeg setup for media-related capabilities across drivers |
| [environment-setup-bundletool](skills/environment-setup-bundletool/SKILL.md) | Optional shared bundletool.jar setup for UiAutomator2/Espresso app-bundle tooling |
| [environment-setup-uiautomator2](skills/environment-setup-uiautomator2/SKILL.md) | Prepares and validates an Android + UiAutomator2 Appium environment |
| [environment-setup-espresso](skills/environment-setup-espresso/SKILL.md) | Prepares and validates an Android + Espresso Appium environment |
| [environment-setup-xcuitest](skills/environment-setup-xcuitest/SKILL.md) | Prepares and validates a macOS + XCUITest Appium environment |
| [appium-troubleshooting](skills/appium-troubleshooting/SKILL.md) | Troubleshoots UiAutomator2 or XCUITest failures with a driver-scoped workflow that starts from the failing symptom and re-checks the smallest reproduction after each fix |
| [xcuitest-real-device-config](skills/xcuitest-real-device-config/SKILL.md) | Prepare a real iOS/tvOS device for Appium XCUITest automation |

## Reliable Execution Notes

- Run skill commands step-by-step rather than as one very long chained command.
- For long-running checks, prefer an isolated background terminal and capture output after completion.
- If output appears incomplete, rerun only the affected step and collect logs from that step.
- Treat Appium doctor as the source of truth for pass/fail (`0 required fixes needed`).
- For FFmpeg-dependent capabilities, run the optional shared skill `environment-setup-ffmpeg` only when explicitly requested.
- For bundletool-dependent capabilities, run the optional shared skill `environment-setup-bundletool` only when explicitly requested.
- For startup, WDA, or locator failures after setup is complete, use `appium-troubleshooting` in a single driver path and follow the checks documented in that skill.

## Agent Instructions

- See [AGENTS.md](AGENTS.md) for strict execution rules and copy-paste prompt templates.
- Use the template matching your target (`uiautomator2`, `espresso`, `xcuitest`, `xcuitest real device`, or `troubleshooting`) and run skills in the documented order.

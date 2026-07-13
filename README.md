# Appium Agent Skills

This repository contains AI Agent skills for Appium automation, including environment setup, real-device configuration, and troubleshooting common failures.

Each workflow includes or delegates to a self-improvement prompt in the loaded context/reference/procedure, asking agents to note missing, ambiguous, outdated, or retry-causing instructions after use. When a gap is found, consider opening a PR that updates the loaded context, reference, procedure, or thin `SKILL.md` router with clearer routing, verification, or newer commands.

## Available Skills

| Skill | Description |
|---|---|
| [setup](skills/setup/SKILL.md) | Asks which Appium driver is needed when unspecified, then routes explicitly selected UiAutomator2, Espresso, Chromium, Gecko, Mac2, Safari, or XCUITest setup to canonical contexts |
| [prepare-development-environment](skills/prepare-development-environment/SKILL.md) | Prepares this repository for local Appium skills development by checking Git, Node, npm, helper-script readiness, and routing driver-specific setup |
| [appium-troubleshooting](skills/appium-troubleshooting/SKILL.md) | Troubleshoots UiAutomator2 or XCUITest failures with a driver-scoped workflow that starts from the failing symptom and re-checks the smallest reproduction after each fix |
| [xcuitest-real-device-config](skills/xcuitest-real-device-config/SKILL.md) | Prepares a real iOS/tvOS device for Appium XCUITest automation |

## Reliable Execution Notes

- Run one skill at a time in dependency order.
- If output appears incomplete, rerun only the affected step and collect logs from that step.
- Treat Appium doctor as the source of truth for pass/fail (`0 required fixes needed`).
- For FFmpeg-dependent capabilities, use `setup` context `contexts/tools/appium/setup/ffmpeg-environment.md` only when explicitly requested.
- For bundletool-dependent capabilities, use `setup` reference `contexts/tools/appium/setup/references/environment-setup-bundletool.md` only when explicitly requested.
- For startup, WDA, or locator failures after setup is complete, use `appium-troubleshooting` in a single driver path and follow the checks documented in that skill.

## Agent Instructions

- See [AGENTS.md](AGENTS.md) for repository-level execution rules and skill entrypoint guidance.
- Use the selected `SKILL.md` and its routed `contexts/` assets for target-specific step order.

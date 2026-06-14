---
description: "Repository-level execution rules for Appium skills. Use this guide to choose setup, troubleshooting, or real-device configuration workflows, enforce doctor-based verification, and preserve explicit approval gates for optional or privileged setup steps."
---

# AGENTS Guide for Appium Skills

This file defines how AI agents should execute the skills in this repository.

## Use When

Use this file to route Appium setup, troubleshooting, and real-device configuration work to the correct skill sequence, dependency order, approval gate, example, and verification standard. When to use: load this guide before choosing or sequencing repository skills.

## Do Not Use For

- Do not use this file as a replacement for the selected skill instructions; load the relevant `SKILL.md`, routed profiles, references, and examples before executing.
- Do not run optional FFmpeg, bundletool, or third-party real-device tooling unless the user explicitly requests that capability.

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
- Use local execution (`npx appium`) only when the user explicitly asks for local mode.
- Use `setup` reference `environment-setup-ffmpeg.md` only when the user explicitly requests FFmpeg-related setup.
- Use `setup` reference `environment-setup-bundletool.md` only when the user explicitly requests bundletool setup for UiAutomator2/Espresso.
- If output is incomplete or truncated, rerun only that step and capture logs.
- After completing any skill, read and apply that skill's `Self-Improvement Prompt` section before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with the skill section and proposed wording. Do not edit skill files unless the user explicitly asks.

## Recommended Skill Order

### Android + UiAutomator2

1. `skills/setup/SKILL.md`
2. `skills/setup/profiles/android.md`
3. `skills/setup/references/environment-setup-node.md`
4. `skills/setup/references/environment-setup-android.md`
5. `skills/setup/references/environment-setup-uiautomator2.md`
6. Example: `skills/setup/examples/uiautomator2.md`

### Android + Espresso

1. `skills/setup/SKILL.md`
2. `skills/setup/profiles/android.md`
3. `skills/setup/references/environment-setup-node.md`
4. `skills/setup/references/environment-setup-android.md`
5. `skills/setup/references/environment-setup-espresso.md`
6. Example: `skills/setup/examples/espresso.md`

### Desktop Chromium Browsers

1. `skills/setup/SKILL.md`
2. `skills/setup/profiles/chromium.md`
3. `skills/setup/references/environment-setup-node.md`
4. `skills/setup/references/environment-setup-chromium.md`
5. Example: `skills/setup/examples/chromium.md`

### iOS + XCUITest Simulator

1. `skills/setup/SKILL.md`
2. `skills/setup/profiles/macos.md`
3. `skills/setup/profiles/xcuitest.md`
4. `skills/setup/references/environment-setup-node.md`
5. `skills/setup/references/environment-setup-xcuitest.md`
6. Example: `skills/setup/examples/xcuitest.md`

### iOS + XCUITest Real Device

1. Complete the iOS + XCUITest simulator setup path first.
2. `skills/xcuitest-real-device-config/SKILL.md`
3. Load the signing profile that matches the user: free Apple ID, paid developer, or enterprise.
4. Load the WDA deployment profile that matches the user: preinstalled, prebuilt, or running WDA URL.
5. `skills/xcuitest-real-device-config/references/real-device-procedure.md`
6. Example: `skills/xcuitest-real-device-config/examples/real-device.md`

### Troubleshooting

1. If setup or doctor output is failing, run `skills/setup/SKILL.md` with the matching setup references first.
2. `skills/appium-troubleshooting/SKILL.md`
3. Load the matching driver profile and symptom references.
4. Examples:
   - `skills/appium-troubleshooting/examples/session-startup.md`
   - `skills/appium-troubleshooting/examples/locator-failure.md`

## Completion Policy

A skill is complete only when its own completion criteria in `SKILL.md` are satisfied.

- Required doctor checks must pass.
- Optional doctor warnings do not block completion.
- Validate global command mode (`appium`) as the default completion path.
- Validate local command mode (`npx appium`) only when the user explicitly requests local execution.


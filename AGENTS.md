---
description: "Repository-level execution rules for Appium skills. Use this guide to choose the correct skill entrypoint, enforce doctor-based verification, and preserve explicit approval gates for optional or privileged setup steps."
---

# AGENTS Guide for Appium Skills

This file defines how AI agents should execute the skills in this repository.

## Use When

Use this file to choose the correct Appium skill entrypoint and shared execution rules. When to use: load this guide before choosing a repository skill, then load the selected `SKILL.md` and its routed `contexts/` assets for step order and detailed procedures.

## Do Not Use For

- Do not use this file as a replacement for the selected skill instructions; load the relevant `SKILL.md`, routed contexts, profiles, references, examples, and procedures under `contexts/` before executing.
- Do not run optional FFmpeg, bundletool, or third-party real-device tooling unless the user explicitly requests that capability.

## Skill Entrypoints

- Repository development readiness: `skills/prepare-development-environment/SKILL.md`
- Appium setup: `skills/setup/SKILL.md`
- Existing Appium failures: `skills/appium-troubleshooting/SKILL.md`
- iOS or tvOS real-device XCUITest configuration: `skills/xcuitest-real-device-config/SKILL.md`

## Preflight

Before executing a skill, confirm the target platform, Appium driver, command mode (`appium` or `npx appium`), host OS, available permissions, relevant devices or simulators, and whether the user requested optional dependencies. Identify the exact skill files, canonical `contexts/` assets, `tools/` helper scripts, profiles, references, examples, and verification commands that apply before making environment changes.

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
- Use `setup` context `contexts/tools/appium/setup/ffmpeg-environment.md` only when the user explicitly requests FFmpeg-related setup.
- Use `setup` reference `contexts/tools/appium/setup/references/environment-setup-bundletool.md` only when the user explicitly requests bundletool setup for UiAutomator2/Espresso.
- If output is incomplete or truncated, rerun only that step and capture logs.
- After completing any workflow, read and apply the self-improvement prompt in the loaded context, reference, or procedure before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with the loaded asset path and proposed wording. Do not edit files unless the user explicitly asks.

## Completion Policy

Use the selected skill file's explicit checklist as the completion gate.

- Required doctor checks must pass.
- Optional doctor warnings do not block completion.
- Validate global command mode (`appium`) as the default completion path.
- Validate local command mode (`npx appium`) only when the user explicitly requests local execution.

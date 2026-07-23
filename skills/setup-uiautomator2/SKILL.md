---
name: setup-uiautomator2
description: Prepare and verify Appium UiAutomator2 by validating Node/Appium, Android SDK and Java prerequisites, driver installation, doctor output, and server smoke evidence. Use after the setup Skill selects UiAutomator2 or appium-troubleshooting hands off a UiAutomator2 prerequisite or doctor failure. Do not use for an existing runtime failure after prerequisites pass.
metadata:
  renma.id: skill.setup-uiautomator2
  renma.owner: appium
  renma.requires-context: '["contexts/platform/android/profile.md","contexts/tools/appium/setup-basics.md","contexts/platform/android/emulator-setup.md","contexts/tools/appium/setup/references/uiautomator2/uiautomator2-decision-logic.md","contexts/tools/appium/setup/references/uiautomator2/uiautomator2-driver-install.md","contexts/tools/appium/setup/references/uiautomator2/uiautomator2-doctor-validation.md","contexts/tools/appium/setup/references/uiautomator2/uiautomator2-smoke-status.md"]'
  renma.optional-context: '["contexts/tools/appium/setup/profiles/global-appium.md","contexts/tools/appium/setup/profiles/local-npx.md","contexts/platform/linux/profile.md","contexts/platform/macos/profile.md","contexts/platform/windows/profile.md","contexts/tools/appium/setup/examples/uiautomator2.md","contexts/tools/appium/capabilities.md","contexts/tools/ffmpeg/setup.md","contexts/platform/android/bundletool.md"]'
  renma.security-profile: appium-local-workflows
---

# UiAutomator2 Setup Workflow

## UiAutomator2 setup routing and handoffs

Prepare only the UiAutomator2 route. Hand an already failing UiAutomator2
session or command back to `skills/appium-troubleshooting/SKILL.md` after
required setup checks pass. Load FFmpeg or bundletool only when the user
explicitly requested that capability.

## Required inputs

Confirm Android as the target, global `appium` mode or explicitly requested
local `npx appium` mode, host OS, device or emulator expectations, permissions,
and optional dependency requests.

## Workflow outline

1. Load the global command profile by default or the local profile only when
   explicitly requested.
2. Load the Android profile, shared Appium setup basics, and Android emulator
   setup Context.
3. Load the UiAutomator2 decision, installation, doctor, and smoke references
   in that order.
4. Run `node tools/appium/setup/scripts/check-uiautomator2-env.mjs`; pass
   `--appium-mode local` only for local mode. Apply required fixes in technical
   dependency order and rerun the affected check after each fix.
5. Run the UiAutomator2 doctor and server smoke checks. Load the matching
   example only when it clarifies execution.

## UiAutomator2 setup safety and approval constraints

- Preserve the selected command mode throughout the workflow.
- Ask before optional FFmpeg or bundletool setup, privileged commands, SDK
  license changes, or emulator creation that changes local state.
- Preserve working Java, Android SDK, device, emulator, and driver
  installations.

## Completion criteria

- Android environment completion criteria pass.
- Appium succeeds in the selected command mode.
- The installed driver list includes `uiautomator2`.
- `appium driver doctor uiautomator2` reports `0 required fixes needed`;
  optional warnings are non-blocking.
- `/status` succeeds, server logs list `uiautomator2`, and cleanup leaves no
  Appium server process.

## Evidence boundary

Report Appium and UiAutomator2 versions, helper `requiredOk`, Android
prerequisite summary, doctor required/optional summary, `/status`, server
driver evidence, cleanup, and explicitly requested optional capability results.

## Self-Improvement Prompt

Before the final response, report any missing, ambiguous, outdated, or
retry-causing UiAutomator2 setup instruction with its asset path and proposed
wording. Leave unrelated assets unchanged.

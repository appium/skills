---
name: setup-espresso
description: Prepare and verify Appium Espresso by validating Node/Appium, Android SDK and Java prerequisites, driver installation, doctor output, and server smoke evidence. Use after the setup Skill selects Espresso. Do not use for an existing Espresso runtime failure after prerequisites pass; this repository does not provide that troubleshooting workflow.
metadata:
  renma.id: skill.setup-espresso
  renma.title: Espresso Setup Workflow
  renma.owner: appium
  renma.tags: '["setup","espresso","android"]'
  renma.requires-context: '["contexts/platform/android/profile.md","contexts/tools/appium/setup-basics.md","contexts/platform/android/emulator-setup.md","contexts/tools/appium/setup/references/espresso/espresso-decision-logic.md","contexts/tools/appium/setup/references/espresso/espresso-driver-install.md","contexts/tools/appium/setup/references/espresso/espresso-doctor-validation.md","contexts/tools/appium/setup/references/espresso/espresso-smoke-status.md"]'
  renma.optional-context: '["contexts/tools/appium/setup/profiles/global-appium.md","contexts/tools/appium/setup/profiles/local-npx.md","contexts/platform/linux/profile.md","contexts/platform/macos/profile.md","contexts/platform/windows/profile.md","contexts/tools/appium/setup/examples/espresso.md","contexts/tools/appium/capabilities.md","contexts/tools/ffmpeg/setup.md","contexts/platform/android/bundletool.md"]'
  renma.security-profile: appium-local-workflows
---

# Espresso Setup Workflow

## Espresso setup routing and handoffs

Prepare only the Espresso route. Use driver-specific official guidance for an
existing Espresso runtime failure after setup passes. Load FFmpeg or bundletool
only when the user explicitly requested that capability.

## Required inputs

Confirm Android as the target, global `appium` mode or explicitly requested
local `npx appium` mode, host OS, device or emulator expectations, permissions,
and optional dependency requests.

## Workflow outline

1. Load the global command profile by default or the local profile only when
   explicitly requested.
2. Load the Android profile, shared Appium setup basics, and Android emulator
   setup Context.
3. Load the Espresso decision, installation, doctor, and smoke references in
   that order.
4. Run `node tools/appium/setup/scripts/check-espresso-env.mjs`; pass
   `--appium-mode local` only for local mode. Apply required fixes in technical
   dependency order and rerun the affected check after each fix.
5. Run the Espresso doctor and server smoke checks. Load the matching example
   only when it clarifies execution.

## Espresso setup safety and approval constraints

- Preserve the selected command mode and working Java, Android SDK, device,
  emulator, and Espresso installations.
- Ask before optional FFmpeg or bundletool setup, privileged commands, SDK
  license changes, Espresso build changes, or emulator creation that changes
  local state.

## Completion criteria

- Android environment completion criteria pass.
- Appium succeeds in the selected command mode.
- The installed driver list includes `espresso`.
- `appium driver doctor espresso` reports `0 required fixes needed`; optional
  warnings are non-blocking.
- `/status` succeeds, server logs list `espresso`, and cleanup leaves no Appium
  server process.

## Evidence boundary

Report Appium and Espresso versions, helper `requiredOk`, Android prerequisite
summary, doctor required/optional summary, `/status`, server driver evidence,
cleanup, and explicitly requested optional capability results.

## Self-Improvement Prompt

Before the final response, report any missing, ambiguous, outdated, or
retry-causing Espresso setup instruction with its asset path and proposed
wording. Leave unrelated assets unchanged.

---
name: setup-xcuitest
description: Prepare and verify Appium XCUITest for iOS or tvOS on macOS by validating Node/Appium, Xcode, driver installation, doctor output, simulator or shared real-device prerequisites, and server smoke evidence. Use when the setup Skill selects XCUITest or appium-troubleshooting hands off an XCUITest prerequisite or doctor failure. For a real device, continue to xcuitest-real-device-config after this Skill passes. Do not use for real-device signing, provisioning, or WebDriverAgent deployment.
metadata:
  renma.id: skill.setup-xcuitest
  renma.continues-with: '["skill.xcuitest-real-device-config"]'
  renma.title: XCUITest Setup Workflow
  renma.owner: appium
  renma.tags: '["setup","xcuitest","ios","tvos"]'
  renma.requires-context: '["contexts/platform/macos/profile.md","contexts/tools/appium/setup/profiles/xcuitest.md","contexts/tools/appium/setup-basics.md","contexts/platform/macos/xcode-prereqs.md","contexts/tools/appium/setup/references/xcuitest/xcuitest-decision-logic.md","contexts/tools/appium/setup/references/xcuitest/xcuitest-driver-doctor.md","contexts/tools/appium/setup/references/xcuitest/xcuitest-smoke-status.md"]'
  renma.optional-context: '["contexts/tools/appium/setup/profiles/global-appium.md","contexts/tools/appium/setup/profiles/local-npx.md","contexts/tools/appium/setup/examples/xcuitest.md","contexts/tools/appium/capabilities.md","contexts/tools/ffmpeg/setup.md"]'
  renma.security-profile: appium-local-workflows
---

# XCUITest Setup Workflow

## XCUITest setup routing and handoffs

Prepare shared Appium XCUITest prerequisites for iOS or tvOS. For a simulator,
complete this Skill after doctor and smoke checks pass. For a real device,
complete these shared prerequisites first and then continue with
`skills/xcuitest-real-device-config/SKILL.md` for trust, Developer Mode,
signing, provisioning, WebDriverAgent deployment, and connectivity. Hand later
runtime failures to `skills/appium-troubleshooting/SKILL.md`.

## Required inputs

Confirm iOS or tvOS, simulator or real device, macOS host, global `appium` mode
or explicitly requested local `npx appium` mode, Xcode state, permissions, and
optional FFmpeg requests.

## Workflow outline

1. Load the global command profile by default or the local profile only when
   explicitly requested.
2. Load the macOS and XCUITest profiles, shared Appium setup basics, Xcode
   prerequisites, and XCUITest decision, driver-doctor, and smoke references.
3. Run `node tools/appium/setup/scripts/check-xcuitest-env.mjs`; pass
   `--appium-mode local` only for local mode. Use
   `summary.requiredOk: true` as the read-only setup gate.
4. Apply required fixes in technical dependency order and rerun the affected
   check.
5. Run the XCUITest doctor and server smoke checks. Load the matching example
   only when it clarifies execution.
6. If the target is a real device, continue to the real-device Skill only after
   these shared prerequisites pass.

## XCUITest setup safety and approval constraints

- Require macOS.
- Ask before optional FFmpeg setup, privileged commands, Xcode license or
  first-launch changes, trust changes, signing changes, or device installation.
- Leave real-device signing, provisioning, and WDA deployment to the
  real-device Skill.
- Preserve the selected command mode and working Xcode and driver
  installations.

## Completion criteria

- `xcodebuild -version` and `xcode-select -p` succeed.
- Xcode license and first-launch requirements are handled.
- Appium succeeds in the selected command mode and the installed list includes
  `xcuitest`.
- `appium driver doctor xcuitest` reports `0 required fixes needed`; optional
  warnings are non-blocking.
- `/status` succeeds and logs list `xcuitest`.
- For a real-device request, the exact continuation to
  `skill.xcuitest-real-device-config` is reported after shared setup passes.

## Evidence boundary

Report Xcode tooling, Appium and XCUITest versions, helper and doctor summaries,
simulator or device target, `/status`, server driver evidence, cleanup, and
whether the real-device continuation applies.

## Self-Improvement Prompt

Before the final response, report any missing, ambiguous, outdated, or
retry-causing XCUITest setup instruction with its asset path and proposed
wording. Leave unrelated assets unchanged.

---
name: setup-mac2
description: Prepare and verify Appium Mac2 for native macOS automation by validating Node/Appium, macOS and Xcode tooling, driver installation, doctor output, privacy authorization boundaries, and server smoke evidence. Use after the setup Skill selects Mac2. Do not use for an existing Mac2 runtime failure after prerequisites pass.
metadata:
  renma.id: skill.setup-mac2
  renma.title: Mac2 Setup Workflow
  renma.owner: appium
  renma.tags: '["setup","mac2","macos"]'
  renma.requires-context: '["contexts/platform/macos/profile.md","contexts/tools/appium/setup/profiles/mac2.md","contexts/tools/appium/setup-basics.md","contexts/platform/macos/xcode-command-line-tools.md","contexts/tools/appium/setup/references/mac2/mac2-decision-logic.md","contexts/tools/appium/setup/references/mac2/mac2-driver-doctor.md","contexts/tools/appium/setup/references/mac2/mac2-smoke-status.md"]'
  renma.optional-context: '["contexts/tools/appium/setup/profiles/global-appium.md","contexts/tools/appium/setup/profiles/local-npx.md","contexts/tools/appium/setup/examples/mac2.md","contexts/tools/appium/capabilities.md"]'
  renma.security-profile: appium-local-workflows
---

# Mac2 Setup Workflow

## Mac2 setup routing and handoffs

Prepare only the Appium Mac2 route on macOS. Use driver-specific official
guidance for an existing runtime failure after setup passes.

## Required inputs

Confirm macOS as the host and target, global `appium` mode or explicitly
requested local `npx appium` mode, Xcode tooling state, permissions, and any
required privacy authorization state.

## Workflow outline

1. Load the global command profile by default or the local profile only when
   explicitly requested.
2. Load the macOS and Mac2 profiles, shared Appium setup basics, Xcode
   command-line-tools Context, and Mac2 decision, doctor, and smoke references.
3. Run `node tools/appium/setup/scripts/check-mac2-env.mjs`; pass
   `--appium-mode local` only for local mode. Use
   `summary.requiredOk: true` as the read-only setup gate.
4. Apply required fixes in technical dependency order and rerun the affected
   check.
5. Run the Mac2 doctor and server smoke checks. Load the matching example only
   when it clarifies execution.

## Mac2 setup safety and approval constraints

- Require macOS.
- Ask before privileged commands, Xcode license or first-launch changes, or
  privacy-setting changes.
- Preserve the selected command mode and working Xcode and driver
  installations.

## Completion criteria

- `xcodebuild -version` and `xcode-select -p` succeed.
- Xcode license and first-launch requirements are handled.
- Appium succeeds in the selected command mode and the installed list includes
  `mac2`.
- `appium driver doctor mac2` reports `0 required fixes needed`.
- Required privacy permissions are user-approved when session startup needs
  them.
- `/status` succeeds and logs list `mac2`.

## Evidence boundary

Report Xcode tooling, Appium and driver versions, helper and doctor summaries,
privacy authorization blockers, `/status`, server driver evidence, and cleanup.

## Self-Improvement Prompt

Before the final response, report any missing, ambiguous, outdated, or
retry-causing Mac2 setup instruction with its asset path and proposed wording.
Leave unrelated assets unchanged.

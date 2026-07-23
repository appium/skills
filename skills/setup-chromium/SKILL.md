---
name: setup-chromium
description: Prepare and verify Appium Chromium for Chrome, Chromium, or Edge desktop automation by validating Node/Appium, browser prerequisites, driver installation, doctor support, and a minimal browser-session smoke check. Use after the setup Skill selects Chromium. Do not use for an existing Chromium runtime failure after prerequisites pass.
metadata:
  renma.id: skill.setup-chromium
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/setup/profiles/chromium.md","contexts/tools/appium/setup-basics.md","contexts/browser/chromium/prereqs.md","contexts/tools/appium/setup/references/chromium/chromium-decision-logic.md","contexts/tools/appium/setup/references/chromium/chromium-driver-validation.md","contexts/tools/appium/setup/references/chromium/chromium-smoke-status.md"]'
  renma.optional-context: '["contexts/tools/appium/setup/profiles/global-appium.md","contexts/tools/appium/setup/profiles/local-npx.md","contexts/platform/linux/profile.md","contexts/platform/macos/profile.md","contexts/platform/windows/profile.md","contexts/tools/appium/setup/examples/chromium.md","contexts/tools/appium/capabilities.md"]'
  renma.security-profile: appium-local-workflows
---

# Chromium Setup Workflow

## Chromium setup routing and handoffs

Prepare only the Appium Chromium route for Chrome, Chromium, or Edge desktop
browsers. Use driver-specific official guidance for an existing runtime failure
after setup passes.

## Required inputs

Confirm the browser and executable when non-default, global `appium` mode or
explicitly requested local `npx appium` mode, host OS, permissions, and whether
a session-time browser-driver download is authorized.

## Workflow outline

1. Load the global command profile by default or the local profile only when
   explicitly requested.
2. Load the Chromium profile, shared Appium setup basics, browser prerequisites,
   and Chromium decision, driver-validation, and smoke references.
3. Run `node tools/appium/setup/scripts/check-chromium-env.mjs`; pass
   `--appium-mode local` only for local mode. Use top-level
   `summary.requiredOk` as the read-only gate.
4. Apply required fixes in technical dependency order and rerun the affected
   check.
5. Run `/status` and
   `node tools/appium/setup/scripts/smoke-chromium-session.mjs`. Load the
   matching example only when it clarifies execution.

## Chromium setup safety and approval constraints

- Ask before privileged package-manager commands, browser installation, or a
  session-time browser-driver download.
- Preserve the selected command mode and existing working browser and driver
  installations.

## Completion criteria

- Appium succeeds in the selected command mode with major version `>= 3`.
- The installed driver list includes `chromium`.
- At least one supported Chromium browser is available.
- Doctor reports `0 required fixes needed` when supported; otherwise the
  install, list, browser, and smoke gates pass.
- `/status` succeeds, logs list `chromium`, and the minimal browser session
  helper reports top-level `summary.requiredOk: true`.

## Evidence boundary

Report Appium and driver versions, browser and executable evidence, helper and
doctor summaries, `/status`, server driver evidence, minimal session result,
and cleanup.

## Self-Improvement Prompt

Before the final response, report any missing, ambiguous, outdated, or
retry-causing Chromium setup instruction with its asset path and proposed
wording. Leave unrelated assets unchanged.

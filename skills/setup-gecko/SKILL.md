---
name: setup-gecko
description: Prepare and verify Appium Gecko for Firefox desktop automation by validating Node/Appium, Firefox prerequisites, driver installation, optional GeckoDriver availability, doctor support, and server smoke evidence. Use after the setup Skill selects Gecko. Do not use for an existing Gecko runtime failure after prerequisites pass.
metadata:
  renma.id: skill.setup-gecko
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/setup/profiles/gecko.md","contexts/tools/appium/setup-basics.md","contexts/browser/firefox/prereqs.md","contexts/tools/appium/setup/references/gecko/gecko-decision-logic.md","contexts/tools/appium/setup/references/gecko/gecko-driver-validation.md","contexts/tools/appium/setup/references/gecko/gecko-smoke-status.md"]'
  renma.optional-context: '["contexts/tools/appium/setup/profiles/global-appium.md","contexts/tools/appium/setup/profiles/local-npx.md","contexts/platform/linux/profile.md","contexts/platform/macos/profile.md","contexts/platform/windows/profile.md","contexts/tools/appium/setup/examples/gecko.md","contexts/tools/appium/capabilities.md"]'
  renma.security-profile: appium-local-workflows
---

# Gecko Setup Workflow

## Gecko setup routing and handoffs

Prepare only the Appium Gecko route for Firefox desktop browsers. Use
driver-specific official guidance for an existing runtime failure after setup
passes.

## Required inputs

Confirm the Firefox channel or executable when non-default, global `appium`
mode or explicitly requested local `npx appium` mode, host OS, and permissions
for browser or package-manager changes.

## Workflow outline

1. Load the global command profile by default or the local profile only when
   explicitly requested.
2. Load the Gecko profile, shared Appium setup basics, Firefox prerequisites,
   and Gecko decision, driver-validation, and smoke references.
3. Run `node tools/appium/setup/scripts/check-gecko-env.mjs`; pass
   `--appium-mode local` only for local mode. Use
   `summary.requiredOk: true` as the read-only setup gate.
4. Apply required fixes in technical dependency order and rerun the affected
   check.
5. Run the supported doctor and server smoke checks. Load the matching example
   only when it clarifies execution.

## Gecko setup safety and approval constraints

- Ask before privileged package-manager commands or browser installation.
- Install an optional Firefox channel only when explicitly requested;
  otherwise use an existing supported Firefox installation or report it
  missing.
- Preserve the selected command mode and working Firefox and driver
  installations.

## Completion criteria

- Appium succeeds in the selected command mode with major version `>= 3`.
- The installed driver list includes `gecko`.
- At least one supported Firefox browser is available.
- Doctor reports `0 required fixes needed` when supported; otherwise the
  install, list, Firefox, and smoke gates pass.
- `/status` succeeds and logs list `gecko`.

## Evidence boundary

Report Appium and driver versions, Firefox executable and channel, helper and
doctor summaries, `/status`, server driver evidence, and cleanup.

## Self-Improvement Prompt

Before the final response, report any missing, ambiguous, outdated, or
retry-causing Gecko setup instruction with its asset path and proposed wording.
Leave unrelated assets unchanged.

---
name: setup-safari
description: Prepare and verify Appium Safari on macOS by validating Node/Appium, Safari and safaridriver prerequisites, driver installation, optional doctor behavior, authorization boundaries, and server smoke evidence. Use after the setup Skill selects Safari. Do not use for an existing Safari runtime failure after prerequisites pass.
metadata:
  renma.id: skill.setup-safari
  renma.title: Safari Setup Workflow
  renma.owner: appium
  renma.tags: '["setup","safari","macos"]'
  renma.requires-context: '["contexts/platform/macos/profile.md","contexts/tools/appium/setup/profiles/safari.md","contexts/tools/appium/setup-basics.md","contexts/browser/safari/prereqs.md","contexts/tools/appium/setup/references/safari/safari-decision-logic.md","contexts/tools/appium/setup/references/safari/safari-driver-install.md","contexts/tools/appium/setup/references/safari/safari-smoke-status.md"]'
  renma.optional-context: '["contexts/tools/appium/setup/profiles/global-appium.md","contexts/tools/appium/setup/profiles/local-npx.md","contexts/tools/appium/setup/examples/safari.md","contexts/tools/appium/capabilities.md"]'
  renma.security-profile: appium-local-workflows
---

# Safari Setup Workflow

## Safari setup routing and handoffs

Prepare only the Appium Safari route on macOS. Use driver-specific official
guidance for an existing runtime failure after setup passes.

## Required inputs

Confirm macOS as the host, desktop or simulator Safari target, global `appium`
mode or explicitly requested local `npx appium` mode, Safari automation state,
and permissions for authorization changes.

## Workflow outline

1. Load the global command profile by default or the local profile only when
   explicitly requested.
2. Load the macOS and Safari profiles, shared Appium setup basics, Safari
   prerequisites, and Safari decision, installation, and smoke references.
3. Run `node tools/appium/setup/scripts/check-safari-env.mjs`; pass
   `--appium-mode local` only for local mode. Use
   `summary.requiredOk: true` as the read-only setup gate.
4. Apply required fixes in technical dependency order and rerun the affected
   check.
5. Run the supported doctor and server smoke checks. Load the matching example
   only when it clarifies execution.

## Safari setup safety and approval constraints

- Require macOS.
- Ask before privileged commands, browser installation, or enabling Safari
  automation.
- Preserve the selected command mode and working Safari and driver
  installations.

## Completion criteria

- `safaridriver --version` succeeds.
- Safari automation is enabled when needed and user-approved.
- Appium succeeds in the selected command mode and the installed list includes
  `safari`.
- Doctor reports `0 required fixes needed` when supported; unsupported doctor
  behavior is reported and does not replace install, list, or smoke gates.
- `/status` succeeds and logs list `safari`.

## Evidence boundary

Report macOS and Safari versions, `safaridriver` evidence, Appium and driver
versions, helper and doctor summaries, authorization blockers, `/status`,
server driver evidence, and cleanup.

## Self-Improvement Prompt

Before the final response, report any missing, ambiguous, outdated, or
retry-causing Safari setup instruction with its asset path and proposed
wording. Leave unrelated assets unchanged.

---
name: prepare-development-environment
description: Prepare and validate this Appium Skills repository for local development or contribution by checking the workspace, Git, Node, npm, helper scripts, Agent Skills, repository-local relationships, and the configured Renma blocking gate. Use before editing or validating repository Skills, Context Assets, examples, or tools. Do not use for Appium driver setup, existing runtime failures, or real-device signing; use setup, appium-troubleshooting, or xcuitest-real-device-config instead.
metadata:
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/development-environment/readiness.md"]'
  renma.security-profile: appium-local-workflows
---

# Appium Repository Development Workflow

## Repository-readiness routing and handoffs

Route repository development readiness and repository-wide validation through this workflow. Hand Appium driver installation or doctor repair to `skills/setup/SKILL.md`, supported existing runtime failures to `skills/appium-troubleshooting/SKILL.md`, and real-device signing or WebDriverAgent deployment to `skills/xcuitest-real-device-config/SKILL.md`.

## Required inputs

Confirm the repository root, requested validation or edit scope, host OS and shell, available permissions, and existing uncommitted changes that must be preserved.

## Workflow outline

1. Load `contexts/tools/appium/development-environment/readiness.md` before making repository changes.
2. Inspect the workspace and run the Node readiness helper named by that Context.
3. Make only the repository changes in scope, preserving repository-first shared `contexts/` and `tools/` boundaries.
4. Record `renma --version`, use a repository-pinned version when one exists, and otherwise report the active CLI version. Run `renma scan .` and require its configured blocking gate to pass.
5. Validate every changed or in-scope Agent Skill, repository-local path and declared Context relationship, and JavaScript module syntax as directed by the readiness Context.
6. Review every remaining Renma advisory; address applicable advisories and document the rationale for accepting any deferred or inapplicable advisory.

## Repository-editing safety and approval constraints

- Preserve uncommitted user work and avoid unrelated edits.
- If work requires Appium drivers, optional dependencies, or privileged system packages, stop repository readiness and hand that work to the appropriate setup workflow and approval gate.
- Keep Renma specification, security, required-graph, and configured severity gates unchanged; address applicable findings or document accepted non-blocking advisories.
- Retain reusable Context Assets and deterministic repository tools at the repository level. If a request instead requires standalone packaging, stop and treat it as a separate architecture change.

## Completion criteria

Finish the workflow only after these local checks pass:

- The Node readiness helper reports `requiredOk: true`.
- Renma exits successfully at the configured blocking threshold.
- The Agent Skill validator reports no invalid Skills.
- Local path and declared Context relationship checks report no broken targets.
- JavaScript module syntax checks pass.

Assign each remaining Renma advisory an addressed, deferred, or inapplicable disposition.

## Evidence boundary

Provide command status summaries; advisory rule ID, severity, disposition, and rationale; and any unresolved external blocker. If additional evidence is requested, quote only the relevant command's sanitized lines.

## Evidence

Example input: `Prepare this Appium skills repo for development and validate it with renma.` Verify with Git workspace inspection, Node/npm readiness evidence, `node tools/appium/setup/scripts/check-node-env.mjs`, and `renma scan .`.

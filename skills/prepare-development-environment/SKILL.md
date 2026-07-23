---
name: prepare-development-environment
description: Prepare and validate this Appium Skills repository for local development or contribution by checking the workspace, Git, Node, npm, helper scripts, Skill entrypoint structure, repository-local paths, and JavaScript syntax. Use before editing or validating repository Skills, Context Assets, examples, or tools. Do not use for Appium driver setup, existing runtime failures, or real-device signing; use setup, appium-troubleshooting, or xcuitest-real-device-config instead.
metadata:
  renma.id: skill.prepare-development-environment
  renma.published-entrypoint: "true"
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
4. Validate every changed or in-scope Skill's required frontmatter, repository-local path, explicit Context relationship, and JavaScript module syntax as directed by the readiness Context.
5. Run the edited helper or the narrowest representative repository check when practical.
6. Run `git diff --check`, then review the final status and diff for unintended changes.

## Hard Constraints

- Preserve uncommitted user work and avoid unrelated edits.
- If work requires Appium drivers, optional dependencies, or privileged system packages, stop repository readiness and hand that work to the appropriate setup workflow and approval gate.
- Do not install or require external repository analyzers or validator dependencies as part of this workflow. Already-available platform validators may provide optional supporting evidence, but they are not completion gates.
- Retain reusable Context Assets and deterministic repository tools at the repository level. If a request instead requires standalone packaging, stop and treat it as a separate architecture change.

## Completion criteria

Finish the workflow only after these local checks pass:

- The Node readiness helper reports `requiredOk: true`.
- `git status --short` has been reviewed so existing, in-scope, and unrelated changes are distinguished.
- Every changed Skill contains its required `name` and `description` frontmatter.
- Every changed or introduced repository-local path and explicit Context relationship resolves to an existing target.
- JavaScript module syntax checks pass.
- `git diff --check` passes and the final diff contains no unintended changes.

## Evidence boundary

Provide command status summaries, paths checked, and any unresolved external blocker. If additional evidence is requested, quote only the relevant command's sanitized lines.

## Evidence

Example input: `Prepare this Appium skills repo for development and validate the changed helpers.` Verify with Git workspace inspection, Node/npm readiness evidence, `node tools/appium/setup/scripts/check-node-env.mjs`, path checks, JavaScript syntax checks, and `git diff --check`.

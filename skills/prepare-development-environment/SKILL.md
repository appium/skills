---
name: prepare-development-environment
description: Prepare and validate this Appium Skills repository for local development or contribution by checking the workspace, Git, Node, npm, helper scripts, Skill entrypoint structure, repository-local paths, and JavaScript syntax. Use before editing or validating repository Skills, Context Assets, examples, or tools. Do not use for Appium driver setup, existing runtime failures, or real-device signing.
metadata:
  renma.id: skill.prepare-development-environment
  renma.published-entrypoint: "true"
  renma.title: Appium Repository Development Workflow
  renma.owner: appium
  renma.tags: '["repository-development","validation"]'
  renma.security-profile: appium-local-workflows
---

# Appium Repository Development Workflow

## Repository-readiness routing and handoffs

Use this Skill for repository development readiness and repository-wide
validation. Route Appium driver installation or doctor repair to
`skills/setup/SKILL.md`, supported existing runtime failures to
`skills/appium-troubleshooting/SKILL.md`, and real-device XCUITest work through
`skills/setup-xcuitest/SKILL.md`.

## Required inputs

Confirm the repository root, requested validation or edit scope, host OS and
shell, available permissions, and existing uncommitted changes that must be
preserved.

## Workflow outline

1. Load `AGENTS.md` and inspect the workspace without changing it:
   `git status --short`, repository file inventory, `node --version`,
   `npm --version`, and `npm config get registry`.
2. Run `node tools/appium/setup/scripts/check-node-env.mjs`. Require top-level
   `summary.requiredOk: true`; report `summary.npmConnectivityOk` separately
   and gate it only when the requested work needs network access.
3. Identify the changed or explicitly in-scope files. Read each affected Skill
   and Context Asset and verify every changed repository-relative target.
4. Make only the requested repository changes, preserving repository-first
   shared `contexts/` and `tools/` boundaries and unrelated user work.
5. For every changed Skill, verify required `name` and `description`
   frontmatter, explicit Context relationships, and provider UI metadata when
   present. Use an already installed platform validator only as optional
   evidence.
6. Run `node --check` for every changed JavaScript module. For repository-wide
   helper edits, check every module under `tools/`.
7. Run the edited helper or narrowest representative helper when practical.
8. Run `git diff --check`, then review `git status --short` and the final diff
   for unintended changes.

## Hard constraints

- Preserve uncommitted user work and avoid unrelated edits.
- If work requires Appium drivers, optional dependencies, privileged system
  packages, signing, or device authorization, stop repository readiness and
  hand off to the owning setup workflow.
- Use already installed repository analyzers or validators only as optional
  evidence. When unavailable, rely on the required repository-local checks.
- Retain reusable Context Assets and deterministic repository tools at the
  repository level unless the request explicitly changes architecture.
- Run commands step by step and rerun only the affected check after each fix.

## Completion criteria

- The Node readiness helper reports `summary.requiredOk: true`.
- `git status --short` has been reviewed so existing, in-scope, and unrelated
  changes are distinguished.
- Every changed Skill contains required frontmatter and valid explicit Context
  relationships.
- Every changed or introduced repository-local path resolves.
- Changed JavaScript modules pass syntax checks.
- The edited or representative helper passes when practical.
- `git diff --check` passes and the final diff contains no unintended changes.

## Evidence boundary

Report command status summaries, paths checked, validation results, preserved
unrelated work, and unresolved external blockers. Quote only sanitized lines
when additional evidence is requested.

## Self-Improvement Prompt

Before the final response, identify any missing, ambiguous, outdated, or
retry-causing instruction encountered in this Skill or any loaded asset.
Report the asset path and proposed wording. Leave unrelated files unchanged.

## Evidence

Example input: `Prepare this Appium skills repo for development and validate
the changed helpers.` Verify workspace state, Node/npm readiness, explicit
paths, Skill metadata, changed JavaScript syntax, the narrowest helper,
`git diff --check`, and the final diff.

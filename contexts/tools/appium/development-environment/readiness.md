---
security_profile: appium-local-workflows
id: appium-development-environment-readiness
owner: appium
status: stable
---

# Development Environment Readiness

## Scope

Use this context to prepare the Appium skills repository for local development, contribution, and validation. Keep repository readiness separate from Appium runtime setup; route runtime setup to `skills/setup/SKILL.md` after this repository workflow passes or when the user asks for a specific driver/platform.

## Workflow

1. Load `AGENTS.md`, the selected skill entrypoint, and this context.
2. Inspect the workspace without changing it:
   - `git status --short`
   - `find . -type f`
   - `node --version`
   - `npm --version`
   - `npm config get registry`
3. Run the Node readiness helper when Node is available:
   - `node tools/appium/setup/scripts/check-node-env.mjs`
4. Treat Node.js 20 or newer and successful Node/npm version checks as the baseline for local helper-script development. Require `summary.requiredOk: true`; report `summary.npmConnectivityOk` separately and gate it only when the requested work needs network access. If a required check fails, fix only the smallest issue and rerun the helper.
5. Identify the changed or explicitly in-scope files. Read each affected Skill and Context asset, then use `test -e <path>` for every repository-relative target it introduces or changes.
6. For each changed Skill, verify that `SKILL.md` contains the required `name` and `description` frontmatter and that its explicit Context paths resolve. Run an already-installed platform Skill validator only as optional evidence; do not install validator dependencies solely for this workflow.
7. Run `node --check <path>` for every changed `.js` or `.mjs` helper. For repository-wide helper edits, check every module under `tools/`.
8. Run the edited helper or the narrowest representative helper when practical.
9. Run `git diff --check`, then review `git status --short` and the final diff to confirm that unrelated work is preserved and no unintended changes remain.
10. Route driver-specific setup to `skills/setup/SKILL.md`, real-device XCUITest setup to `skills/xcuitest-real-device-config/SKILL.md`, and existing Appium failures to `skills/appium-troubleshooting/SKILL.md`.

## Setup Rules

- Run commands step by step and rerun checks after each fix.
- Prefer user-space and global npm/Appium setup (`npm -g`, `appium`) unless the user explicitly requested local `npx appium` mode.
- Ask before installing optional dependencies, third-party real-device tools, FFmpeg, bundletool, or anything requiring elevated privileges.
- Avoid `sudo` unless the user explicitly requests it.
- Do not install repository analyzers or validation dependencies as part of baseline readiness.
- Do not edit repository metadata or unrelated files unless the user asks for those changes.
- Preserve uncommitted user changes. If a required edit overlaps with existing changes, read the file carefully and work with the current contents.

## Verification

Use the narrowest verification that matches the work:

- Repository development readiness: report `node`, `npm`, registry, helper-script `requiredOk`, relevant path checks, JavaScript syntax results, and `git diff --check`.
- Driver-specific setup: required Appium doctor checks must report `0 required fixes needed`; optional warnings are non-blocking.
- Context or script edits: run the edited helper or a representative helper script when practical, check changed JavaScript modules with `node --check`, and run `git diff --check`.
- Skill edits: inspect required Skill frontmatter and explicit repository-local paths, validate provider UI metadata when present, and use an already-installed platform validator only as optional evidence.

## Self-Improvement Prompt

Before the final response, identify any missing, ambiguous, outdated, or retry-causing instruction encountered in this context or any loaded asset. Report the loaded asset path and proposed wording. Do not edit those files unless the user explicitly asks.

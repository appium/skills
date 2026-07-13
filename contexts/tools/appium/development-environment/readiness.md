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
4. Treat Node.js 20 or newer and working npm as the baseline for local helper-script development. If the helper reports `requiredOk: false`, fix only the smallest required issue and rerun the helper.
5. Run repository quality validation:
   - `renma --version`
   - `renma scan .`
   Use a repository-pinned Renma version when one exists. If the repository has no version pin, use the active installed CLI and report its version with the validation result.
6. Require the configured Renma blocking gate to pass. Review all remaining advisories, address the applicable ones, and explicitly accept deferred or inapplicable advisories with a documented rationale. Preserve focused `skills/*/SKILL.md` workflow entry points while keeping reusable or selectively loaded procedures in canonical `contexts/**` assets.
7. For skill edits, run the available skill validator if the skill-creator tooling is present. If the validator cannot run because of missing local dependencies, report that blocker and use a manual YAML/frontmatter check as supporting evidence.
8. Route driver-specific setup to `skills/setup/SKILL.md`, real-device XCUITest setup to `skills/xcuitest-real-device-config/SKILL.md`, and existing Appium failures to `skills/appium-troubleshooting/SKILL.md`.

## Setup Rules

- Run commands step by step and rerun checks after each fix.
- Prefer user-space and global npm/Appium setup (`npm -g`, `appium`) unless the user explicitly requested local `npx appium` mode.
- Ask before installing optional dependencies, third-party real-device tools, FFmpeg, bundletool, or anything requiring elevated privileges.
- Avoid `sudo` unless the user explicitly requests it.
- Do not edit repository metadata or unrelated files unless the user asks for those changes.
- Preserve uncommitted user changes. If a required edit overlaps with existing changes, read the file carefully and work with the current contents.

## Verification

Use the narrowest verification that matches the work:

- Repository development readiness: report `node`, `npm`, registry, helper-script `requiredOk`, and Renma diagnostics.
- Renma validation: `renma scan .` must pass the configured blocking threshold. Review every remaining diagnostic or advisory; report its severity, disposition, and rationale when accepted.
- Driver-specific setup: required Appium doctor checks must report `0 required fixes needed`; optional warnings are non-blocking.
- Context or script edits: run the edited helper or a representative helper script when practical, then rerun `renma scan .`.
- Skill edits: validate skill frontmatter and UI metadata, then rerun `renma scan .`.

## Self-Improvement Prompt

Before the final response, identify any missing, ambiguous, outdated, or retry-causing instruction encountered in this context or any loaded asset. Report the loaded asset path and proposed wording. Do not edit those files unless the user explicitly asks.

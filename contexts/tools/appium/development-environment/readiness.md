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
   - `renma scan . --fail-on high`
   - `renma readiness . --format json`
   - `renma catalog . --format json`
   - `renma graph . --format json`
   Use a repository-pinned Renma version when one exists. If the repository has no version pin, use the active installed CLI and report its version with the validation result.
6. Require `renma scan . --fail-on high` to pass and require every declared graph edge to resolve. Review `securityPolicyInventory.assetsWithoutEffectivePolicyList`, lifecycle and freshness coverage in the catalog, and every remaining diagnostic or advisory. Treat inventory gaps as review evidence rather than findings: address applicable items and explicitly accept deferred or inapplicable items with a documented rationale. Preserve focused `skills/*/SKILL.md` workflow entry points while keeping reusable or selectively loaded procedures in canonical `contexts/**` assets.
7. When comparing repository revisions, use `renma diff . --from <ref> --to <ref>` or `renma ci-report . --from <ref> --to <ref>` only when both references exist. Generate a BOM only when the task requires a reproducible context manifest.
8. Treat the `Agent Skills` result from `renma scan` as the canonical Skill validator and Renma dependency diagnostics as the declared-Context target check. Run the platform's Skill validator only as secondary evidence when it and its dependencies are already available; do not install validator dependencies without approval.
9. Run `node --check <path>` for every changed `.js` or `.mjs` helper. For repository-wide helper edits, check every module under `tools/`.
10. Route driver-specific setup to `skills/setup/SKILL.md`, real-device XCUITest setup to `skills/xcuitest-real-device-config/SKILL.md`, and existing Appium failures to `skills/appium-troubleshooting/SKILL.md`.

## Setup Rules

- Run commands step by step and rerun checks after each fix.
- Prefer user-space and global npm/Appium setup (`npm -g`, `appium`) unless the user explicitly requested local `npx appium` mode.
- Ask before installing optional dependencies, third-party real-device tools, FFmpeg, bundletool, or anything requiring elevated privileges.
- Avoid `sudo` unless the user explicitly requests it.
- Do not edit repository metadata or unrelated files unless the user asks for those changes.
- Preserve uncommitted user changes. If a required edit overlaps with existing changes, read the file carefully and work with the current contents.

## Verification

Use the narrowest verification that matches the work:

- Repository development readiness: report `node`, `npm`, registry, helper-script `requiredOk`, Renma diagnostics, graph resolution, and reviewed inventory gaps.
- Renma validation: `renma scan . --fail-on high` must pass. Review every remaining diagnostic, advisory, policy-coverage gap, and lifecycle or freshness gap; report its severity when present, disposition, and rationale when accepted.
- Driver-specific setup: required Appium doctor checks must report `0 required fixes needed`; optional warnings are non-blocking.
- Context or script edits: run the edited helper or a representative helper script when practical, check changed JavaScript modules with `node --check`, then rerun `renma scan . --fail-on high`.
- Skill edits: validate Skill frontmatter through the Renma Agent Skills result, validate provider UI metadata when present, then rerun `renma scan . --fail-on high`.

## Self-Improvement Prompt

Before the final response, identify any missing, ambiguous, outdated, or retry-causing instruction encountered in this context or any loaded asset. Report the loaded asset path and proposed wording. Do not edit those files unless the user explicitly asks.

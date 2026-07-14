---
description: "Repository-level execution rules for Appium skills. Use this guide to choose the correct skill entrypoint, enforce doctor-based verification, and preserve explicit approval gates for optional or privileged setup steps."
security_profile: appium-local-workflows
---

# AGENTS Guide for Appium Skills

This file defines how AI agents should execute the skills in this repository.

## Use When

Use this file to choose the correct Appium skill entrypoint and shared execution rules. When to use: load this guide before choosing a repository skill, then load the selected `SKILL.md` and its routed `contexts/` assets for step order and detailed procedures.

## Do Not Use For

- Do not use this file as a replacement for the selected skill instructions; load the relevant `SKILL.md`, routed contexts, profiles, references, examples, and procedures under `contexts/` before executing.
- Do not run optional FFmpeg, bundletool, or third-party real-device tooling unless the user explicitly requests that capability.

## Skill Entrypoints

- Repository development readiness: `skills/prepare-development-environment/SKILL.md`
- Appium setup: `skills/setup/SKILL.md`
- Existing Appium failures: `skills/appium-troubleshooting/SKILL.md`
- iOS or tvOS real-device XCUITest configuration: `skills/xcuitest-real-device-config/SKILL.md`

Each Skill is a focused workflow entry point in a repository-first architecture. The Skill owns selection, inputs, safety boundaries, workflow outline, loading decisions, and completion criteria. Reusable or selectively loaded technical guidance belongs in top-level `contexts/`; deterministic inspection or execution belongs in top-level `tools/`.

## Responsibility Boundaries

- Treat each Skill description as its authoritative selection contract.
- Keep focused execution flow, required inputs, safety and approval boundaries, completion criteria, and Context/tool loading instructions in `SKILL.md`.
- Keep reusable or selectively loaded technical knowledge in a Context Asset, and deterministic inspection or execution in a repository tool.
- Keep README summaries human-facing and non-authoritative for detailed routing.
- Treat generated inventories and reports as repository projections, not manually maintained domain guidance.

## Context Asset Structure

Keep a Context separate when it provides a meaningful selective-loading boundary, cross-Skill reuse, an independent technical or security concern, or an independent lifecycle. A Context may be removed or merged when it only redirects, duplicates owned routing, cannot be used independently, is always an indivisible fragment of one procedure, or exists only for inventory or graph shaping. Make these decisions semantically; file count and line count are not defects.

## Preflight

Before executing a skill, confirm the target platform, Appium driver, command mode (`appium` or `npx appium`), host OS, available permissions, relevant devices or simulators, and whether the user requested optional dependencies. Identify the exact skill files, canonical `contexts/` assets, `tools/` helper scripts, profiles, references, examples, and verification commands that apply before making environment changes.

## Execution Rules

- Execute skills one at a time in dependency order.
- Run commands step-by-step; avoid very long chained command blocks.
- Re-run checks after each fix.
- Use Appium doctor required fixes as the pass/fail gate:
  - Pass: `0 required fixes needed`
  - Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Avoid `sudo` in setup unless the user explicitly requests it.
- Prefer user-space installs and local project fallbacks when permissions are restricted.
- Use global npm/Appium commands by default (`npm -g`, `appium`).
- Use local execution (`npx appium`) only when the user explicitly asks for local mode.
- Use `contexts/tools/ffmpeg/setup.md` only when the user explicitly requests FFmpeg-related setup.
- Use `contexts/platform/android/bundletool.md` only when the user explicitly requests bundletool setup for UiAutomator2 or Espresso.
- If output is incomplete or truncated, rerun only that step and capture logs.
- After completing any workflow, read and apply the self-improvement prompt in the loaded context, reference, or procedure before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with the loaded asset path and proposed wording. Do not edit files unless the user explicitly asks.

## Completion Policy

Use the selected skill file's explicit checklist as the completion gate.

- Required doctor checks must pass.
- Optional doctor warnings do not block completion.
- Validate global command mode (`appium`) as the default completion path.
- Validate local command mode (`npx appium`) only when the user explicitly requests local execution.
- For repository validation, run `renma scan . --fail-on high` and require the configured Renma blocking gate to pass. Review all remaining advisories, address the applicable ones, and explicitly accept deferred or inapplicable advisories with a documented rationale.
- Do not require `Findings: 0`, `Diagnostics: 0`, a perfect readiness score, or the disappearance of all non-blocking advisories unless the configured blocking policy itself requires it.
- Do not weaken specification, security, required-graph, or configured severity gates to obtain a passing result.

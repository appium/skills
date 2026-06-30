---
owner: appium
name: prepare-development-environment
description: Prepare this Appium skills repository for local development, contribution, or validation work. Use when Codex needs to inspect and ready the repo workspace, confirm Git/Node/npm health, choose the right Appium setup route for driver-specific development, or verify that helper scripts and required doctor checks can run before editing skills, contexts, examples, or setup tooling.
requires_context: contexts/tools/appium/development-environment/readiness.md
---

# Appium Router Entry

## Required inputs

Before running this workflow, confirm the host OS and shell, whether the user wants repository development readiness or driver-specific Appium runtime setup, command mode (`appium` global by default or `npx appium` only when requested), available permissions, and whether optional dependencies were explicitly requested.

## Completion criteria

The workflow is complete after loading `contexts/tools/appium/development-environment/readiness.md`, passing the readiness checks, confirming the `renma scan .` output line `Findings: 0`, and routing any driver-specific setup to the canonical Appium setup assets with required doctor checks passing.

## Route

Use this thin entrypoint for preparing the Appium skills repository for local development and contribution. Load `contexts/tools/appium/development-environment/readiness.md` first, then route any platform, driver, real-device, or troubleshooting work to the matching Appium skill.

## When Not To Use

do not use for mismatched requests; choose the routed alternative below.

Do not use this skill for Appium driver installation or doctor repair after the repository itself is ready; route that input to `skills/setup/SKILL.md`. Do not use this skill for existing session failures; route to `skills/appium-troubleshooting/SKILL.md`. Do not use this skill for real-device signing or WebDriverAgent deployment; route to `skills/xcuitest-real-device-config/SKILL.md`.

## Evidence

Example input: `Prepare this Appium skills repo for development and validate it with renma.` Verify with Git workspace inspection, Node/npm readiness evidence, `node tools/appium/setup/scripts/check-node-env.mjs`, and `renma scan .`.

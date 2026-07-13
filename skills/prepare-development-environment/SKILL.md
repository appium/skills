---
name: prepare-development-environment
description: Prepare this Appium skills repository for local development, contribution, and Renma validation by checking the workspace, Git, Node, npm, helper scripts, and routing readiness. Use before editing or validating repository skills, contexts, examples, or setup tooling. Do not use for driver installation or repair, existing Appium failures, or real-device signing; use setup, appium-troubleshooting, or xcuitest-real-device-config instead.
metadata:
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/development-environment/readiness.md"]'
  renma.security-profile: appium-local-workflows
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

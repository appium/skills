---
name: appium-troubleshooting
description: Diagnose existing Appium failures by routing failed commands, session or app startup, driver startup, device connectivity, WebDriverAgent, browser automation, locator, and element lookup symptoms to canonical troubleshooting contexts. Use when Appium behavior is already failing. Do not use for first-time installation or pre-failure real-device signing and provisioning; use setup or xcuitest-real-device-config instead.
metadata:
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/troubleshooting/triage.md","contexts/tools/appium/troubleshooting/procedure.md"]'
  renma.security-profile: appium-local-workflows
---

# Appium Router Entry

## Required inputs

Before running this workflow, confirm the failing Appium command or symptom, target platform and driver, command mode (`appium` global or `npx appium`), host OS, device or simulator state, relevant capabilities, recent logs or doctor output, and available permissions for rerunning checks.

## Completion criteria

The workflow is complete when the relevant triage and symptom references have been loaded, the root cause or most likely unresolved blocker is stated, each applied fix is rerun with targeted evidence, required doctor checks pass or the remaining failure is documented, and the final response summarizes commands run, results, and next manual action if needed.

## Route

Use this thin entrypoint for Appium failure diagnosis. Load `contexts/tools/appium/troubleshooting/triage.md` first, then follow `contexts/tools/appium/troubleshooting/procedure.md` and the relevant profiles, references, and examples under `contexts/tools/appium/troubleshooting/`.

## When Not To Use

do not use for mismatched requests; choose the routed alternative below.

Do not use this skill for first-time environment installation; route that input to `skills/setup/SKILL.md`. Do not use this skill for real-device signing or provisioning before any failure exists; route that input to `skills/xcuitest-real-device-config/SKILL.md`.

## Evidence

Example input: `Diagnose why my UiAutomator2 session fails during startup with this server log and desired capabilities.` Verify the suspected failure class against logs, capabilities, device state, and driver-specific checks before recommending a fix.

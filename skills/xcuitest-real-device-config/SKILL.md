---
name: xcuitest-real-device-config
description: Prepare real iOS or tvOS devices for Appium XCUITest by routing readiness, provisioning, signing, WebDriverAgent, and deployment work to canonical contexts. Use for real-device trust, Developer Mode, signing, provisioning, or WebDriverAgent installation and connection setup. Do not use for simulator-only setup or general Appium failures unrelated to real-device signing or WebDriverAgent deployment; use setup or appium-troubleshooting instead.
metadata:
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/real-device/xcuitest-readiness.md"]'
  renma.security-profile: appium-local-workflows
---

# Appium Router Entry

## Required inputs

Before running this workflow, confirm the iOS or tvOS real device target, Appium command mode, host macOS and Xcode state, Apple signing option, WebDriverAgent deployment strategy, device trust and Developer Mode state, available provisioning credentials, and permissions for any required local signing or device checks.

## Completion criteria

The workflow is complete when the real-device readiness reference and matching signing and WebDriverAgent profiles have been loaded, required device, signing, and XCUITest checks are verified or explicitly blocked, any privileged or optional steps remain user-approved, and the final response reports the validated configuration, remaining manual actions, and evidence commands.

## Route

Use this thin entrypoint for real-device XCUITest setup. Load `contexts/tools/appium/real-device/xcuitest-readiness.md` first, then follow the relevant references, profiles, and examples under `contexts/tools/appium/real-device/`.

## When Not To Use

do not use for mismatched requests; choose the routed alternative below.

Do not use this skill for simulator-only XCUITest setup; route that input to `skills/setup/SKILL.md`. Do not use this skill for general Appium session failures unless the failure is specifically real-device signing or WebDriverAgent deployment; route general failures to `skills/appium-troubleshooting/SKILL.md`.

## Evidence

Example input: `Prepare a real iPhone for Appium XCUITest and verify WebDriverAgent can be installed.` Verify device trust, Developer Mode, signing assets, bundle IDs, WebDriverAgent deployment mode, and final connectivity before reporting readiness.

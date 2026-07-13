---
name: setup
description: Interactively select and set up one or more Appium drivers, then route Node.js, Android, simulator XCUITest, Espresso, Gecko, Chromium, Safari, Mac2, and smoke-validation work to canonical contexts. Use for requests such as "set up Appium," first-time installation, configuration, prerequisite repair, and doctor readiness. Ask which driver is needed when none is named; start the named driver routes without repeating that question. Do not use for an existing failing session or real iOS or tvOS signing and WebDriverAgent deployment; use appium-troubleshooting or xcuitest-real-device-config instead.
metadata:
  renma.id: skill.setup
  renma.title: Appium Router Entry
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/setup/routing.md"]'
  renma.security-profile: appium-local-workflows
---

# Appium Router Entry

## Required inputs

Resolve the driver selection before changing the environment.

- If the user explicitly names one or more drivers, accept those drivers as the selection and begin their setup routes without asking which driver is needed. For example, `Set up the UiAutomator2 and XCUITest drivers` selects both routes.
- If the user asks only to set up Appium, or otherwise names no driver, pause before installation and ask which Appium driver or drivers they need. Offer concise choices based on the selection guide in `contexts/tools/appium/setup/routing.md`, then install only the selected drivers.
- Treat only drivers explicitly selected by the user as requested setup targets. Use existing installations as evidence for preflight checks, not as a driver-selection decision.

After driver selection, confirm or detect the target platform, command mode (`appium` global by default or `npx appium` only when requested), host OS, relevant devices, simulators, or browsers, and available permissions. Ask only for inputs that cannot be detected safely. Optional dependencies such as FFmpeg or bundletool still require an explicit user request.

## Completion criteria

The workflow is complete when the selected setup references have been loaded, required Appium doctor checks report `0 required fixes needed`, optional warnings are identified as non-blocking, requested setup changes are verified with the matching helper script or smoke command, and the final response summarizes the checked versions, remaining optional items, and any blocked steps.

## Route

Use this thin entrypoint for Appium environment setup work. Load `contexts/tools/appium/setup/routing.md` first and apply its driver-selection gate. After the user has selected one or more drivers, load only the setup contexts, profiles, references, examples, and scripts that match those drivers, platforms, and install mode. For multiple drivers, prepare shared prerequisites once, then execute and verify each selected driver route in dependency order. Canonical setup assets live under `contexts/tools/appium/setup/`; executable helpers live under `tools/appium/setup/scripts/`.

## When Not To Use

do not use for mismatched requests; choose the routed alternative below.

Do not use this skill for diagnosing a failing session after setup has run; route that input to `skills/appium-troubleshooting/SKILL.md`. Do not use this skill for real iOS or tvOS signing and WebDriverAgent deployment; route that input to `skills/xcuitest-real-device-config/SKILL.md`.

## Evidence

Examples:

- Input: `Set up Appium.` Ask which driver or drivers are needed before running setup commands.
- Input: `Set up the UiAutomator2 and XCUITest drivers.` Begin both selected routes without asking for driver selection again.
- Input: `Set up Appium UiAutomator2 and verify Android SDK, Java, ADB, emulator, and driver readiness.` Verify by running the matching helper from `tools/appium/setup/scripts/` when a context asks for it, then report pass/fail evidence.

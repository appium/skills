---
name: setup
description: Select and set up one or more Appium drivers using the repository's shared Node.js, Android, simulator XCUITest, Espresso, Gecko, Chromium, Safari, Mac2, and smoke-validation Context Assets and tools. Use for requests such as "set up Appium," first-time installation, configuration, prerequisite repair, and doctor readiness. Ask which driver is needed when none is named; start named driver workflows without repeating that question. Do not use for an existing failing session or real iOS or tvOS signing and WebDriverAgent deployment; use appium-troubleshooting or xcuitest-real-device-config instead.
metadata:
  renma.id: skill.setup
  renma.title: Appium Setup Workflow
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/setup/routing.md"]'
  renma.security-profile: appium-local-workflows
---

# Appium Setup Workflow

## Routing and selection boundary

Route first-time Appium installation, selected driver setup, prerequisite repair, and doctor readiness through this workflow. Hand an already failing session or command to `skills/appium-troubleshooting/SKILL.md`; hand real iOS or tvOS signing and WebDriverAgent deployment to `skills/xcuitest-real-device-config/SKILL.md`.

## Required inputs

Resolve the driver selection before changing the environment.

- If the user explicitly names one or more drivers, accept those drivers as the selection and begin their setup routes without asking which driver is needed. For example, `Set up the UiAutomator2 and XCUITest drivers` selects both routes.
- If the user asks only to set up Appium, or otherwise names no driver, pause before installation and ask which Appium driver or drivers they need. Offer concise choices based on the selection guide in `contexts/tools/appium/setup/routing.md`, then install only the selected drivers.
- Treat only drivers explicitly selected by the user as requested setup targets. Use existing installations as evidence for preflight checks, not as a driver-selection decision.

After driver selection, confirm or detect the target platform, command mode (`appium` global by default or `npx appium` only when requested), host OS, relevant devices, simulators, or browsers, and available permissions. Ask only for inputs that cannot be detected safely. Optional dependencies such as FFmpeg or bundletool still require an explicit user request.

## Workflow outline

1. Load `contexts/tools/appium/setup/routing.md` and apply its driver-selection gate before changing the environment.
2. Load the global command profile by default or the local `npx` profile only when explicitly requested. Load the host profile when host-specific constraints affect the route.
3. For every selected driver, load only the setup Contexts, profiles, references, and examples named by the matching route. Load its shared capability Context only when capability selection affects setup.
4. Run the matching read-only helper from `tools/appium/setup/scripts/`, apply required fixes in dependency order, and rerun the affected check after each change.
5. Run the driver doctor and smoke checks required by the selected route. For multiple drivers, prepare shared prerequisites once and verify each route separately.

## Hard safety and approval constraints

- Use global npm/Appium commands by default; use local `npx appium` only when explicitly requested.
- Ask before optional FFmpeg or bundletool setup, third-party real-device tooling, privileged commands, browser installation, or authorization changes.
- Install only drivers selected by the user; if selection is still unclear, stop before environment changes and ask which driver is required.
- Preserve working installations and prefer the smallest required change.

## Completion criteria

Complete the workflow when each explicitly selected driver route has loaded its required Context Assets, required Appium doctor checks report `0 required fixes needed`, optional warnings are identified as non-blocking, and requested changes pass the matching helper and `/status` smoke checks. Limit evidence to the selected driver names and versions, helper `requiredOk` summary, doctor required/optional summary, `/status` result, remaining optional items, and any blocked manual step.

## Evidence

Examples:

- Input: `Set up Appium.` Ask which driver or drivers are needed before running setup commands.
- Input: `Set up the UiAutomator2 and XCUITest drivers.` Begin both selected routes without asking for driver selection again.
- Input: `Set up Appium UiAutomator2 and verify Android SDK, Java, ADB, emulator, and driver readiness.` Verify by running the matching helper from `tools/appium/setup/scripts/` when a context asks for it, then report pass/fail evidence.

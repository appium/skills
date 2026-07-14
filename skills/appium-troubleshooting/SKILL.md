---
name: appium-troubleshooting
description: Diagnose existing UiAutomator2 session-startup, app-activity, adb transport, helper-server, native or hybrid locator failures, and XCUITest WebDriverAgent, session-startup, app install or launch, device or simulator state, alert, element-source, or locator failures. Use when a session or command under one of those drivers already fails. Do not use for first-time setup, pre-failure real-device provisioning, or Espresso, Chromium, Gecko, Safari, or Mac2 failures; use setup, xcuitest-real-device-config, or driver-specific official guidance instead.
metadata:
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/troubleshooting/triage.md","contexts/tools/appium/troubleshooting/procedure.md"]'
  renma.security-profile: appium-local-workflows
---

# Appium Troubleshooting Workflow

## Troubleshooting routing and handoffs

Route only implemented UiAutomator2 and XCUITest failures through this workflow. If the driver is unknown, capture capabilities or Appium session logs before proceeding. Hand setup and doctor failures to `skills/setup/SKILL.md`, and hand real-device signing or provisioning work that exists before a failing session to `skills/xcuitest-real-device-config/SKILL.md`. The repository does not yet implement dedicated troubleshooting routes for Espresso, Chromium, Gecko, Safari, or Mac2.

## Required inputs

Confirm the exact failing command and error, UiAutomator2 or XCUITest driver, target platform, global `appium` or explicitly requested local `npx appium` mode, host OS, device or simulator state, relevant capabilities, recent server or device logs, smallest reproduction, and permissions for rerunning checks.

## Workflow outline

1. Load `contexts/tools/appium/troubleshooting/triage.md` and `contexts/tools/appium/troubleshooting/procedure.md`.
2. Lock the run to UiAutomator2 or XCUITest and load that driver's profile.
3. Load only the selected symptom route. A route may require tightly coupled references, such as XCUITest element lookup plus locator strategy. Load the triage Context's shared capability option when capability values are part of the suspected cause, and use the matching example only when it clarifies the reproduction.
4. If a prerequisite or doctor check fails, pause this workflow and use the selected driver route in `skills/setup/SKILL.md` before deeper troubleshooting.
5. For a fix request, apply one targeted change and rerun the smallest failing command, session start, WDA check, or locator lookup. For a diagnosis-only request, stop after evidence-backed cause isolation and present the targeted change as the next action.
6. Use the community-search Context only after the matching official reference does not explain the exact symptom.

## Troubleshooting safety and approval constraints

- Start with targeted evidence and the smallest reversible change; stop and request approval before any evidence-backed broad reset, reinstall, device erase, signing change, or unrelated capability change.
- Preserve global command mode unless the user explicitly requests local mode.
- Require the same approvals as the setup or real-device workflow before crossing into installation, privileged, signing, trust, or provisioning changes.
- Report a fix as successful only from a passing re-check. For diagnosis-only work, distinguish an evidence-backed cause from a hypothesis and stop with the smallest recommended next action.

## Completion criteria

Complete a fix request when the failing check passes after a verified fix, or when the exact blocker is isolated with command evidence and a concrete next manual action. Complete a diagnosis-only request when the cause is isolated from matching evidence and the smallest proposed fix or discriminating next check is reported without changing state. Report the loaded symptom route, commands and results, any change made, re-check evidence when applicable, and any required doctor result when prerequisite repair was involved.

## Evidence

Example input: `Diagnose why my UiAutomator2 session fails during startup with this server log and desired capabilities.` Verify the suspected failure class against logs, capabilities, device state, and driver-specific checks before recommending a fix.

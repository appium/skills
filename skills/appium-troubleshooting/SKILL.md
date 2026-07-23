---
name: appium-troubleshooting
description: Diagnose existing UiAutomator2 session-startup, app-activity, adb transport, helper-server, native or hybrid locator failures, and XCUITest WebDriverAgent, session-startup, app install or launch, device or simulator state, alert, element-source, or locator failures. Use when a session or command under one of those drivers already fails. Do not use for first-time setup, pre-failure real-device provisioning, or Espresso, Chromium, Gecko, Safari, or Mac2 failures.
metadata:
  renma.id: skill.appium-troubleshooting
  renma.published-entrypoint: "true"
  renma.continues-with: '["skill.setup-uiautomator2","skill.setup-xcuitest"]'
  renma.title: Appium Troubleshooting Workflow
  renma.owner: appium
  renma.tags: '["troubleshooting","uiautomator2","xcuitest"]'
  renma.optional-context: '["contexts/tools/appium/troubleshooting/examples/locator-failure.md","contexts/tools/appium/troubleshooting/examples/session-startup.md","contexts/tools/appium/troubleshooting/profiles/uiautomator2.md","contexts/tools/appium/troubleshooting/profiles/xcuitest.md","contexts/tools/appium/capabilities.md","contexts/tools/appium/troubleshooting/references/community-search.md","contexts/tools/appium/troubleshooting/references/uiautomator2-locators.md","contexts/tools/appium/troubleshooting/references/uiautomator2-session-startup.md","contexts/tools/appium/troubleshooting/references/xcuitest-element-lookup.md","contexts/tools/appium/troubleshooting/references/xcuitest-locators.md","contexts/tools/appium/troubleshooting/references/xcuitest-troubleshooting.md"]'
  renma.security-profile: appium-local-workflows
---

# Appium Troubleshooting Workflow

## Troubleshooting routing and handoffs

Lock each run to UiAutomator2 or XCUITest. If the driver is unknown, capture
capabilities or the Appium log line that identifies it before proceeding. For
another driver, stop and report that this repository has no implemented
troubleshooting route for it.

When evidence identifies a prerequisite, installation, or doctor failure,
finish the current troubleshooting handoff and continue with the exact setup
Skill:

- UiAutomator2: `skills/setup-uiautomator2/SKILL.md`
- XCUITest: `skills/setup-xcuitest/SKILL.md`

For real-device signing, provisioning, or WDA deployment, the XCUITest setup
Skill owns the only continuation to
`skills/xcuitest-real-device-config/SKILL.md`.

## Required inputs

Confirm the exact failing command and error, driver, target platform, global
`appium` or explicitly requested local `npx appium` mode, host OS, device or
simulator state, relevant capabilities, recent server or device logs, smallest
reproduction, and permissions for rerunning checks.

## Decision logic

- UiAutomator2 session startup, wrong activity, early drop, `socket hang up`,
  helper-server, or adb transport symptoms use the declared UiAutomator2
  session-startup reference.
- UiAutomator2 native or hybrid locator symptoms use the declared
  UiAutomator2 locator reference.
- XCUITest WDA startup, install, reachability, app launch, or device/simulator
  state symptoms use the declared XCUITest troubleshooting reference.
- XCUITest element lookup or locator symptoms use the declared XCUITest
  element-lookup and locator references together.
- Load the shared capabilities Context only when capability values are part of
  the suspected cause.
- Use the community-search Context only after the matching official reference
  does not explain the exact symptom.

## Workflow outline

1. Resolve command mode once. Use global `appium` by default; for explicitly
   selected local mode, run from the project root and replace Appium commands
   with `npx --no-install appium`.
2. Capture the exact error, platform, driver, relevant capabilities, and
   smallest reproduction before changing anything.
3. Record supplied Appium and driver versions. Run version, installed-list,
   connectivity, or doctor checks only when required evidence is missing or
   the symptom warrants them.
4. Load the matching driver profile and only the selected symptom references.
   Load a matching example only when it clarifies the reproduction.
5. If a prerequisite or doctor check fails, continue with the exact
   driver-specific setup Skill before deeper troubleshooting.
6. For a fix request, apply one targeted reversible change and rerun the
   smallest failing command, session start, WDA check, or locator lookup. For a
   diagnosis-only request, stop after evidence-backed cause isolation and
   present the targeted change as the next action.
7. Use official Appium and driver documentation first and community guidance
   only as a validated fallback.

## Troubleshooting safety and approval constraints

- Start with targeted evidence and the smallest reversible change.
- Request approval before a broad reset, reinstall, device erase, signing
  change, trust change, or unrelated capability change.
- Preserve global command mode unless local mode was explicitly requested.
- Keep global and local command modes separate. If local Appium is missing,
  report that blocker instead of allowing `npx` to download a package.
- Apply setup or real-device approval gates before crossing into installation,
  privileged, signing, trust, or provisioning changes.
- Require a reproduced symptom or passing re-check for success. When evidence
  remains incomplete, report a hypothesis and the next discriminating check.

## Completion criteria

Complete a fix request when the failing check passes after a verified fix, or
when an exact manual blocker is isolated with command evidence and a concrete
next action. Complete a diagnosis-only request when matching evidence isolates
the cause and the smallest proposed fix or discriminating next check is
reported without changing state.

## Evidence boundary

Report the selected driver and symptom route, commands and results, any change,
the smallest re-check, and any driver-specific setup continuation. Treat
optional doctor warnings as non-blocking and report a setup or real-device
continuation as a handoff that still requires workflow selection.

## Self-Improvement Prompt

Before the final response, report any missing, ambiguous, outdated, or
retry-causing troubleshooting instruction with its asset path and proposed
wording. Leave unrelated assets unchanged.

## Evidence

Example input: `Diagnose why my UiAutomator2 session fails during startup with
this server log and desired capabilities.` Verify the suspected failure class
against logs, capabilities, device state, and driver-specific checks before
recommending a fix.

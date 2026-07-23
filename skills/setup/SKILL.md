---
name: setup
description: Route and coordinate one or more Appium driver setup requests by handing UiAutomator2, Espresso, Chromium, Gecko, Mac2, Safari, or XCUITest to its dedicated setup Skill and collecting multi-driver completion. Use for Appium setup requests with no driver, one named driver, or multiple named drivers. Do not perform driver-specific setup in this Skill; select the exact child Skill and hand off. Do not use for an existing failing session or command; use appium-troubleshooting instead.
metadata:
  renma.id: skill.setup
  renma.published-entrypoint: "true"
  renma.continues-with: '["skill.setup-uiautomator2","skill.setup-espresso","skill.setup-chromium","skill.setup-gecko","skill.setup-mac2","skill.setup-safari","skill.setup-xcuitest"]'
  renma.title: Appium Setup Selection Workflow
  renma.owner: appium
  renma.security-profile: appium-local-workflows
---

# Appium Setup Selection Workflow

## Setup routing and selection

Select only the driver or drivers requested by the user. Treat each
`renma.continues-with` item as a possible child Skill, not as execution order,
priority, or automatic invocation.

| Intended target | Child Skill |
| --- | --- |
| Android native or hybrid apps with UiAutomator2 | `skills/setup-uiautomator2/SKILL.md` |
| Android native or hybrid apps with Espresso | `skills/setup-espresso/SKILL.md` |
| Chrome, Chromium, or Edge desktop browsers | `skills/setup-chromium/SKILL.md` |
| Firefox desktop browsers | `skills/setup-gecko/SKILL.md` |
| Native macOS apps | `skills/setup-mac2/SKILL.md` |
| Safari on macOS | `skills/setup-safari/SKILL.md` |
| iOS or tvOS with XCUITest | `skills/setup-xcuitest/SKILL.md` |

Normalize common names such as `uia2` to UiAutomator2. If no driver is named,
pause before environment changes and ask which driver or drivers are needed.
If one or more drivers are named, preserve every explicit selection and hand
off without asking the user to choose again.

## Required inputs

Resolve the selected drivers, global `appium` mode or explicitly requested
local `npx appium` mode, target platforms, host OS, available devices,
simulators, or browsers, permissions, and explicitly requested optional
dependencies.

## Workflow outline

1. Resolve the driver selection before changing the environment.
2. Hand each selected driver to its exact child Skill.
3. For multiple drivers, preserve the user's stated order. When the request
   states no order, choose and report an order that reuses shared host
   prerequisites, then execute the selected Skills one at a time. Metadata
   declaration order has no execution meaning.
4. Collect each child Skill's required doctor, helper, smoke, and evidence
   result without weakening its completion gate.

## Setup selection safety and approval constraints

- Use global npm/Appium commands by default and local `npx --no-install appium`
  only when explicitly requested.
- Install only explicitly selected drivers.
- Ask before optional FFmpeg or bundletool setup, third-party real-device
  tooling, privileged commands, browser installation, or authorization
  changes.
- Preserve working installations and prefer the smallest required change.

## Completion criteria

Complete a single-driver request only after the selected child Skill reaches
its completion criteria. Complete a multi-driver request only after every
selected child Skill reaches its own completion criteria or reports an exact
manual blocker. Optional warnings remain non-blocking.

## Evidence boundary

Report the selected child Skills, command mode, each child Skill's pass/fail
result, remaining optional items, and exact blockers. Attribute selection and
execution exclusively to decisions made by the workflow body.

## Self-Improvement Prompt

Before the final response, identify any missing, ambiguous, outdated, or
retry-causing instruction in this selection workflow or a loaded child Skill.
Report the asset path and proposed wording. Leave unrelated files unchanged.

## Evidence

- Input: `Set up Appium.` Ask which driver or drivers are needed.
- Input: `Set up UiAutomator2.` Continue with
  `skills/setup-uiautomator2/SKILL.md`.
- Input: `Set up UiAutomator2 and XCUITest.` Continue with both selected child
  Skills and verify each independently.

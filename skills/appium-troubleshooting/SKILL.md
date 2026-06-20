---
name: "appium-troubleshooting"
description: "Route diagnosis for failing Appium commands, sessions, WebDriverAgent launches, browser driver startup, device connection, and element lookup to the matching driver profile and symptom reference after setup has been attempted."
requires_context: contexts/tools/appium/troubleshooting/triage.md, contexts/tools/appium/troubleshooting/procedure-part1.md
---

# Appium Failure Router

## Use When

Use this skill when an Appium command, session start, WebDriverAgent launch, browser driver startup, device connection, or element lookup is already failing and the user needs diagnosis.

## Out Of Scope

For first-time environment setup, use `skills/setup/SKILL.md`. For driver or platform comparisons, proceed only when the user asks for analysis.

## Intake

Load `contexts/tools/appium/troubleshooting/triage.md`. Capture the exact failing command, error text, platform, automation driver, desired capabilities, Appium version, installed driver list, and the smallest reproduction available before changing anything.

## Reference Map

Load these procedure references first, in order:
1. `contexts/tools/appium/troubleshooting/procedure-part1.md`
2. `references/troubleshooting-procedure-part2.md`

Compatibility-only deprecated shims:
- `troubleshooting-procedure-part1`

Then load only the symptom-specific references needed:

- UiAutomator2 startup failures: `references/uiautomator2-session-startup.md`
- UiAutomator2 locator failures: `references/uiautomator2-locators.md`
- XCUITest startup, WDA, and signing failures: `references/xcuitest-troubleshooting.md`
- XCUITest element lookup failures: `references/xcuitest-element-lookup.md`
- XCUITest locator strategy questions: `references/xcuitest-locators.md`
- Community search fallback: `references/community-search.md`

Use community search only after the official references do not explain the exact stack trace or symptom.

## Profile Map

Load only the matching driver profile:

- UiAutomator2: `profiles/uiautomator2.md`
- XCUITest: `profiles/xcuitest.md`
- Chromium: `profiles/chromium.md`

## Samples

- Session startup failure: `examples/session-startup.md`
- Locator or element lookup failure: `examples/locator-failure.md`

## Completion

After each fix, rerun the smallest failing command or doctor check. Report the command evidence, the change made, and the confirmed outcome.

After completing diagnosis, apply the loaded procedure's self-improvement prompt.

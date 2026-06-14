---
name: "appium-troubleshooting"
description: "Route Appium failure diagnosis to a driver-scoped troubleshooting workflow for UiAutomator2, Espresso, XCUITest, or Chromium after setup has already been attempted or completed."
---

# appium-troubleshooting

## Use When

Use this skill when an Appium command, session start, WebDriverAgent launch, browser driver startup, device connection, or element lookup is already failing and the user needs diagnosis.

## Do Not Use For

Do not use this skill for first-time environment setup; use `skills/setup/SKILL.md`. Do not compare drivers or platforms unless the user explicitly asks for cross-driver analysis.

## Preflight

Capture the exact failing command, error text, platform, automation driver, desired capabilities, Appium version, installed driver list, and the smallest reproduction available before changing anything.

## Reference Map

Load `references/troubleshooting-procedure.md` first. Then load only the symptom-specific references needed:

- UiAutomator2 startup failures: `references/uiautomator2-session-startup.md`
- UiAutomator2 locator failures: `references/uiautomator2-locators.md`
- XCUITest startup, WDA, and signing failures: `references/xcuitest-troubleshooting.md`
- XCUITest element lookup failures: `references/xcuitest-element-lookup.md`
- XCUITest locator strategy questions: `references/xcuitest-locators.md`
- Community search fallback: `references/community-search.md`

Use community search only after the official references do not explain the exact stack trace or symptom.

## Examples

- "UiAutomator2 session creation fails with adb error" -> load the procedure and UiAutomator2 startup reference.
- "XCUITest WDA starts then returns ECONNREFUSED" -> load the procedure and keep the scope on XCUITest evidence.

## Verification

After each fix, rerun the smallest failing command or doctor check. Report the command evidence, the change made, and the confirmed outcome.

After completing troubleshooting, apply the loaded procedure's `Self-Improvement Prompt` section.

---
name: "appium-troubleshooting"
description: "Use this skill to diagnose an existing Appium failure after a session, driver, device, WebDriverAgent, browser, or locator error is available, while keeping fixes scoped to the selected driver."
---
# appium-troubleshooting

## Goal
Diagnose one Appium failure, choose the smallest likely fix, and verify the failing path again.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Reference Routing
Load `full-guidance-part-01.md` for the complete troubleshooting workflow. Load `uiautomator2-session-startup.md` for UiAutomator2 session creation failures, `uiautomator2-locators.md` for UiAutomator2 element lookup issues, `xcuitest-troubleshooting.md` for XCUITest driver or WDA failures, `xcuitest-locators.md` for XCUITest locator strategy issues, `xcuitest-element-lookup.md` for XCUITest element lookup failures, and `community-search.md` only when bundled references do not explain the exact stack trace.

## Do Not Use For
- Do not use for first-time environment setup with no failure evidence.
- Do not use for cross-driver comparison unless the user asks for it.

## Preflight
Capture the failing command, exact error text, platform, automation driver, capabilities, and relevant Appium server log window.

## Instructions
1. Identify the active driver first; if unknown, ask for capabilities or server logs before changing anything.
2. Use existing references for the matching driver or symptom, including `references/full-guidance.md` and driver-specific files.
3. If a prerequisite or doctor check fails, switch to the matching environment setup skill and return here after it passes.

## Verification
Re-run the smallest failing command or doctor check and report the command evidence.

## Examples
- A UiAutomator2 session fails with socket hang up; collect logs, read the UiAutomator2 startup reference, apply one fix, and retry that session.

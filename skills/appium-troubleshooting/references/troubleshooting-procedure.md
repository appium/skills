---
name: "appium-troubleshooting"
description: "Driver-scoped Appium troubleshooting procedure"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# appium-troubleshooting

## Goal
Diagnose the smallest driver-scoped cause of an Appium failure and verify the fix with command evidence.

## Procedure
1. Capture the exact failing command, error text, platform, automation driver, relevant capabilities, Appium version, and installed driver list before changing anything.
2. If the driver is unclear, ask for either the capabilities block or server log lines from `POST /session` through the first real `createSession` error.
3. Use the error text first. If it maps to a known driver symptom, open only the matching driver profile or reference before collecting broad diagnostics.
4. Run baseline checks only when needed:
   - `appium -v`
   - `appium driver list --installed --json`
   - Android: `adb devices -l`
   - XCUITest: `xcodebuild -version`
   - Chromium: browser version, selected executable, and chromedriver or msedgedriver version
5. Run the selected driver doctor when the error suggests prerequisites, connectivity, signing, build, browser-driver matching, or startup readiness:
   - `appium driver doctor uiautomator2 --json`
   - `appium driver doctor espresso --json`
   - `appium driver doctor xcuitest --json`
   - `appium driver doctor chromium --json`
   Fall back to text output if JSON is unsupported.
6. If required doctor fixes are present, switch to the matching setup skill before deeper troubleshooting. Optional warnings are non-blocking.
7. Use official driver docs before community search. Use `references/community-search.md` only when official references do not explain the exact stack trace or symptom.
8. Apply one fix at a time, then re-run the smallest failing reproduction or diagnostic.
9. Report the checks run, the change made, and the verification result.

## Constraints
- Use global `appium` by default; use `npx appium` only when the user requested local mode.
- Treat `0 required fixes needed` as the doctor pass gate.
- Do not compare unrelated drivers unless the failure is cross-driver.
- Do not install optional dependencies unless explicitly requested.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.

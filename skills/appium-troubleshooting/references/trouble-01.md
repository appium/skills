---
name: "trouble-01"
description: "Preserved troubleshooting-procedure procedure part 01 of 05"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# troubleshooting-procedure Part 01

<!-- preserved-source: 64dcf79:skills/appium-troubleshooting/references/troubleshooting-procedure.md; strip this generated header when comparing -->

---
name: "appium-troubleshooting"
description: "Diagnose common Appium failures with a driver-scoped flow for UiAutomator2, Espresso, XCUITest, or Chromium, covering startup, driver readiness, WebDriverAgent, browser driver, and element lookup issues"
metadata:
  last_modified: "Thu, 19 Mar 2026 12:00:00 GMT"

---
# appium-troubleshooting

## Goal
Triage one Appium driver failure, apply the smallest plausible fix, and re-check until confirmed or handed back.

## Decision Logic
- Identify the active automation driver first (`uiautomator2` or `xcuitest`). If unknown, stop and ask for the failing session capabilities/log line that names the driver.
- If the failure is an environment or driver-install problem (`node`, `npm`, `appium`, Java, Android SDK, `Xcode`, doctor failures): run the matching setup skill for the selected driver first.
- UiAutomator2 path only:
  - session startup, wrong activity, early drop, or `socket hang up`: read [references/uiautomator2-session-startup.md](references/uiautomator2-session-startup.md).
  - locator issues: read [references/uiautomator2-locators.md](references/uiautomator2-locators.md).
- XCUITest path only:
  - WebDriverAgent startup/install/reachability, app install/launch, device/simulator state: read [references/xcuitest-troubleshooting.md](references/xcuitest-troubleshooting.md).
  - element lookup or locator issues: read [references/xcuitest-element-lookup.md](references/xcuitest-element-lookup.md) and [references/xcuitest-locators.md](references/xcuitest-locators.md).
- If the official docs do not explain the exact stack trace or symptom, use [references/community-search.md](references/community-search.md) as a fallback workflow.

## Instructions
1. **Capture the failing command and lock the driver scope**
   Record the exact error text, platform, automation driver, and relevant capabilities before changing anything. If the driver is still unclear, ask for one of these before continuing:

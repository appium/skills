---
name: "trouble-03"
description: "Preserved troubleshooting-procedure procedure part 03 of 05"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# troubleshooting-procedure Part 03

<!-- preserved-source: 64dcf79:skills/appium-troubleshooting/references/troubleshooting-procedure.md; strip this generated header when comparing -->

   - Chromium: browser version, selected browser executable, chromedriver/msedgedriver version, and `appium driver doctor chromium --json || appium driver doctor chromium` when supported — only if the error suggests browser startup, driver matching, or prerequisite problems.
   If any doctor or prerequisite check fails, switch to the matching setup skill before deeper troubleshooting. Use `references/community-search.md` only after the relevant official reference does not explain the exact stack trace or symptom.

3. **Open only the references that match the selected driver and symptom**
   Do not load both driver branches in one run. Start with the most direct reference for the observed symptom and only expand if that file does not explain the behavior.

4. **Apply one targeted change, then re-run the smallest failing check**
   Prefer narrow fixes such as capability corrections, driver cleanup, device reset, or locator updates before broader environment churn. Re-run the doctor command for prerequisite issues, the failing session launch for startup issues, or the failing locator lookup for element issues.

5. **Use official docs first, community second**
   Official references for this skill:
   - `https://appium.io/docs/en/latest/`
   - `https://github.com/appium/appium-uiautomator2-driver`
   - `https://github.com/appium/appium-espresso-driver`
   - `https://appium.github.io/appium-xcuitest-driver/latest/`
   - `https://github.com/appium/appium-xcuitest-driver`
   - `https://github.com/appium/appium-chromium-driver`
   Use `discuss.appium.io` only after the official references are exhausted, searching with exact error text plus driver name and platform version.

6. **Report the outcome with command evidence**

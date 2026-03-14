---
name: "appium-troubleshooting"
description: "Diagnose common Appium UiAutomator2 and XCUITest failures, including session startup, driver readiness, WebDriverAgent issues, and element lookup or locator problems"
metadata:
  last_modified: "Sat, 14 Mar 2026 17:21:12 GMT"

---
# appium-troubleshooting

## Goal
Help the agent narrow Appium failures into a small set of common buckets, apply the smallest plausible fix, and re-run the failing check until the root cause is confirmed or clearly handed back to the user.

## Decision Logic
- If the failure is really an environment or driver-install problem (`node`, `npm`, `appium`, Java, Android SDK, Xcode, doctor failures): run the relevant setup skill first.
- If Android fails before the app settles, the wrong activity is detected, the session drops early, or `socket hang up` appears: read [references/uiautomator2-session-startup.md](references/uiautomator2-session-startup.md).
- If Android locators are slow, flaky, or incorrect: read [references/uiautomator2-locators.md](references/uiautomator2-locators.md).
- If iOS fails around WebDriverAgent startup, app install, system alerts, device communication, or simulator state: read [references/xcuitest-troubleshooting.md](references/xcuitest-troubleshooting.md).
- If iOS elements cannot be found, the tree looks incomplete, or lookup performance is poor: read [references/xcuitest-element-lookup.md](references/xcuitest-element-lookup.md) and [references/xcuitest-locators.md](references/xcuitest-locators.md).
- If the official docs do not explain the exact stack trace or symptom, use [references/community-search.md](references/community-search.md) as a fallback search workflow.

## Instructions
1. **Capture the exact failing surface first**
   Record the failing command, the exact error text, the platform, the automation driver, and the capabilities in play.
   Minimum commands:
   ```bash
   appium -v
   appium driver list --installed
   ```
   Android:
   ```bash
   adb devices -l
   appium driver doctor uiautomator2
   ```
   iOS:
   ```bash
   xcodebuild -version
   appium driver doctor xcuitest
   ```

2. **Classify the failure before changing anything**
   Choose one primary bucket:
   - prerequisite or doctor failure
   - session startup or app launch failure
   - device or simulator connectivity/state issue
   - element lookup or locator issue
   - unknown, but reproducible from logs

3. **Open only the relevant reference file**
   Do not load every reference file by default. Start with the bucket that best matches the symptom, then expand only if the first path does not explain the behavior.

4. **Apply one targeted fix at a time**
   Prefer capability corrections, driver cleanup, device reset, or locator changes before broader environment churn.
   After each fix, re-run the smallest failing check first:
   - doctor command for prerequisite issues
   - the single failing session launch for startup issues
   - the single failing locator or inspector lookup for element issues

5. **Use official docs first, community second**
   The references in this skill summarize the official UiAutomator2 and XCUITest docs collected for `https://github.com/appium/skills/issues/9`.
   Use `discuss.appium.io` only after the official references are exhausted, and search by exact error text plus driver name and platform version.

6. **Keep the result evidence-based**
   End with:
   - the confirmed or most likely root cause
   - the change that was made
   - the command or reproduction that now passes, or the exact blocker that still needs user action

## Completion Criteria
Mark troubleshooting complete only when one of these is true:
- the failing check passes after a verified fix, or
- the exact blocker is isolated to something the user must do manually (for example signing, device trust, app build defects), with the relevant command output and next action captured

## Constraints
- Run commands one step at a time and re-run checks after each fix.
- Treat Appium doctor required fixes as blocking.
- Use global `appium` command mode by default unless the user explicitly asks for local `npx appium`.
- Prefer the official Appium driver docs referenced by this skill before using community answers.
- Do not claim success from a theory alone; always tie the conclusion to a reproduced symptom or a passing re-check.

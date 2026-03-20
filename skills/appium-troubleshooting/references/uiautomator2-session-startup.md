# UiAutomator2 Session Startup

## Official References
- `https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/activity-startup.md`
- `https://github.com/appium/appium-uiautomator2-driver?tab=readme-ov-file#troubleshooting`

## When To Read This
- `Activity never started`
- app launches the wrong screen or splash flow
- `appWaitActivity` or `appWaitPackage` mismatches
- `socket hang up`
- the UiAutomator2 server appears to die during startup

This file is a shortcut into the official driver docs, not a replacement for them.

## Local Triage
1. Verify the package and foreground activity from the device state, not from the manifest guess.
2. Align `appium:appPackage`, `appium:appActivity`, `appium:appWaitPackage`, and `appium:appWaitActivity` with the observed startup flow.
3. If the app legitimately passes through multiple transient activities, list those wait activities explicitly before increasing `appium:appWaitDuration`.
4. If logs show `socket hang up`, instrumentation failure, or helper-package errors, treat it as a UiAutomator2 helper or `adb` transport problem first.
5. If logs show install, ABI, permission, or signing failures, stop tuning startup capabilities and fix that underlying failure first.

## Log Clues To Separate Common Causes
- Activity mismatch is more likely if `adb shell dumpsys activity activities` shows a different foreground activity than the one implied by `appium:appActivity` or `appium:appWaitActivity`, or if Appium reports `Activity never started`.
- A UiAutomator2 server crash is more likely if `adb logcat -d` shows instrumentation failure, `io.appium.uiautomator2.server` package errors, or the Appium log says it cannot connect to the UiAutomator2 REST server.
- An `adb` transport drop is more likely if the device disappears from `adb devices -l`, the Appium log shows proxy/connectivity resets, or multiple commands fail immediately after `adb` communication errors.

## Minimal Checks
```bash
adb shell dumpsys window windows
adb shell dumpsys activity activities
adb shell pm list packages
adb logcat -d
grep -i "socket hang up\|uiautomator2\|instrumentation\|adb\|cannot connect" <appium-server-log-file>
```

## First Pass Order
1. Capture `dumpsys activity`, `adb logcat -d`, and the matching Appium server log lines from the failing session.
2. Decide whether the first failure signal is activity mismatch, UiAutomator2 server crash, or `adb` transport loss.
3. Apply only the fix for that first signal.
4. Re-run one fresh session start before changing anything else.

## One Clean Retry
If startup still dies early after the first log review, do one clean retry:

```bash
adb kill-server
adb start-server
adb uninstall io.appium.uiautomator2.server
adb uninstall io.appium.uiautomator2.server.test
```

Then re-run the same single session launch and compare fresh logs before changing anything else.

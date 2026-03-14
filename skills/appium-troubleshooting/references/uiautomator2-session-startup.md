# UiAutomator2 Session Startup

## Sources
- `https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/activity-startup.md`
- `https://github.com/appium/appium-uiautomator2-driver?tab=readme-ov-file#troubleshooting`

## When To Read This
- `Activity never started`
- app launches the wrong screen or splash flow
- `appWaitActivity` or `appWaitPackage` mismatches
- `socket hang up`
- the UiAutomator2 server appears to die during startup

## Common Patterns
- The default launch heuristics picked the wrong Android activity.
  Fix by setting `appium:appPackage`, `appium:appActivity`, `appium:appWaitPackage`, and `appium:appWaitActivity` to the app's actual startup flow.
- The app passes through several transient activities before it becomes stable.
  Use a comma-separated `appWaitActivity` list or a wildcard when the startup path legitimately varies.
- The app needs longer to settle before Appium should continue.
  Increase `appium:appWaitDuration` rather than masking the problem with arbitrary test sleeps.
- The device or helper server is in a bad state.
  `socket hang up` usually means the UiAutomator2 server or its transport died. Clear stale sessions, restart `adb`, and reinstall the helper packages if needed.
- The failure is not really about activities.
  If install, signing, ABI, permission, or instrumentation errors appear in logs, fix that underlying issue first and then retry startup.

## Useful Checks
```bash
adb shell dumpsys window windows
adb shell dumpsys activity activities
adb shell pm list packages
adb logcat -d
```

## Practical Fix Order
1. Confirm the package and activity the app actually reaches on the device.
2. Align `appPackage`, `appActivity`, `appWaitPackage`, and `appWaitActivity` with that flow.
3. If the session still dies early, restart the transport:
   ```bash
   adb kill-server
   adb start-server
   ```
4. If the helper server looks stale, remove the Appium helper packages and retry:
   ```bash
   adb uninstall io.appium.uiautomator2.server
   adb uninstall io.appium.uiautomator2.server.test
   ```
5. Re-run the same single session launch and inspect fresh logs before changing anything else.

## Notes
- Prefer collecting the focused activity from `dumpsys` over guessing from the app manifest alone.
- If the app's first-launch flow genuinely differs from later launches, capture both paths in the troubleshooting notes.

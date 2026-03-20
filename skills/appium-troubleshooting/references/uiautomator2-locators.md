# UiAutomator2 Locators

## Official Reference
- `https://github.com/appium/appium-uiautomator2-driver?tab=readme-ov-file#element-location`

Use the driver docs for the full strategy list and performance tradeoffs. Keep this page for the extra triage that is easy to miss during debugging.

## Local Guidance
- Inspect the current page source before changing the selector. Verify whether the target is exposed as `content-desc`, resource id, text, or only as a visual label.
- If the app is hybrid, confirm the current context before debugging native locators.
- `-android uiautomator` is useful when ids or accessibility metadata are missing, but keep the query narrow and readable enough to debug from logs.
- Treat a working `xpath` as proof that the node exists, not as the preferred final fix. Replace it with a stronger native locator when the source exposes one.
- If the node is not present in source at all, this is usually an app-state, accessibility, or context problem rather than locator syntax.

## Hybrid App Checks
- If the element is inside a WebView, confirm the failing lookup is happening in a `WEBVIEW_*` context rather than `NATIVE_APP`.
- If the failure started after a Chrome or Android System WebView update, confirm the WebView/browser version before changing Chromedriver settings.
- Use the UiAutomator2 driver's Chromedriver compatibility guidance before community fallback. Prefer `appium:chromedriverExecutable`, `appium:chromedriverExecutableDir`, or automatic Chromedriver discovery over ad hoc workarounds.
- If the node exists only in the WebView DOM and not in native page source, switch context first and re-run the same single lookup before changing selectors.

## Hybrid App Checks With Commands
```bash
adb shell dumpsys package com.android.chrome | grep versionName
adb shell dumpsys package com.google.android.webview | grep versionName
adb shell dumpsys package com.android.webview | grep versionName
```
- Capture the current context list from the failing client run and confirm the target lookup is using the expected `WEBVIEW_*` context.
- Capture one source snapshot from `NATIVE_APP` and one from the target `WEBVIEW_*` context on the same screen. If the element appears only in the WebView DOM, switch context before changing selectors.
- If Chromedriver is the likely mismatch, prefer updating `appium:chromedriverExecutable`, `appium:chromedriverExecutableDir`, or the Chromedriver mapping instead of rewriting the locator first.

## Validation
- Re-run the smallest failing lookup.
- Compare the returned attributes against the actual source dump.
- If an `xpath` fix works but a stronger native locator is available, prefer the native locator before closing the issue.

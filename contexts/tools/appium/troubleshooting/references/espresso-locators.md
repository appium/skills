---
security_profile: appium-local-workflows
owner: appium
id: appium.troubleshooting.references.espresso-locators

---

# Espresso Locators

## Official References
- `https://appium.github.io/appium-espresso-driver/latest/reference/locator-strategies/`
- `https://appium.github.io/appium-espresso-driver/latest/reference/element-attributes/`
- `https://appium.github.io/appium-espresso-driver/latest/guides/datamatcher-selector/`
- `https://appium.github.io/appium-espresso-driver/latest/guides/compose/`
- `https://appium.github.io/appium-espresso-driver/latest/guides/hybrid/`

Use the driver docs for the full strategy list and matcher syntax. Keep this page for the extra triage that is easy to miss during debugging.

## Local Guidance
- For the same single failing lookup, capture the locator strategy and value, active `driver` setting (`espresso` or `compose`), current context and context list, page source, Appium server-log window, and app state before comparing selectors.
- Confirm whether the target screen uses standard Android `View` elements or Jetpack Compose semantics nodes (`ComposeNode`). In mixed `View` + Compose apps, verify the active subdriver setting (`driver: "espresso"` for Android Views, `driver: "compose"` for Compose nodes) before rewriting the selector.
- Inspect the current page source from the active subdriver. In the `espresso` subdriver, prefer `id`, `accessibility id`, `text`, `-android viewtag` (or `tag name`), `-android viewmatcher`, or `-android datamatcher` over brittle `xpath`.
- In the `compose` subdriver, `id` and `ViewMatchers` do not apply; prefer `-android viewtag` (`SemanticsProperties.TestTag`), `accessibility id` (`ContentDescription`), or `text` (`SemanticsProperties.Text`), and check whether unmerged semantics require enabling `includeUnmergedNode` or inspecting `view-tag`.
- When targeting off-screen items inside an `AdapterView` (`ListView`, `GridView`, etc.) under the `espresso` subdriver, prefer `-android datamatcher` (which uses Espresso `onData` and scrolls automatically) over `-android viewmatcher` or `xpath` (which only match views currently in the hierarchy).

## Subdriver And Hybrid Checks
```bash
adb shell dumpsys package com.android.chrome | grep versionName
adb shell dumpsys package com.google.android.webview | grep versionName
adb shell dumpsys package com.android.webview | grep versionName
```
- If a Compose screen returns only the outer `ComposeView` in page source, switch the `driver` setting to `compose` and capture page source again before changing the selector.
- If the element is inside a WebView, confirm whether the test is using `NATIVE_APP` (`mobile: webAtoms`) or a `WEBVIEW_*` context, and verify Chromedriver compatibility with the device WebView version when using `WEBVIEW_*`.

## Validation
- Re-run the smallest failing lookup in the confirmed subdriver or context.
- Compare the returned element attributes against the actual source dump from that subdriver.
- If an `xpath` lookup works as a diagnostic check, replace it with a stronger native Espresso, DataMatcher, or Compose tag/text/accessibility locator when the source exposes one.

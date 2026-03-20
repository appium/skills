# Community Search Fallback

## Source
- `https://discuss.appium.io/`

## Official-First Rule
Use community search only after checking the matching official Appium reference first:

- UiAutomator2 startup: `https://github.com/appium/appium-uiautomator2-driver/blob/master/docs/activity-startup.md`
- UiAutomator2 locators: `https://github.com/appium/appium-uiautomator2-driver?tab=readme-ov-file#element-location`
- XCUITest element lookup: `https://appium.github.io/appium-xcuitest-driver/latest/guides/elements-lookup-troubleshooting/`
- XCUITest locators: `https://appium.github.io/appium-xcuitest-driver/latest/reference/locator-strategies/`
- XCUITest general failures: `https://appium.github.io/appium-xcuitest-driver/latest/guides/troubleshooting/`

## Search Pattern
- Search the exact error string in quotes.
- Add the driver name: `uiautomator2` or `xcuitest`.
- Add the platform version and whether the target is a real device or simulator/emulator.
- Add the capability name if the issue appears right after changing one capability.

Example queries:
- `"socket hang up" uiautomator2 Android 14 emulator`
- `"Activity never started" appWaitActivity uiautomator2`
- `"WebDriverAgent" xcuitest iOS 18 real device`
- `"No matches found for Identity Binding" xcuitest`

## Offline Triage Before Searching

Use one of these recurring cases to choose a search query and one local verification step. Keep the detailed remediation in the official references whenever possible.

| Case | Search Query Seed | Verify First |
|---|---|---|
| UiAutomator2 wrong startup screen or `Activity never started` | `"Activity never started" appWaitActivity uiautomator2` | confirm the focused activity via `adb shell dumpsys activity activities` |
| UiAutomator2 early session drop or `socket hang up` | `"socket hang up" uiautomator2 <android-version> <device-type>` | capture `adb logcat -d` and retry one clean session |
| UiAutomator2 WebView or Chromedriver mismatch | `"chromedriver" uiautomator2 webview` | confirm the WebView/browser version on the device before changing Chromedriver settings |
| XCUITest WDA build or signing failure | `"WebDriverAgent" "xcodebuild" failed xcuitest` | run `appium driver doctor xcuitest` and verify the signing setup |
| XCUITest WDA timeout or proxy failure | `"Could not proxy command to remote server" xcuitest` | capture fresh Appium logs and confirm WDA reachability |
| XCUITest source tree incomplete or element missing | `"elements not visible in source" xcuitest inspector` | collect a fresh source snapshot and verify accessibility exposure or active context |

## How To Filter Results
- Prefer threads that mention the same Appium major version and the same driver.
- Prefer posts that include logs or cite official Appium docs.
- Treat advice that suggests broad resets or unrelated capability changes as low confidence until you can verify it locally.

## Accept/Reject Rule For Forum Advice
- Accept only if the suggestion maps directly to your exact error text, same driver, and similar OS/device version.
- Reject or defer suggestions that require unrelated global resets before reproducing the same failure once.
- Always re-run the smallest failing check immediately after applying a proposed fix.

## Validation Rule
Never close the issue from a forum answer alone. Reproduce the proposed fix locally and tie it back to the original failing command or locator.

# UiAutomator2 Locators

## Sources
- `https://github.com/appium/appium-uiautomator2-driver?tab=readme-ov-file#element-location`

## Recommended Locator Order
1. `accessibility id`
2. `id`
3. `-android uiautomator`
4. `class name` only when scoped to a smaller parent
5. `xpath` as the last resort

## Guidance
- `accessibility id` is usually the most portable and most stable choice when the app exposes meaningful accessibility labels or content descriptions.
- `id` maps well to Android resource ids and is usually the best native fallback when accessibility metadata is missing.
- `-android uiautomator` is useful for precise native queries when ids are unavailable, but it should stay readable and narrow.
- `class name` is weak on its own because many nodes share the same class.
- `xpath` is the most brittle and usually the slowest option; avoid wide tree scans and absolute paths when possible.

## Troubleshooting A Bad Locator
- Inspect the current page source or Appium Inspector output before changing code.
- Verify whether the visible text is actually exposed as text, content description, or resource id.
- If a hybrid app is involved, confirm the current context before debugging native locators.
- If lookups are flaky, wait for the UI state that makes the target node exist instead of retrying the same weak selector.

## Validation
- Re-run the smallest failing lookup.
- Compare the returned attributes against the actual source dump.
- If an `xpath` fix works but a stronger native locator is available, prefer the native locator before closing the issue.

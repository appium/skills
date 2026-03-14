# XCUITest Locators

## Sources
- `https://appium.github.io/appium-xcuitest-driver/latest/reference/locator-strategies/`

## Recommended Locator Order
1. `accessibility id`
2. `id` or `name` only when the source proves they are stable in this app
3. `-ios predicate string`
4. `-ios class chain`
5. `xpath` as the last resort

## Guidance
- `accessibility id` is usually the strongest default for native iOS UI because it aligns with accessibility metadata and avoids tree-wide scans.
- `id` and `name` may overlap in iOS source output, but do not assume that without checking the actual attributes exposed by the app.
- `-ios predicate string` is usually the best expressive native fallback when you need attribute filtering.
- `-ios class chain` is efficient for scoped hierarchy queries when you already know the container path.
- `xpath` is usually slower and more fragile than native strategies, especially on large hierarchies.

## Troubleshooting A Bad Locator
- Verify the target attributes in the current source dump before changing the selector.
- If the element exists but performance is poor, move from `xpath` to a native locator whenever possible.
- If the element does not exist in source, switch to the element-lookup troubleshooting workflow rather than iterating locator syntax.

## Validation
- Re-run the exact failing lookup against the same screen.
- Prefer the simplest native selector that still uniquely identifies the element.

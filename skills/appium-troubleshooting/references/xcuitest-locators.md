# XCUITest Locators

## Official Reference
- `https://appium.github.io/appium-xcuitest-driver/latest/reference/locator-strategies/`

Use the driver docs for the full strategy ordering and syntax. This page keeps only the local debugging notes that help choose among them.

## Local Guidance
- On XCUITest, `id`, `name`, and `accessibility id` are treated as synonyms over the element `name` attribute. Check the current source before assuming that attribute is stable in this app.
- Use `-ios predicate string` or `-ios class chain` when you need native filtering or hierarchy scoping; keep the query tied to attributes that are visible in source.
- Treat `xpath` as a fallback for cases where the source does not expose a simpler native path. If `xpath` is the first thing that works, use it to learn the tree and then replace it if a native selector is available.
- If the element is absent from source, stop iterating locator syntax and switch to the element-lookup troubleshooting flow.

## Validation
- Re-run the exact failing lookup against the same screen.
- Prefer the simplest native selector that still uniquely identifies the element.

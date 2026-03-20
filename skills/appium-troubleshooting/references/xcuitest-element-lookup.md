# XCUITest Element Lookup Troubleshooting

## Official Reference
- `https://appium.github.io/appium-xcuitest-driver/latest/guides/elements-lookup-troubleshooting/`

## When To Read This
- elements visible to a human are missing in Appium Inspector
- source dumps look incomplete
- an iOS locator works intermittently
- lookup is unexpectedly slow

Use the official guide for the full symptom matrix. This page keeps only the local checks that are easiest to miss.

## Local Triage
1. Collect source from the same environment as the failing test: same simulator or device, OS version, app build, orientation, and permission state.
2. Confirm the element exists in the current source dump before changing selector syntax.
3. Inspect the attributes the element actually exposes: `name`, `label`, `value`, type, visibility, and enabled state.
4. Verify the active application and window in WebDriverAgent. System alerts, share sheets, and other overlays may belong to a different active app.
5. Change snapshot-related settings only after confirming a deep or incomplete tree problem, then compare the same single lookup before and after.

## Notes
- A missing element in source is usually an accessibility, app-state, or active-application problem first, not a locator problem.
- If the app uses web content, confirm the current context before continuing native lookup debugging.

# XCUITest Element Lookup Troubleshooting

## Sources
- `https://appium.github.io/appium-xcuitest-driver/latest/guides/elements-lookup-troubleshooting/`

## When To Read This
- elements visible to a human are missing in Appium Inspector
- source dumps look incomplete
- an iOS locator works intermittently
- lookup is unexpectedly slow

## Common Patterns
- The app does not expose useful accessibility metadata.
  If the element is missing from the accessibility tree, Appium cannot reliably find it. Confirm with page source before rewriting selectors.
- The wrong app or window is active.
  Verify Appium is attached to the expected foreground app before assuming the locator is wrong.
- The snapshot is incomplete or too expensive.
  Deep or complex trees can produce incomplete or slow snapshots. Adjust snapshot-related settings only after confirming the tree depth is the real issue.
- The UI has not settled yet.
  Visibility and hittability can lag during transitions. Wait for the state that makes the element queryable instead of retrying a stale screen.
- A hybrid context mismatch is hiding the element.
  If the app uses web content, confirm the active context before continuing native element debugging.

## Debugging Order
1. Confirm the element exists in the current source dump.
2. Inspect which attributes the element actually exposes (`name`, `label`, `value`, type, visibility).
3. Verify the active app, window, and context.
4. Only then adjust snapshot depth or lookup-related settings.

## Notes
- A missing element in source is usually an accessibility or app-state problem first, not a selector syntax problem.
- When you change a lookup-related setting, re-run the same single query and compare the new source output rather than changing multiple knobs at once.

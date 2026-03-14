# Community Search Fallback

## Source
- `https://discuss.appium.io/`

## When To Use This
Use community search only after the official references in this skill do not explain the exact symptom.

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

## How To Filter Results
- Prefer threads that mention the same Appium major version and the same driver.
- Prefer posts that include logs or cite official Appium docs.
- Treat advice that suggests broad resets or unrelated capability changes as low confidence until you can verify it locally.

## Validation Rule
Never close the issue from a forum answer alone. Reproduce the proposed fix locally and tie it back to the original failing command or locator.

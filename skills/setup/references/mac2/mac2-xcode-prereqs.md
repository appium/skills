---
name: "mac2-xcode-prereqs"
description: "Validate Xcode and macOS command-line tooling for Appium Mac2 Driver"
---

# mac2-xcode-prereqs

## Read-Only Checks

```bash
xcodebuild -version
xcode-select -p
xcodebuild -license check
xcodebuild -checkFirstLaunchStatus
xcrun --find xcodebuild
```

`xcodebuild -license check` and `xcodebuild -checkFirstLaunchStatus` must pass before completion.

## Fix Boundaries

- If Xcode command-line tools are missing, ask before installing them.
- If the Xcode license or first-launch steps are incomplete, report the exact failing command and ask the user to complete the prompted action.
- Avoid `sudo` unless the user explicitly requests it.

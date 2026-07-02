---
owner: appium
id: platform.macos.xcode-prereqs
name: "macos-xcode-prereqs"
description: "Validate Xcode, command-line tools, license, first launch, and simulator inventory"
status: stable

---

# macOS Xcode Prerequisites

## Xcode Checks

```bash
sw_vers
xcode-select -p
xcodebuild -version
xcrun simctl list devices
```

If Xcode license or first-launch tasks block tooling, pause and provide the exact required Apple command for the user to approve or run. Do not skip these checks.

## Completion Evidence

Report active Xcode path, Xcode version, macOS version, and simulator inventory when simulator validation is requested.

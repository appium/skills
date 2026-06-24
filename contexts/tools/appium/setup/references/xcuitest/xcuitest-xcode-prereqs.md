---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/xcuitest/xcuitest-xcode-prereqs.md"
id: appium.setup.references.xcuitest.xcuitest-xcode-prereqs
name: "xcuitest-xcode-prereqs"
description: "Validate Xcode, command-line tools, license, first launch, and simulator inventory"
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/setup/references/xcuitest/xcuitest-xcode-prereqs.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/xcuitest/xcuitest-xcode-prereqs.md bounded command output, local paths, driver names, IDs, and logs

---

# xcuitest-xcode-prereqs

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

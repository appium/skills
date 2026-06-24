---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/mac2/mac2-xcode-prereqs.md"
id: appium.setup.references.mac2.mac2-xcode-prereqs
name: "mac2-xcode-prereqs"
description: "Validate Xcode and macOS command-line tooling for Appium Mac2 Driver"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/mac2/mac2-xcode-prereqs.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/mac2/mac2-xcode-prereqs.md bounded command output, local paths, driver names, IDs, and logs

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

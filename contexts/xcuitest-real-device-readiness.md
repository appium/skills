---
id: xcuitest-real-device-readiness
owner: skills/xcuitest-real-device-config
status: active
---

# XCUITest Real Device Readiness Context

Reusable readiness contract for real iOS or tvOS devices under Appium XCUITest.

Confirm the host is macOS and identify the signing and WDA deployment path before changing anything: free Apple ID, paid Apple Developer account, enterprise profile, prebuilt WDA, preinstalled WDA, or running WDA URL.

Completion requires the device to appear in `xcrun xctrace list devices`, a signing or provisioning path to apply without WDA install errors, code signatures to verify after any WDA bundle modification, and at least one WDA deployment method to work.

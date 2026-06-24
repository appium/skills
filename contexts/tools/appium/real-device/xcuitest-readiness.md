---
owner: appium
policy_scope: "contexts/tools/appium/real-device/xcuitest-readiness.md"
id: xcuitest-real-device-readiness
status: stable
optional_context: contexts/tools/appium/real-device/examples/real-device.md, contexts/tools/appium/real-device/profiles/enterprise-profile.md, contexts/tools/appium/real-device/profiles/free-apple-id.md, contexts/tools/appium/real-device/profiles/paid-developer.md, contexts/tools/appium/real-device/profiles/prebuilt-wda.md, contexts/tools/appium/real-device/profiles/preinstalled-wda.md, contexts/tools/appium/real-device/profiles/running-wda-url.md, contexts/tools/appium/real-device/references/real-device-procedure-part1.md, contexts/tools/appium/real-device/references/real-device-procedure-part2.md, contexts/tools/appium/real-device/references/real-device-procedure-part3.md, contexts/tools/appium/real-device/references/real-device-procedure-part4.md, contexts/tools/appium/real-device/references/real-device-procedure-part5.md, contexts/tools/appium/real-device/references/real-device-procedure-part6.md, contexts/tools/appium/real-device/references/real-device-procedure-part7.md, contexts/tools/appium/real-device/references/real-device-procedure-part8.md, contexts/tools/appium/real-device/references/real-device-procedure-part9.md
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/xcuitest-readiness.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/xcuitest-readiness.md bounded command output, local paths, driver names, IDs, and logs

---

# XCUITest Real Device Readiness Context

Reusable readiness contract for real iOS or tvOS devices under Appium XCUITest.

Confirm the host is macOS and identify the signing and WDA deployment path before changing anything: free Apple ID, paid Apple Developer account, enterprise profile, prebuilt WDA, preinstalled WDA, or running WDA URL.

Completion requires the device to appear in `xcrun xctrace list devices`, a signing or provisioning path to apply without WDA install errors, code signatures to verify after any WDA bundle modification, and at least one WDA deployment method to work.

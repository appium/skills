---
owner: appium
id: xcuitest-real-device-readiness
status: stable
optional_context:
  - contexts/tools/appium/real-device/references/support-inventory.md

---

# XCUITest Real Device Readiness Context

Reusable readiness contract for real iOS or tvOS devices under Appium XCUITest.

Confirm the host is macOS and identify the signing and WDA deployment path before changing anything: free Apple ID, paid Apple Developer account, enterprise profile, prebuilt WDA, preinstalled WDA, or running WDA URL.

Completion requires the device to appear in `xcrun xctrace list devices`, a signing or provisioning path to apply without WDA install errors, code signatures to verify after any WDA bundle modification, and at least one WDA deployment method to work.

## Recommended Route

1. Complete the iOS + XCUITest simulator setup path in `contexts/tools/appium/setup/routing.md` first.
2. Load `skills/xcuitest-real-device-config/SKILL.md`.
3. Load the matching profile from `contexts/tools/appium/real-device/profiles/`: free Apple ID, paid developer, enterprise, preinstalled WDA, prebuilt WDA, or running WDA URL.
4. Load `contexts/tools/appium/real-device/references/real-device-procedure-part1.md` through `real-device-procedure-part9.md` in order.
5. Use `contexts/tools/appium/real-device/examples/real-device.md` as the worked example when needed.

## Optional Context Inventory

Profiles:

- `contexts/tools/appium/real-device/profiles/enterprise-profile.md`
- `contexts/tools/appium/real-device/profiles/free-apple-id.md`
- `contexts/tools/appium/real-device/profiles/paid-developer.md`
- `contexts/tools/appium/real-device/profiles/prebuilt-wda.md`
- `contexts/tools/appium/real-device/profiles/preinstalled-wda.md`
- `contexts/tools/appium/real-device/profiles/running-wda-url.md`

Procedure parts:

- `contexts/tools/appium/real-device/references/real-device-procedure-part1.md`
- `contexts/tools/appium/real-device/references/real-device-procedure-part2.md`
- `contexts/tools/appium/real-device/references/real-device-procedure-part3.md`
- `contexts/tools/appium/real-device/references/real-device-procedure-part4.md`
- `contexts/tools/appium/real-device/references/real-device-procedure-part5.md`
- `contexts/tools/appium/real-device/references/real-device-procedure-part6.md`
- `contexts/tools/appium/real-device/references/real-device-procedure-part7.md`
- `contexts/tools/appium/real-device/references/real-device-procedure-part8.md`
- `contexts/tools/appium/real-device/references/real-device-procedure-part9.md`

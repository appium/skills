---
security_profile: appium-local-workflows
owner: appium
id: xcuitest-real-device-readiness
status: stable
optional_context:
  - contexts/tools/appium/setup/routing.md
  - contexts/tools/appium/capabilities.md
  - contexts/tools/appium/real-device/profiles/enterprise-profile.md
  - contexts/tools/appium/real-device/profiles/free-apple-id.md
  - contexts/tools/appium/real-device/profiles/paid-developer.md
  - contexts/tools/appium/real-device/profiles/prebuilt-wda.md
  - contexts/tools/appium/real-device/profiles/preinstalled-wda.md
  - contexts/tools/appium/real-device/profiles/running-wda-url.md
  - contexts/tools/appium/real-device/references/real-device-procedure.md
  - contexts/tools/appium/real-device/examples/real-device.md

---

# XCUITest Real Device Readiness Context

Reusable readiness contract for real iOS or tvOS devices under Appium XCUITest.

Confirm the host is macOS and identify the signing and WDA deployment path before changing anything: free Apple ID, paid Apple Developer account, enterprise profile, prebuilt WDA, preinstalled WDA, or running WDA URL.

Completion requires the device to appear in `xcrun xctrace list devices`, a signing or provisioning path to apply without WDA install errors, code signatures to verify after any WDA bundle modification, and at least one WDA deployment method to work.

## Recommended Route

1. Complete the iOS + XCUITest simulator setup path in `contexts/tools/appium/setup/routing.md` first.
2. Load `skills/xcuitest-real-device-config/SKILL.md`.
3. Load the matching profile from `contexts/tools/appium/real-device/profiles/`: free Apple ID, paid developer, enterprise, preinstalled WDA, prebuilt WDA, or running WDA URL.
4. Load `contexts/tools/appium/real-device/references/real-device-procedure.md`.
5. Use `contexts/tools/appium/real-device/examples/real-device.md` as the worked example when needed.

## Selective Profile Loading

Load exactly the signing and WDA deployment profiles that match the selected route:

- `contexts/tools/appium/real-device/profiles/enterprise-profile.md`
- `contexts/tools/appium/real-device/profiles/free-apple-id.md`
- `contexts/tools/appium/real-device/profiles/paid-developer.md`
- `contexts/tools/appium/real-device/profiles/prebuilt-wda.md`
- `contexts/tools/appium/real-device/profiles/preinstalled-wda.md`
- `contexts/tools/appium/real-device/profiles/running-wda-url.md`

Then load the shared procedure:

- `contexts/tools/appium/real-device/references/real-device-procedure.md`

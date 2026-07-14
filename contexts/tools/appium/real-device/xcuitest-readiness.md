---
security_profile: appium-real-device-workflows
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

Confirm the host is macOS and select the WDA runtime route before changing anything. Select a free Apple ID, paid Apple Developer, or enterprise signing profile only when the route will build, sign, or install WDA; a running-WDA URL route does not require local signing or provisioning evidence.

Completion requires the device to appear in `xcrun xctrace list devices` and the selected WDA route to work. Build or install routes additionally require their applicable signing, provisioning, installation, and post-modification code-signature checks. A running-WDA URL route instead requires a reachable endpoint and one successful Appium attachment; it skips local signing, provisioning, artifact, and installation gates.

## Recommended Route

1. Complete the iOS/tvOS + XCUITest setup path in `contexts/tools/appium/setup/routing.md` first.
2. Load `skills/xcuitest-real-device-config/SKILL.md`.
3. Load the runtime profile that matches the route. Load a signing profile only when local WDA build, signing, or installation work is in scope; for a running-WDA URL, load only that runtime profile.
4. Load `contexts/tools/appium/real-device/references/real-device-procedure.md`.
5. Use `contexts/tools/appium/real-device/examples/real-device.md` as the worked example when needed.

## Selective Profile Loading

Load exactly the signing and WDA runtime profiles that match the selected route. Do not load a signing profile for a running-WDA URL route:

- `contexts/tools/appium/real-device/profiles/enterprise-profile.md`
- `contexts/tools/appium/real-device/profiles/free-apple-id.md`
- `contexts/tools/appium/real-device/profiles/paid-developer.md`
- `contexts/tools/appium/real-device/profiles/prebuilt-wda.md`
- `contexts/tools/appium/real-device/profiles/preinstalled-wda.md`
- `contexts/tools/appium/real-device/profiles/running-wda-url.md`

Then load the shared procedure:

- `contexts/tools/appium/real-device/references/real-device-procedure.md`

---
security_profile: appium-real-device-workflows
owner: appium
id: appium.real-device.examples.real-device

---

# Example: Real iOS/tvOS Device Setup

Use this repository's skills to prepare macOS + XCUITest for a real iOS or tvOS device.

1. Load `skills/setup/SKILL.md`.
2. Load `contexts/platform/macos/profile.md`.
3. Load `contexts/tools/appium/setup/profiles/xcuitest.md`.
4. Load `contexts/tools/appium/setup-basics.md`.
5. Load `contexts/platform/ios/simulator-setup.md`.
6. Load `skills/xcuitest-real-device-config/SKILL.md`.
7. Select the WDA runtime route. Load a signing profile only for local build, signing, or installation; for a running-WDA URL, load only that runtime profile.
8. Load `contexts/tools/appium/real-device/references/real-device-procedure.md`.

Rules:

- Pause for physical-device actions such as Trust prompts or Developer Mode toggles.
- Ask before installing optional third-party device tools.
- When a WDA bundle is modified after signing, always re-sign with `codesign` before installing.

Completion criteria:

1. Device is visible in `xcrun xctrace list devices`.
2. For a build or install route, the applicable provisioning path succeeds without WDA signing errors.
3. If WDA was modified, `codesign --verify --verbose` confirms a valid signature.
4. The selected WDA route works. For a running-WDA URL, the endpoint is reachable and one Appium session attaches without requiring local signing, provisioning, or installation evidence.

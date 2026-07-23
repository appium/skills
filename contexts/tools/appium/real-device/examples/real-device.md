---
security_profile: appium-real-device-workflows
owner: appium
id: appium.real-device.examples.real-device

---

# Example: Real iOS/tvOS Device Setup

Use this repository's skills to prepare macOS + XCUITest for a real iOS or tvOS device.

1. Complete `skills/setup-xcuitest/SKILL.md`.
2. Continue to `skills/xcuitest-real-device-config/SKILL.md` only after its
   shared setup gates pass.
3. Follow the real-device Skill's runtime-route selection and Context loading
   instructions. This example does not override their order or approval gates.

Rules:

- Pause for physical-device actions such as Trust prompts or Developer Mode toggles.
- Ask before installing optional third-party device tools.
- When a WDA bundle is modified after signing, always re-sign with `codesign` before installing.

Completion criteria:

1. Device is visible in `xcrun xctrace list devices`.
2. For a build or install route, the applicable provisioning path succeeds without WDA signing errors.
3. If WDA was modified, `codesign --verify --verbose` confirms a valid signature.
4. The selected WDA route works. For a running-WDA URL, the endpoint is reachable and one Appium session attaches without requiring local signing, provisioning, or installation evidence.

---
security_profile: appium-real-device-workflows
owner: appium
id: xcuitest-real-device-readiness
status: stable

---

# XCUITest Real Device Readiness Context

Reusable readiness contract for real iOS or tvOS devices under Appium XCUITest.

Require passing handoff evidence from `skills/setup-xcuitest/SKILL.md`, confirm
the host is macOS, and select the WDA runtime route before changing anything.
Select a free Apple ID, paid Apple Developer, or enterprise signing profile
only when the route will build, sign, or install WDA; a running-WDA URL route
does not require local signing or provisioning evidence.

Completion requires the device to appear in `xcrun xctrace list devices` and the selected WDA route to work. Build or install routes additionally require their applicable signing, provisioning, installation, and post-modification code-signature checks. A running-WDA URL route instead requires a reachable endpoint and one successful Appium attachment; it skips local signing, provisioning, artifact, and installation gates.

## Readiness conditions

- Shared setup evidence confirms Appium, Xcode, and the XCUITest driver pass
  the gates owned by `skills/setup-xcuitest/SKILL.md`.
- The target device appears in `xcrun xctrace list devices`.
- The selected runtime route is one of Appium-managed `xcodebuild`, prepared
  prebuilt WDA, preinstalled WDA, or an already running WDA endpoint.
- Build, signing, provisioning, artifact, and installation evidence applies
  only to routes that perform those actions.
- A running-WDA URL route instead requires endpoint reachability and one
  successful Appium attachment.

The owning Skill selects and loads the exact signing profile, runtime profile,
procedure, preparation reference, runtime reference, capability Context, and
worked example. This Context does not define their execution order.

---
security_profile: appium-local-workflows
owner: appium
id: appium-troubleshooting-triage
status: stable
optional_context:
  - contexts/tools/appium/troubleshooting/examples/locator-failure.md
  - contexts/tools/appium/troubleshooting/examples/session-startup.md
  - contexts/tools/appium/troubleshooting/profiles/uiautomator2.md
  - contexts/tools/appium/troubleshooting/profiles/xcuitest.md
  - contexts/tools/appium/capabilities.md
  - contexts/tools/appium/troubleshooting/references/community-search.md
  - contexts/tools/appium/troubleshooting/references/uiautomator2-locators.md
  - contexts/tools/appium/troubleshooting/references/uiautomator2-session-startup.md
  - contexts/tools/appium/troubleshooting/references/xcuitest-element-lookup.md
  - contexts/tools/appium/troubleshooting/references/xcuitest-locators.md
  - contexts/tools/appium/troubleshooting/references/xcuitest-troubleshooting.md

---

# Appium Failure Triage Context

Reusable diagnosis contract for implemented UiAutomator2 session-startup, app-activity, adb transport, helper-server, native or hybrid locator failures, and XCUITest WDA, session-startup, app install or launch, device-state, alert, source-tree, or locator failures.

Capture the exact failing command, error text, platform, automation driver, desired capabilities, Appium version, installed driver list, and smallest reproduction before changing anything. After each fix, rerun the smallest failing command or doctor check and report the evidence.

## Recommended Route

1. Confirm the driver is UiAutomator2 or XCUITest. For another driver, stop and report that this repository has no implemented troubleshooting route for it.
2. If setup or doctor output is failing, run `skills/setup/SKILL.md` with the matching setup references first.
3. Load `contexts/tools/appium/troubleshooting/procedure.md`, the matching driver profile, and one symptom reference from `contexts/tools/appium/troubleshooting/`.
4. Load `contexts/tools/appium/capabilities.md` only when capability values are part of the suspected cause.
5. Use `contexts/tools/appium/troubleshooting/examples/session-startup.md` or `contexts/tools/appium/troubleshooting/examples/locator-failure.md` only when the example matches the failure.

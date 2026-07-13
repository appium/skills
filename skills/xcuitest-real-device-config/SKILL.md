---
name: xcuitest-real-device-config
description: Prepare real iOS or tvOS devices for Appium XCUITest by validating readiness, provisioning, signing, WebDriverAgent deployment, and connectivity with shared repository Context Assets. Use for real-device trust, Developer Mode, signing, provisioning, or WebDriverAgent installation and connection setup. Do not use for general iOS/tvOS XCUITest setup or Appium failures unrelated to real-device signing or WebDriverAgent deployment; use setup or appium-troubleshooting instead.
metadata:
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/real-device/xcuitest-readiness.md","contexts/tools/appium/real-device/references/real-device-procedure.md"]'
  renma.security-profile: appium-local-workflows
---

# XCUITest Real-Device Configuration Workflow

## Real-device routing and handoffs

Route real iOS or tvOS trust, Developer Mode, signing, provisioning, WebDriverAgent installation, prebuilt or preinstalled WDA, and attachment to a running WDA through this workflow. Hand general iOS/tvOS XCUITest setup to `skills/setup/SKILL.md` and post-setup Appium failures outside real-device signing or WDA deployment to `skills/appium-troubleshooting/SKILL.md`.

## Required inputs

Confirm the iOS or tvOS device, global `appium` or explicitly requested local `npx appium` mode, host macOS and Xcode state, Apple signing option, WebDriverAgent deployment strategy, device trust and Developer Mode state, available provisioning credentials, relevant capabilities, and permissions for local signing or device checks.

## Workflow outline

1. Load `contexts/tools/appium/real-device/xcuitest-readiness.md` and complete its iOS/tvOS XCUITest setup prerequisite handoff when required.
2. Select and load the one signing profile and one WebDriverAgent deployment profile that match the user's configuration.
3. Load `contexts/tools/appium/real-device/references/real-device-procedure.md`; load the readiness Context's shared capability option when choosing or validating real-device capabilities.
4. Run the device, signing, provisioning, code-signature, deployment, and WDA connectivity checks required by the selected profiles.
5. Re-run the narrowest failed check after each approved change and record the evidence.

## Real-device safety and approval constraints

- Redact Apple credentials, provisioning secrets, private keys, and signing identifiers from evidence; if evidence cannot be sanitized, stop and ask the user to verify it locally.
- Require explicit approval before privileged commands, trust changes, signing modifications, bundle changes, or device installation.
- Preserve existing working signing and WDA deployment choices unless evidence requires a change.
- Use global Appium mode by default and local `npx appium` only when explicitly requested.

## Completion criteria

Complete the workflow when the matching readiness, signing, and WDA profiles have been loaded; device, signing, provisioning, code-signature, deployment, and connectivity checks pass or are isolated as explicit manual blockers; all privileged or optional actions remain user-approved; and the final response reports the validated configuration, evidence, and remaining manual actions.

## Evidence

Example input: `Prepare a real iPhone for Appium XCUITest and verify WebDriverAgent can be installed.` Verify device trust, Developer Mode, signing assets, bundle IDs, WebDriverAgent deployment mode, and final connectivity before reporting readiness.

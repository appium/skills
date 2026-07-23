---
name: xcuitest-real-device-config
description: Prepare real iOS or tvOS devices for Appium XCUITest by validating readiness, provisioning, signing, WebDriverAgent deployment, and connectivity with shared repository Context Assets. Use for real-device trust, Developer Mode, signing, provisioning, or WebDriverAgent installation and connection setup. Do not use for general iOS/tvOS XCUITest setup or Appium failures unrelated to real-device signing or WebDriverAgent deployment; use setup or appium-troubleshooting instead.
metadata:
  renma.id: skill.xcuitest-real-device-config
  renma.published-entrypoint: "true"
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/real-device/xcuitest-readiness.md","contexts/tools/appium/real-device/references/real-device-procedure.md","contexts/tools/appium/real-device/references/wda-preparation.md","contexts/tools/appium/real-device/references/wda-runtime.md"]'
  renma.security-profile: appium-real-device-workflows
---

# XCUITest Real-Device Configuration Workflow

## Real-device routing and handoffs

This workflow covers real iOS or tvOS trust, Developer Mode, signing, provisioning, WebDriverAgent installation, prebuilt or preinstalled WDA, and use of a running WDA endpoint. Use `skills/setup/SKILL.md` for general iOS/tvOS XCUITest setup and `skills/appium-troubleshooting/SKILL.md` for later runtime failures outside real-device signing or WDA deployment. Treat that later troubleshooting work as a new published entrypoint after this workflow ends, not as a continuation owned by real-device configuration.

## Required inputs

Confirm the iOS or tvOS device, global `appium` or explicitly requested local `npx appium` mode, host macOS and Xcode state, WebDriverAgent runtime route, device trust and Developer Mode state, relevant capabilities, and permissions for local signing or device checks. For routes that build, sign, or install WDA, confirm the signing option and locally available provisioning assets without requesting their secret contents.

## Workflow outline

1. Load `contexts/tools/appium/real-device/xcuitest-readiness.md` and complete its iOS/tvOS XCUITest setup prerequisite handoff when required.
2. Select the WDA runtime route first. Load one signing profile only when this workflow will build, re-sign, install, or validate local WDA signing. Load no reuse profile for the default Appium-managed `xcodebuild` route; otherwise load exactly one matching prebuilt, preinstalled, or running-WDA URL profile.
3. Load `contexts/tools/appium/real-device/references/real-device-procedure.md`, then load `contexts/tools/appium/real-device/references/wda-runtime.md` before executing any numbered step. Also load `contexts/tools/appium/real-device/references/wda-preparation.md` when the selected route builds, modifies, signs, installs, or separately validates a local WDA bundle. Load the readiness Context's shared capability option when choosing or validating real-device capabilities.
4. Run the device, signing, provisioning, code-signature, deployment, and WDA connectivity checks required by the selected profiles.
5. Re-run the narrowest failed check after each approved change and record the evidence.

## Real-device safety and approval constraints

- Keep Apple credentials, provisioning-profile contents, private keys, signing-archive contents, and passwords outside agent inputs and captured command output. Report device and signing identifiers only as redacted fingerprints or match/no-match results; if evidence cannot be sanitized, stop and ask the user to verify it locally.
- Require explicit approval before privileged commands, trust changes, signing modifications, bundle changes, or device installation.
- Preserve existing working signing and WDA deployment choices unless evidence requires a change.
- Use global Appium mode by default and local `npx appium` only when explicitly requested.

## Completion criteria

Complete build or install routes only when their applicable device, signing, provisioning, code-signature, deployment, and connectivity checks pass or are isolated as explicit manual blockers. After the shared macOS, XCUITest-driver, and device-visibility prerequisites pass, complete a running-WDA URL route when the endpoint is reachable and an Appium session attaches successfully; local WDA preparation, signing, and installation evidence is not required for that route. In every route, keep privileged or optional actions user-approved and report the validated configuration, sanitized evidence, and remaining manual actions.

## Evidence

Example input: `Prepare a real iPhone for Appium XCUITest and verify WebDriverAgent can be installed.` Verify device trust, Developer Mode, signing assets, bundle IDs, WebDriverAgent deployment mode, and final connectivity before reporting readiness.

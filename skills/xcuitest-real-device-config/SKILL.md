---
name: xcuitest-real-device-config
description: Prepare real iOS or tvOS devices for Appium XCUITest by validating readiness, provisioning, signing, WebDriverAgent deployment, and connectivity. Use only after setup-xcuitest completes shared XCUITest prerequisites and continues to this Skill for a real-device target. Do not use for general XCUITest setup or later runtime failures unrelated to signing or WebDriverAgent deployment.
metadata:
  renma.id: skill.xcuitest-real-device-config
  renma.owner: appium
  renma.requires-context: '["contexts/tools/appium/real-device/xcuitest-readiness.md","contexts/tools/appium/real-device/references/real-device-procedure.md","contexts/tools/appium/real-device/references/wda-runtime.md"]'
  renma.optional-context: '["contexts/tools/appium/capabilities.md","contexts/tools/appium/real-device/profiles/enterprise-profile.md","contexts/tools/appium/real-device/profiles/free-apple-id.md","contexts/tools/appium/real-device/profiles/paid-developer.md","contexts/tools/appium/real-device/profiles/prebuilt-wda.md","contexts/tools/appium/real-device/profiles/preinstalled-wda.md","contexts/tools/appium/real-device/profiles/running-wda-url.md","contexts/tools/appium/real-device/references/wda-preparation.md","contexts/tools/appium/real-device/examples/real-device.md"]'
  renma.security-profile: appium-real-device-workflows
---

# XCUITest Real-Device Configuration Workflow

## Real-device routing and handoffs

This workflow covers real iOS or tvOS trust, Developer Mode, signing,
provisioning, WebDriverAgent installation, prebuilt or preinstalled WDA, and
use of a running WDA endpoint. Enter only from
`skills/setup-xcuitest/SKILL.md` after its shared prerequisite gates pass. Use
`skills/appium-troubleshooting/SKILL.md` as a new published entrypoint for
later runtime failures outside real-device signing or WDA deployment, not as a
continuation owned by this workflow.

## Required inputs

Confirm the iOS or tvOS device, global `appium` or explicitly requested local `npx appium` mode, host macOS and Xcode state, WebDriverAgent runtime route, device trust and Developer Mode state, relevant capabilities, and permissions for local signing or device checks. For routes that build, sign, or install WDA, confirm the signing option and locally available provisioning assets without requesting their secret contents.

## Workflow outline

1. Confirm the handoff evidence from `skills/setup-xcuitest/SKILL.md`, then
   load `contexts/tools/appium/real-device/xcuitest-readiness.md`. If the shared
   XCUITest prerequisite evidence is missing or failing, stop this continuation
   and report the setup blocker.
2. Select the WDA runtime route first. Load one signing profile only when this workflow will build, re-sign, install, or validate local WDA signing. Load no reuse profile for the default Appium-managed `xcodebuild` route; otherwise load exactly one matching prebuilt, preinstalled, or running-WDA URL profile.
3. Load the required real-device procedure, then load the required WDA runtime
   Context before executing any numbered step. Load the optional WDA
   preparation Context declared in metadata only when the selected route
   builds, modifies, signs, installs, or separately validates a local WDA
   bundle. Load the optional shared capability Context only when choosing or
   validating real-device capabilities.
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

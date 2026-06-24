---
owner: appium
policy_scope: "contexts/tools/appium/real-device/references/real-device-procedure-part9.md"
id: appium.real-device.references.real-device-procedure-part9
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/references/real-device-procedure-part9.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/references/real-device-procedure-part9.md bounded command output, local paths, driver names, IDs, and logs

---

## Evidence To Report

- macOS version and Xcode version
- target device name, UDID, OS version, and visibility in `xcrun xctrace list devices`
- selected provisioning approach and bundle ID/team ID used
- WDA preparation mode: default `xcodebuild`, preinstalled, prebuilt, `.xctestrun`, or attach-to-running
- whether the target OS supports `appium:usePreinstalledWDA` / `appium:prebuiltWDAPath`
- `codesign --verify --deep --strict` result for any prepared WDA bundle
- deployment command and smallest successful verification
- any required on-device action that remains manual

## Self-Improvement Prompt

Before the final response, run this self-improvement check. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

## Constraints
- This skill is macOS-only; do not provide Linux/Windows alternatives.
- Complete `environment-setup-xcuitest` first.
- Always verify the WDA signature with `codesign --verify --deep --strict` (step 5)
  after any preparation step before deploying.
- Never skip re-signing after modifying a signed `.app` bundle (e.g. removing frameworks).
- Mark paid-account-only steps; do not require them for free Apple IDs.
- Ask the user before installing any 3rd-party device tool (ios-deploy, go-ios,
  pymobiledevice3, tidevice, ios-app-signer, etc.).
- For steps that require physical interaction with the device (Trust popup, Developer
  Mode toggle), pause and provide the exact on-device instruction.
- Step 6 contains optional runtime modes; validate one mode only. The default
  xcodebuild-per-session flow is still valid.

## Agent completion criteria
Mark the skill complete only when all of the following are true:
- Connected device is visible in `xcrun xctrace list devices` output.
- A signed WDA `.app` has been prepared using one of the Options in step 4.
- `codesign --verify --deep --strict` on the prepared WDA exits cleanly (step 5 passes).
- At least one WDA runtime mode from step 6 is confirmed working (or default
  xcodebuild-per-session install succeeds).
- Final skill report includes capability hints:
  - one copy-paste JSON capabilities snippet for the validated mode, and
  - one additional fallback snippet.

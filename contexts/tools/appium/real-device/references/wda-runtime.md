---
security_profile: appium-real-device-workflows
owner: appium
id: appium.real-device.references.wda-runtime
name: xcuitest-real-device-wda-runtime
description: Validate one Appium XCUITest WebDriverAgent runtime route, report sanitized evidence, and apply route-specific completion criteria for a real iOS or tvOS device.
status: stable
---

# XCUITest Real-Device WDA Runtime and Completion

This asset continues the ordered procedure in
`contexts/tools/appium/real-device/references/real-device-procedure.md`.
For a route that prepares or verifies a local WDA bundle, complete steps 4 and 5
in `contexts/tools/appium/real-device/references/wda-preparation.md` before step 6.

## Contents

- [Hard Constraints](#hard-constraints)
- [Step 6: Run Appium XCUITest](#6-run-appium-xcuitest-with-the-selected-wda-route)
- [Evidence To Report](#evidence-to-report)
- [Self-Improvement Prompt](#self-improvement-prompt)
- [Completion Criteria](#completion-criteria)

## Hard Constraints
- This workflow is macOS-only; do not provide Linux/Windows alternatives.
- Complete the iOS/tvOS + XCUITest route in `contexts/tools/appium/setup/routing.md` first.
- Verify every locally prepared WDA signature with `codesign --verify --deep --strict`
  (step 5) before deploying. Do not require local signature evidence for a running-WDA
  URL route.
- Never skip re-signing after modifying a signed `.app` bundle (e.g. removing frameworks).
- Mark paid-account-only steps; do not require them for free Apple IDs.
- Ask the user before installing any 3rd-party device tool (ios-deploy, go-ios,
  pymobiledevice3, tidevice, ios-app-signer, etc.).
- For steps that require physical interaction with the device (Trust popup, Developer
  Mode toggle), pause and provide the exact on-device instruction.
- Step 6 contains optional runtime modes; validate one mode only. The default
  xcodebuild-per-session flow is still valid.

## Ordered Procedure

### 6. Run Appium XCUITest with the selected WDA route

Choose one mode only. Do not run all modes.

#### Mode A — Default Appium-managed xcodebuild

   Use this default when Appium should build, sign, install, and launch WDA for
   the session. Omit `appium:usePreinstalledWDA`, `appium:prebuiltWDAPath`, and
   `appium:webDriverAgentUrl`. Supply the signing values validated for the selected
   account without including their real values in shared evidence:
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:xcodeOrgId": "<team-id>",
     "appium:xcodeSigningId": "Apple Development",
     "appium:updatedWDABundleId": "<profile-covered-bundle-id>"
   }
   ```
   Start one Appium session and require the Appium-managed WDA build, installation,
   launch, and `/status` connection to succeed.

#### Mode B — Reuse preinstalled WDA

   Install WDA once and reuse it across sessions without running `xcodebuild` each time.
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "<wda-bundle-id>"
   }
   ```
   Notes:
   - For free-account or enterprise-profile setups, complete the step 5 pre-trust
     recommendation first.
   - If launch fails with repeated `ECONNREFUSED 127.0.0.1:8100`, rebuild from the
     iOS/tvOS 17+ flow in step 4 (move XCTest runtime artifacts to backup + re-sign),
     reinstall, then retry.
   - If the installed WDA bundle ID has no `.xctrunner` suffix:
   ```json
   {
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "io.appium.wda",
     "appium:updatedWDABundleIdSuffix": ""
   }
   ```

#### Mode C — Use prebuilt WDA app/xctestrun artifacts

   Skip build work at session time by using previously prepared artifacts.

##### Option C1: Signed `.app` artifact

   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:usePreinstalledWDA": true,
     "appium:prebuiltWDAPath": "/path/to/signed/WebDriverAgentRunner-Runner.app"
   }
   ```

##### Option C2: `.xctestrun` artifact

   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:useXctestrunFile": true,
     "appium:bootstrapPath": "/abs/path/to/appium_wda_ios/Build/Products"
   }
   ```
   If Appium expects `WebDriverAgentRunner_iphoneos-arm64.xctestrun` but build output
   is SDK-suffixed, copy/rename it to the expected filename in the same directory.

#### Mode D — Attach to already running WDA

   Start WDA externally (Xcode/xcodebuild/tooling), then point Appium at it.
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:platformVersion": "<device-os-version>",
     "appium:udid": "<device-udid>",
     "appium:deviceName": "<device-name>",
     "appium:webDriverAgentUrl": "http://<device-ip-or-localhost>:8100"
   }
   ```
   If the remote WDA port differs from local forwarding, add `appium:wdaRemotePort`.
   Verify the URL without printing any credential-bearing URL components:
   ```bash
   WDA_URL="http://<device-ip-or-localhost>:8100"
   curl -fsS "${WDA_URL%/}/status"
   ```
   Require the status request to exit successfully and return valid WDA status JSON.
   Then start one Appium session and require successful attachment. Do not request
   local signing, provisioning, artifact, or installation evidence for this route
   unless the user separately asks to diagnose the running WDA.

## Evidence To Report

- macOS version and Xcode version
- target device type, redacted UDID fingerprint, OS version, and visibility in `xcrun xctrace list devices`
- selected provisioning approach when applicable, plus bundle-ID, Team-ID, certificate, and profile match/no-match results; never report their full values
- WDA preparation mode: default `xcodebuild`, preinstalled, prebuilt, `.xctestrun`, or attach-to-running
- whether the target OS supports `appium:usePreinstalledWDA` / `appium:prebuiltWDAPath`
- `codesign --verify --deep --strict` result for any locally prepared WDA bundle
- sanitized deployment or attachment command summary and smallest successful verification
- any required on-device action that remains manual

Never include a full UDID, Team ID, certificate identity, bundle ID, provisioning-
profile contents, signing-archive path, signing password, private key, or credential in
the report.

## Self-Improvement Prompt

Before the final response, run this self-improvement check. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit this context unless asked.

## Completion Criteria
Mark the workflow complete only when the shared prerequisites and the selected
route's checks pass:
- The connected device is visible in `xcrun xctrace list devices` output.
- For default Appium-managed `xcodebuild`, one session completes WDA build, signing,
  installation, launch, and connection successfully.
- For a prebuilt route, the local artifact passes `codesign --verify --deep --strict`,
  deployment succeeds, and one session connects.
- For a preinstalled route, the installed runner launches and one session connects;
  require a local signature check only when the workflow rebuilt or re-signed it.
- For a running-WDA URL route, the endpoint is reachable and one Appium session
  attaches successfully; steps 4 and 5 are not required.
- Final report includes capability hints:
  - one copy-paste JSON capabilities snippet for the validated mode, and
  - one attach-only fallback for a running-WDA route (for example, device IP versus an existing localhost port forward) when available, or an explicit note that the user's constraints exclude a safe fallback.
  Use sanitized placeholders in every snippet.

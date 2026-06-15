---
name: "realdev-13"
description: "Preserved real-device-procedure procedure part 13 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 13

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

   If the remote WDA port differs from local forwarding, add `appium:wdaRemotePort`.

   **Skill report requirement:**
   - In the final skill report, print at least one copy-paste-ready capabilities JSON
     snippet for the mode that was validated.
   - Include one additional capabilities snippet as a fallback hint (for example,
     preinstalled mode and attach mode).

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

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

## Constraints
- This skill is macOS-only; do not provide Linux/Windows alternatives.
- Complete `environment-setup-xcuitest` first.
- Always verify the WDA signature with `codesign --verify --deep --strict` (step 5)
  after any preparation step before deploying.
- Never skip re-signing after modifying a signed `.app` bundle (e.g. removing frameworks).

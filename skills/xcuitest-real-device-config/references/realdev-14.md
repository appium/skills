---
name: "realdev-14"
description: "Preserved real-device-procedure procedure part 14 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 14

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

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

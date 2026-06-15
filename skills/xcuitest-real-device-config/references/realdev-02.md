---
name: "realdev-02"
description: "Preserved real-device-procedure procedure part 02 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 02

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

  3. Build WDA via Xcode UI (`appium driver run xcuitest open-wda`) as a last resort.
- Run `appium driver run xcuitest open-wda` only for Option 3 (Xcode UI); skip for Options 1 and 2.
- After any build by Xcode or xcodebuild on iOS/tvOS 17+: remove `Frameworks/` files, then re-sign before verifying.
- For iOS/tvOS 17+, use the framework-removed and re-signed `.app` for Step 6/7 runtime checks; otherwise WDA may install but fail to launch.
- After any WDA preparation: always verify the signature with `codesign --verify --deep --strict` (step 5) before deploying.
- If a downloaded WDA package has no embedded provisioning profile: use `resigner` which handles profile embedding, optional bundle ID remapping, and signing in one step.
- For free-account or enterprise-profile setups where first launch may be blocked by trust prompts, install and trust a sample app signed with the same provisioning profile before launching WDA.
- For iOS/iPadOS 16+ without reliable internet: use an offline provisioning profile (see note in step 4, Option 1).
- WDA deployment pattern is optional and user-driven; the default uses `xcodebuild` every session:
  - For faster session start if WDA can remain installed between sessions → Run Preinstalled WDA (`appium:usePreinstalledWDA`).
  - For faster session start using a pre-built package (no xcodebuild at session time) → Run Prebuilt WDA (`appium:prebuiltWDAPath`).

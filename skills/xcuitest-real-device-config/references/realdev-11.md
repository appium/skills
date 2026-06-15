---
name: "realdev-11"
description: "Preserved real-device-procedure procedure part 11 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 11

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->


   Proceed to step 5 to verify the signature.

5. **Verify WDA signature**
   Run the following checks on the prepared `.app` before deploying it to the device.
   Removing any file from a signed bundle invalidates the Code Directory hash, so this
   check catches both a bad re-sign and a bundle that was never signed:
   ```bash
   WDA_APP="/path/to/WebDriverAgentRunner-Runner.app"

   # Verify signature recursively with strict checking
   codesign --verify --deep --strict --verbose=2 "$WDA_APP"

   # Inspect signing details (team, bundle ID, entitlements)
   codesign -dv --verbose=4 "$WDA_APP"
   ```
   A valid result produces:
   ```
   WebDriverAgentRunner-Runner.app: valid on disk
   WebDriverAgentRunner-Runner.app: satisfies its Designated Requirement
   ```
   If `codesign --verify` exits non-zero or reports `invalid`, return to step 4 and
   re-sign or rebuild the bundle.

   **Common install-time errors and fixes:**
   - `xcodebuild exited with code '65'` → code signing is misconfigured; redo step 4.
   - `Unable to launch … invalid code signature / inadequate entitlements / profile not trusted`
     → The developer is not yet trusted on the device.
     On the device: **Settings → General → VPN & Device Management** → select the
     development team → **Trust**. Then retry.

   **Recommendation (free account / enterprise profile):**
   Before first WDA launch, install a small sample app signed with the same
   provisioning profile/certificate, launch it once, and complete all trust prompts.
   This pre-trust step reduces WDA launch blocking on first run.


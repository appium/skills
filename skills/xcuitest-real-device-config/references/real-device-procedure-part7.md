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

6. **Run Appium XCUITest with Prepared WDA** *(choose one mode only)*
   Use one mode below as an example. Do not run all modes.

   **Mode A — Reuse preinstalled WDA**
   Install WDA once and reuse it across sessions without running `xcodebuild` each time.
   ```json
   {
     "platformName": "ios",
     "appium:automationName": "xcuitest",
     "appium:udid": "<device-udid>",
     "appium:usePreinstalledWDA": true,
     "appium:updatedWDABundleId": "com.yourteam.WebDriverAgentRunner"
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

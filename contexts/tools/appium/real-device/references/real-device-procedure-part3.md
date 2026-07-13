---
security_profile: appium-local-workflows
owner: appium
id: appium.real-device.references.real-device-procedure-part3

---

   **Option 1 (primary) — Download prebuilt WDA from GitHub releases**

   The [WebDriverAgent releases page](https://github.com/appium/WebDriverAgent/releases)
   provides prebuilt `.app` packages for real devices. These are built without embedded
   XCTest frameworks (safe for iOS 17+) and have no embedded provisioning profile;
   they must be signed with your own identity before use.

   Download [`resigner`](https://github.com/appium/resigner) from its
   [releases page](https://github.com/appium/resigner/releases). It handles profile
   embedding, optional bundle ID remapping, and signing in one step for any account type.
   Select the archive that matches the host machine architecture:
   ```bash
   ARCH="$(uname -m)"
   case "$ARCH" in
     arm64) RESIGNER_ARCHIVE="darwin-arm64.tar.gz" ;;
     x86_64) RESIGNER_ARCHIVE="darwin-amd64.tar.gz" ;;
     *) echo "Unsupported macOS arch: $ARCH"; exit 1 ;;
   esac

   tar xzf "$RESIGNER_ARCHIVE"
   # binary is at: darwin-*/resigner
   ```

   Prepare a local `.p12` signing archive outside the chat or agent context; never upload, attach, copy, print, or log the archive.
   The human operator must create it locally, keep the password out of prompts,
   logs, and diagnostics, and provide only a filesystem path placeholder when
   documenting the workflow.

   Inspect the downloaded package to confirm current bundle IDs and signing state:
   ```bash
   WDA_APP="/path/to/downloaded/WebDriverAgentRunner-Runner.app"
   resigner --inspect "$WDA_APP"
   ```
   The prebuilt package uses `com.facebook.WebDriverAgentRunner` as its root bundle ID.

   Decode your provisioning profile to confirm its allowed bundle identifier.
   For free accounts (always specific-ID profiles), the output includes a `TEAMID.`
   prefix and you must strip it to get `TARGET_BUNDLE_ID`. For paid accounts, do this
   strip step only when using a specific-ID profile; if using `*`, `TARGET_BUNDLE_ID`
   is not needed because remap flags are omitted.
   ```bash
   PROFILES_DIR="/path/to/profiles-directory"   # resigner --profile takes a directory
   PROFILE_TMP_DIR="$(mktemp -d)"
   PROFILE_PLIST="$PROFILE_TMP_DIR/profile.plist"
   security cms -D -i "$PROFILES_DIR/<profile>.mobileprovision" > "$PROFILE_PLIST" # never print, log, or upload profile contents
    # output example: TEAMID1234.com.example.wda  ->  TARGET_BUNDLE_ID=com.example.wda
   /usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" "$PROFILE_PLIST"
    /usr/libexec/PlistBuddy -c "Print :ExpirationDate" "$PROFILE_PLIST"

    APP_ID=$(/usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" "$PROFILE_PLIST")
    TARGET_BUNDLE_ID="${APP_ID#*.}"   # remove TEAMID. prefix if present
   ```
   Delete `PROFILE_TMP_DIR` after the profile checks complete.

   Run `resigner` to embed the profile and sign. `--profile` accepts a **directory**
   path containing `.mobileprovision` files, not the `.mobileprovision` file itself; never upload, attach, print, or log those files.
   resigner selects the matching profile automatically. Include `--bundle-id-remap`
   flags only when your profile app identifier is not a true wildcard (`*`). Each
   remap must use `old.bundle.id=new.bundle.id` syntax:
   ```bash
   TARGET_BUNDLE_ID="<bundle-id-covered-by-your-profile>"  # strip the TEAMID. prefix
   # Omit the --bundle-id-remap lines ONLY if your profile app identifier is exactly `*`
   # Partial wildcards (e.g. io.appium.* or com.example.*) still require --bundle-id-remap

   resigner \
     --p12-file "<local-signing-archive-path>" \
     --p12-password "<p12-password>" \
     --profile "$PROFILES_DIR" \
     --force \
     --bundle-id-remap "com.facebook.WebDriverAgentRunner=${TARGET_BUNDLE_ID}" \
     --bundle-id-remap "com.facebook.WebDriverAgentRunner.xctrunner=${TARGET_BUNDLE_ID}" \
     --bundle-id-remap "com.facebook.WebDriverAgentLib=${TARGET_BUNDLE_ID}" \
     "$WDA_APP"
   ```
   After `resigner` completes, the package is already signed; proceed directly to step 5 to verify.

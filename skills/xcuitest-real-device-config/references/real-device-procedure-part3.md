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

   Export your signing certificate as a `.p12`. Use either method:

   **GUI (Keychain Access):** locate your Apple Development certificate (the one with a
   private key) → right-click → **Export** → choose **Personal Information Exchange
   (.p12)** → set an export password.

   **CLI (login keychain):**
   ```bash
   P12_PASS="<choose-a-password>"
   security export \
     -k ~/Library/Keychains/login.keychain-db \
     -t identities \
     -f pkcs12 \
     -P "$P12_PASS" \
     -o ~/sign/mysign.p12
   ```

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
   security cms -D -i "$PROFILES_DIR/<profile>.mobileprovision" > /tmp/profile.plist
    # output example: TEAMID1234.com.example.wda  ->  TARGET_BUNDLE_ID=com.example.wda
   /usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" /tmp/profile.plist
    /usr/libexec/PlistBuddy -c "Print :ExpirationDate" /tmp/profile.plist

    APP_ID=$(/usr/libexec/PlistBuddy -c "Print :Entitlements:application-identifier" /tmp/profile.plist)
    TARGET_BUNDLE_ID="${APP_ID#*.}"   # remove TEAMID. prefix if present
   ```

   Run `resigner` to embed the profile and sign. `--profile` accepts a **directory**
   path containing `.mobileprovision` files, not the `.mobileprovision` file itself;
   resigner selects the matching profile automatically. Include `--bundle-id-remap`
   flags only when your profile app identifier is not a true wildcard (`*`). Each
   remap must use `old.bundle.id=new.bundle.id` syntax:
   ```bash
   TARGET_BUNDLE_ID="<bundle-id-covered-by-your-profile>"  # strip the TEAMID. prefix
   # Omit the --bundle-id-remap lines ONLY if your profile app identifier is exactly `*`
   # Partial wildcards (e.g. io.appium.* or com.example.*) still require --bundle-id-remap

   resigner \
     --p12-file "<path-to-your.p12>" \
     --p12-password "<p12-password>" \
     --profile "$PROFILES_DIR" \
     --force \
     --bundle-id-remap "com.facebook.WebDriverAgentRunner=${TARGET_BUNDLE_ID}" \
     --bundle-id-remap "com.facebook.WebDriverAgentRunner.xctrunner=${TARGET_BUNDLE_ID}" \
     --bundle-id-remap "com.facebook.WebDriverAgentLib=${TARGET_BUNDLE_ID}" \
     "$WDA_APP"
   ```
   After `resigner` completes, the package is already signed; proceed directly to step 5 to verify.


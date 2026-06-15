---
name: "realdev-05"
description: "Preserved real-device-procedure procedure part 05 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 05

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->

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

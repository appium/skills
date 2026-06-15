---
name: "realdev-06"
description: "Preserved real-device-procedure procedure part 06 of 14"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# real-device-procedure Part 06

<!-- preserved-source: 64dcf79:skills/xcuitest-real-device-config/references/real-device-procedure.md; strip this generated header when comparing -->


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

   Validate the result before install:
   ```bash
   codesign --verify --deep --strict --verbose=2 "$WDA_APP"
   ```

   If install fails with `ApplicationVerificationFailed` / `A valid provisioning profile
   for this executable was not found`, the profile does not cover the current bundle ID
   and device UDID. Regenerate the profile and re-sign.

   Provisioning profile notes:
   - A true wildcard profile (`*` app identifier) covers any bundle ID and requires a
     paid Apple Developer account — no `--bundle-id-remap` flags needed.
   - Partial wildcards (e.g. `io.appium.*`) and all specific-ID profiles (free account
     or paid account without a `*` profile) require the `--bundle-id-remap` flags.

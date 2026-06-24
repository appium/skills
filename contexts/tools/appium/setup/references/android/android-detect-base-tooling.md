---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/android/android-detect-base-tooling.md"
id: appium.setup.references.android.android-detect-base-tooling
name: "android-detect-base-tooling"
description: "Detect Android setup host, Java, SDK variables, ADB, and emulator binary"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/android/android-detect-base-tooling.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/android/android-detect-base-tooling.md bounded command output, local paths, driver names, IDs, and logs

---

# android-detect-base-tooling

## Detect OS And Base Tooling

Run the deterministic read-only check before installing anything:

```bash
node tools/appium/setup/scripts/check-android-env.mjs
```

Use `host`, `environment`, `paths`, `checks.java`, `checks.javac`, and `checks.adbVersion` as the detection evidence.

## SDK Path Trigger

Run Android SDK command-line tools setup only when `paths.androidHomeExists` is false or `paths.sdkmanagerExecutable` is false.

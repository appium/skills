---
name: "android-detect-base-tooling"
description: "Detect Android setup host, Java, SDK variables, ADB, and emulator binary"
---

# android-detect-base-tooling

## Detect OS And Base Tooling

Run the deterministic read-only check before installing anything:

```bash
node skills/setup/scripts/check-android-env.mjs
```

Use `host`, `environment`, `paths`, `checks.java`, `checks.javac`, and `checks.adbVersion` as the detection evidence.

## SDK Path Trigger

Run Android SDK command-line tools setup only when `paths.androidHomeExists` is false or `paths.sdkmanagerExecutable` is false.

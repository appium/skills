---
owner: appium
id: platform.android.bundletool
name: "android-bundletool"
description: "Route optional bundletool.jar setup for Android App Bundle support"
status: stable

---

# Android Bundletool

## Goal

Install and validate `bundletool.jar` from official Google bundletool releases only when Android App Bundle tooling is explicitly requested.

## Routing

Load these references in order:

1. `contexts/platform/android/references/bundletool/decision-logic.md` for optional-use gates and install triggers.
2. `contexts/platform/android/references/bundletool/install.md` for download and PATH setup.
3. `contexts/platform/android/references/bundletool/validation.md` for version evidence and completion criteria.

## Validation Command

```bash
node tools/appium/setup/scripts/check-bundletool-env.mjs
```

Use `summary.requiredOk: true` as the read-only setup gate after the user explicitly requests bundletool capability.

## Completion Criteria

- User explicitly requested bundletool capability.
- `bundletool.jar` is resolvable from `PATH` or a reported absolute path.
- `java -jar <bundletool.jar> version` succeeds.
- Result states whether installation was skipped or performed.

## Evidence To Report

Report host OS, GitHub release tag, release asset URL, `bundletool.jar` path, version output, and whether setup was skipped because bundletool was already present.

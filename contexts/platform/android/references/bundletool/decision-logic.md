---
owner: appium
id: platform.android.bundletool.decision-logic
name: "bundletool-decision-logic"
description: "Optional bundletool setup gates and install triggers"
status: stable

---

# bundletool-decision-logic

## Decision Logic

- Do not run this setup unless the user explicitly requests Android App Bundle tooling.
- If host OS is not macOS, Linux, or Windows: stop.
- If `bundletool.jar` is already resolvable from `PATH`: do not reinstall; validate and report the current version.
- If missing: download the latest `bundletool-all-*.jar` release asset from `https://github.com/google/bundletool/releases`.
- Verify the release source and checksum or signature when available.
- Do not modify Appium, Android SDK, Java, Xcode, or driver setup from this reference.

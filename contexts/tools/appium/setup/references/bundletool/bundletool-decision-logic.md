---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/bundletool/bundletool-decision-logic.md"
id: appium.setup.references.bundletool.bundletool-decision-logic
name: "bundletool-decision-logic"
description: "Optional bundletool setup gates and install triggers"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/bundletool/bundletool-decision-logic.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/bundletool/bundletool-decision-logic.md bounded command output, local paths, driver names, IDs, and logs

---

# bundletool-decision-logic

## Decision Logic

- Do not run this setup unless the user explicitly requests Android App Bundle tooling.
- If host OS is not macOS, Linux, or Windows: stop.
- If `bundletool.jar` is already resolvable from `PATH`: do not reinstall; validate and report the current version.
- If missing: download the latest `bundletool-all-*.jar` release asset from `https://github.com/google/bundletool/releases`.
- Verify the release source and checksum or signature when available.
- Do not modify Appium, Android SDK, Java, Xcode, or driver setup from this reference.

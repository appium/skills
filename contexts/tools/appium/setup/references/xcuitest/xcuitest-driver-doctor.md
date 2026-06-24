---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/xcuitest/xcuitest-driver-doctor.md"
id: appium.setup.references.xcuitest.xcuitest-driver-doctor
name: "xcuitest-driver-doctor"
description: "Install and validate Appium XCUITest driver and doctor required fixes"
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/setup/references/xcuitest/xcuitest-driver-doctor.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/xcuitest/xcuitest-driver-doctor.md bounded command output, local paths, driver names, IDs, and logs

---

# xcuitest-driver-doctor

## Install And List

```bash
npm install -g appium@3.5.2
appium driver install xcuitest
appium driver list --installed --json
```

The installed list must include `xcuitest`.

## Doctor Gate

```bash
appium driver doctor xcuitest
```

Completion requires `0 required fixes needed`. If wording changes, try `--json`; if still ambiguous, mark `needs-manual-review` and do not mark complete.

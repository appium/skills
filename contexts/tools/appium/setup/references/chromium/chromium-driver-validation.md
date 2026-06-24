---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/chromium/chromium-driver-validation.md"
id: appium.setup.references.chromium.chromium-driver-validation
name: "chromium-driver-validation"
description: "Install and validate Appium Chromium driver and doctor behavior"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/chromium/chromium-driver-validation.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/chromium/chromium-driver-validation.md bounded command output, local paths, driver names, IDs, and logs

---

# chromium-driver-validation

## Install And List

```bash
npm install -g appium@3.5.2
appium driver install chromium
appium driver list --installed --json
```

The installed list must include `chromium`.

## Doctor

```bash
appium driver doctor chromium
```

Use `0 required fixes needed` as the pass/fail gate when doctor is supported. If doctor is unsupported by the installed driver, report `not-supported` and continue only if install/list/smoke checks pass.

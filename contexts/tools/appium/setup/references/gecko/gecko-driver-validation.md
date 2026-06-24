---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/gecko/gecko-driver-validation.md"
id: appium.setup.references.gecko.gecko-driver-validation
name: "gecko-driver-validation"
description: "Install and validate Appium Gecko driver and doctor behavior"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/gecko/gecko-driver-validation.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/gecko/gecko-driver-validation.md bounded command output, local paths, driver names, IDs, and logs

---

# gecko-driver-validation

## Install And List

```bash
npm install -g appium@3.5.2
appium driver install gecko
appium driver list --installed --json
```

The installed list must include `gecko`.

## Doctor

```bash
appium driver doctor gecko
```

Use `0 required fixes needed` as the pass/fail gate when doctor is supported.

If doctor is unsupported by the installed driver, report `not-supported` and continue only if install/list, Firefox availability, and smoke checks pass.

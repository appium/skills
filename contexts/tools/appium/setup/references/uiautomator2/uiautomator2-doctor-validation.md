---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/uiautomator2/uiautomator2-doctor-validation.md"
id: appium.setup.references.uiautomator2.uiautomator2-doctor-validation
name: "uiautomator2-doctor-validation"
description: "Validate UiAutomator2 Appium doctor output and required fix handling"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/uiautomator2/uiautomator2-doctor-validation.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/uiautomator2/uiautomator2-doctor-validation.md bounded command output, local paths, driver names, IDs, and logs

---

# uiautomator2-doctor-validation

## Doctor Gate

```bash
node tools/appium/setup/scripts/check-uiautomator2-env.mjs
```

Completion requires `summary.doctorRequiredOk: true`. Optional warnings are non-blocking. If `summary.needsUnsandboxedAppiumHome` is true, rerun outside the managed sandbox or run `appium driver doctor uiautomator2` directly.

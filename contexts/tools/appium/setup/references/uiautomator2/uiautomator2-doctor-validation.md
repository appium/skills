---
owner: appium
id: appium.setup.references.uiautomator2.uiautomator2-doctor-validation
name: "uiautomator2-doctor-validation"
description: "Validate UiAutomator2 Appium doctor output and required fix handling"

---

# uiautomator2-doctor-validation

## Doctor Gate

```bash
node tools/appium/setup/scripts/check-uiautomator2-env.mjs
```

Completion requires `summary.doctorRequiredOk: true`. Optional warnings are non-blocking. If `summary.needsUnsandboxedAppiumHome` is true, rerun outside the managed sandbox or run `appium driver doctor uiautomator2` directly.

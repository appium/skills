---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/espresso/espresso-doctor-validation.md"
id: appium.setup.references.espresso.espresso-doctor-validation
name: "espresso-doctor-validation"
description: "Validate Espresso Appium doctor output and required fix handling"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/espresso/espresso-doctor-validation.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/espresso/espresso-doctor-validation.md bounded command output, local paths, driver names, IDs, and logs

---

# espresso-doctor-validation

## Doctor Gate

```bash
appium driver doctor espresso
```

Completion requires `0 required fixes needed`. Optional warnings are non-blocking.

If doctor wording changes, re-run once with `appium driver doctor espresso --json`. If still ambiguous, mark `needs-manual-review` and do not mark complete.

---
name: "espresso-doctor-validation"
description: "Validate Espresso Appium doctor output and required fix handling"
---

# espresso-doctor-validation

## Doctor Gate

```bash
appium driver doctor espresso
```

Completion requires `0 required fixes needed`. Optional warnings are non-blocking.

If doctor wording changes, re-run once with `appium driver doctor espresso --json`. If still ambiguous, mark `needs-manual-review` and do not mark complete.

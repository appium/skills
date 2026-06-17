---
name: "uiautomator2-doctor-validation"
description: "Validate UiAutomator2 Appium doctor output and required fix handling"
---

# uiautomator2-doctor-validation

## Doctor Gate

Run:

```bash
appium driver doctor uiautomator2
node skills/setup/scripts/check-uiautomator2-env.mjs
```

Completion requires doctor text to include `0 required fixes needed`. Optional warnings are non-blocking.

## Ambiguous Output

If doctor wording changes:

1. Re-run once with `appium driver doctor uiautomator2 --json`.
2. If JSON is unsupported, capture full text output.
3. Accept a pass only when structured output or summary text indicates zero required issues.
4. If still ambiguous, mark status as `needs-manual-review` and do not mark the skill complete.

---
name: "chromium-driver-validation"
description: "Install and validate Appium Chromium driver and doctor behavior"
---

# chromium-driver-validation

## Install And List

```bash
npm install -g appium
appium driver install chromium
appium driver list --installed --json
```

The installed list must include `chromium`.

## Doctor

```bash
appium driver doctor chromium
```

Use `0 required fixes needed` as the pass/fail gate when doctor is supported. If doctor is unsupported by the installed driver, report `not-supported` and continue only if install/list/smoke checks pass.

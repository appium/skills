---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.chromium.chromium-driver-validation
name: "chromium-driver-validation"
description: "Install and validate Appium Chromium driver and doctor behavior"

---

# chromium-driver-validation

## Install And List

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install -g "appium@$APPIUM_VERSION"
appium driver install chromium
appium driver list --installed --json
```

The installed list must include `chromium`.

## Doctor

```bash
appium driver doctor chromium
```

Use `0 required fixes needed` as the pass/fail gate when doctor is supported. If doctor is unsupported by the installed driver, report `not-supported` and continue only if install/list/smoke checks pass.

---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.gecko.gecko-driver-validation
name: "gecko-driver-validation"
description: "Install and validate Appium Gecko driver and doctor behavior"

---

# gecko-driver-validation

## Install And List

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install -g "appium@$APPIUM_VERSION"
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

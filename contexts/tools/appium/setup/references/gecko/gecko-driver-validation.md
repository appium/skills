---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.gecko.gecko-driver-validation
name: "gecko-driver-validation"
description: "Install and validate Appium Gecko driver and doctor behavior"

---

# gecko-driver-validation

## Install And List

When Appium is missing or needs a required upgrade, resolve `APPIUM_VERSION`
using Appium Version Selection in `contexts/tools/appium/setup-basics.md`.
Skip installs for compatible Appium and already installed drivers; apply the
selected command profile to the commands below.

Only when Appium installation is required:

```bash
: "${APPIUM_VERSION:?Resolve exact APPIUM_VERSION using Appium Setup Basics}"
npm install -g "appium@$APPIUM_VERSION"
```

Only when the driver is missing:

```bash
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

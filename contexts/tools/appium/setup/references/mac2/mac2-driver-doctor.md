---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.mac2.mac2-driver-doctor
name: "mac2-driver-doctor"
description: "Install and validate Appium Mac2 driver and doctor behavior"

---

# mac2-driver-doctor

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
appium driver install mac2
appium driver list --installed --json
```

The installed list must include `mac2`.

## Doctor

```bash
appium driver doctor mac2
```

Use `0 required fixes needed` as the pass/fail gate. Optional warnings are non-blocking, but report them if they affect the requested target app.

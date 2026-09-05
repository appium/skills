---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.espresso.espresso-driver-install
name: "espresso-driver-install"
description: "Install and verify the Appium Espresso driver in global command mode"

---

# espresso-driver-install

## Install

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
appium driver install espresso
```

If already installed, continue to verification.

## Verify

```bash
appium -v
appium driver list --installed --json
```

The driver is present when JSON or text fallback includes `espresso`.

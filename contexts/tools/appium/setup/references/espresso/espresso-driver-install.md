---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.espresso.espresso-driver-install
name: "espresso-driver-install"
description: "Install and verify the Appium Espresso driver in global command mode"

---

# espresso-driver-install

## Install

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install -g "appium@$APPIUM_VERSION"
appium driver install espresso
```

If already installed, continue to verification.

## Verify

```bash
appium -v
appium driver list --installed --json
```

The driver is present when JSON or text fallback includes `espresso`.

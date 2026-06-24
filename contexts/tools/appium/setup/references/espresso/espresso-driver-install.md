---
owner: appium
id: appium.setup.references.espresso.espresso-driver-install
name: "espresso-driver-install"
description: "Install and verify the Appium Espresso driver in global command mode"

---

# espresso-driver-install

## Install

```bash
npm install -g appium@3.5.2
appium driver install espresso
```

If already installed, continue to verification.

## Verify

```bash
appium -v
appium driver list --installed --json
```

The driver is present when JSON or text fallback includes `espresso`.

---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.uiautomator2.uiautomator2-driver-install
name: "uiautomator2-driver-install"
description: "Install and verify the Appium UiAutomator2 driver in global command mode"

---

# uiautomator2-driver-install

## Install Driver

Use global Appium mode unless the user explicitly asks for local `npx` mode:

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
appium driver install uiautomator2
```

If the driver already exists, continue to verification.

## Verify Driver

```bash
node tools/appium/setup/scripts/check-uiautomator2-env.mjs
```

Driver setup is valid when `summary.driverInstalled` is true and `summary.driverVersion` is populated. If `summary.needsUnsandboxedAppiumHome` is true, rerun outside the managed sandbox or use `appium driver list --installed`.

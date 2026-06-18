---
name: "uiautomator2-driver-install"
description: "Install and verify the Appium UiAutomator2 driver in global command mode"
---

# uiautomator2-driver-install

## Install Driver

Use global Appium mode unless the user explicitly asks for local `npx` mode:

```bash
npm install -g appium
appium driver install uiautomator2
```

If the driver already exists, continue to verification.

## Verify Driver

```bash
node skills/setup/scripts/check-uiautomator2-env.mjs
```

Driver setup is valid when `summary.driverInstalled` is true and `summary.driverVersion` is populated. If `summary.needsUnsandboxedAppiumHome` is true, rerun outside the managed sandbox or use `appium driver list --installed`.

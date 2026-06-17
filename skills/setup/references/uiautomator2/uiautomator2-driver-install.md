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
appium -v
appium driver list --installed --json
node skills/setup/scripts/check-uiautomator2-env.mjs
```

The driver is present when the JSON or text fallback includes `uiautomator2`. Report the installed driver version from the deterministic script or Appium CLI output.

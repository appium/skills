---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/uiautomator2/uiautomator2-driver-install.md"
id: appium.setup.references.uiautomator2.uiautomator2-driver-install
name: "uiautomator2-driver-install"
description: "Install and verify the Appium UiAutomator2 driver in global command mode"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/uiautomator2/uiautomator2-driver-install.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/uiautomator2/uiautomator2-driver-install.md bounded command output, local paths, driver names, IDs, and logs

---

# uiautomator2-driver-install

## Install Driver

Use global Appium mode unless the user explicitly asks for local `npx` mode:

```bash
npm install -g appium@3.5.2
appium driver install uiautomator2
```

If the driver already exists, continue to verification.

## Verify Driver

```bash
node tools/appium/setup/scripts/check-uiautomator2-env.mjs
```

Driver setup is valid when `summary.driverInstalled` is true and `summary.driverVersion` is populated. If `summary.needsUnsandboxedAppiumHome` is true, rerun outside the managed sandbox or use `appium driver list --installed`.

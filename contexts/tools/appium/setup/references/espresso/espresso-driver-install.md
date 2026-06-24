---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/espresso/espresso-driver-install.md"
id: appium.setup.references.espresso.espresso-driver-install
name: "espresso-driver-install"
description: "Install and verify the Appium Espresso driver in global command mode"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/espresso/espresso-driver-install.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/espresso/espresso-driver-install.md bounded command output, local paths, driver names, IDs, and logs

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

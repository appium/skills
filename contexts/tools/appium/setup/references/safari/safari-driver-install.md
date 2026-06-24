---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/safari/safari-driver-install.md"
id: appium.setup.references.safari.safari-driver-install
name: "safari-driver-install"
description: "Install and validate Appium Safari driver and safaridriver"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/safari/safari-driver-install.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/safari/safari-driver-install.md bounded command output, local paths, driver names, IDs, and logs

---

# safari-driver-install

## Validate Safari Tooling

```bash
sw_vers
safaridriver --version
```

## Install Driver

```bash
npm install -g appium@3.5.2
appium driver install safari
appium driver list --installed --json
```

The installed list must include `safari`. If doctor is supported for the installed driver, required fixes must be zero; otherwise report `not-supported`.

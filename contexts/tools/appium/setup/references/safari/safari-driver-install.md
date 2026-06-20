---
owner: appium
id: appium.setup.references.safari.safari-driver-install
name: "safari-driver-install"
description: "Install and validate Appium Safari driver and safaridriver"

---

# safari-driver-install

## Validate Safari Tooling

```bash
sw_vers
safaridriver --version
```

## Install Driver

```bash
npm install -g appium
appium driver install safari
appium driver list --installed --json
```

The installed list must include `safari`. If doctor is supported for the installed driver, required fixes must be zero; otherwise report `not-supported`.

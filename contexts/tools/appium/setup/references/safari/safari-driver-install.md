---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.safari.safari-driver-install
name: "safari-driver-install"
description: "Install and validate Appium Safari driver"

---

# safari-driver-install

## Install Driver

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
appium driver install safari
appium driver list --installed --json
```

The installed list must include `safari`. Safari browser prerequisites must satisfy `contexts/browser/safari/prereqs.md`. If doctor is supported for the installed driver, required fixes must be zero; otherwise report `not-supported`.

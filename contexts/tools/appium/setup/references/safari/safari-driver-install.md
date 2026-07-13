---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.safari.safari-driver-install
name: "safari-driver-install"
description: "Install and validate Appium Safari driver"

---

# safari-driver-install

## Install Driver

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install -g "appium@$APPIUM_VERSION"
appium driver install safari
appium driver list --installed --json
```

The installed list must include `safari`. Safari browser prerequisites must satisfy `contexts/browser/safari/prereqs.md`. If doctor is supported for the installed driver, required fixes must be zero; otherwise report `not-supported`.

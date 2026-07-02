---
owner: appium
id: appium.setup.references.safari.safari-driver-install
name: "safari-driver-install"
description: "Install and validate Appium Safari driver"

---

# safari-driver-install

## Install Driver

```bash
npm install -g appium
appium driver install safari
appium driver list --installed --json
```

The installed list must include `safari`. Safari browser prerequisites must satisfy `contexts/browser/safari/prereqs.md`. If doctor is supported for the installed driver, required fixes must be zero; otherwise report `not-supported`.

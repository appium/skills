---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.mac2.mac2-driver-doctor
name: "mac2-driver-doctor"
description: "Install and validate Appium Mac2 driver and doctor behavior"

---

# mac2-driver-doctor

## Install And List

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install -g "appium@$APPIUM_VERSION"
appium driver install mac2
appium driver list --installed --json
```

The installed list must include `mac2`.

## Doctor

```bash
appium driver doctor mac2
```

Use `0 required fixes needed` as the pass/fail gate. Optional warnings are non-blocking, but report them if they affect the requested target app.

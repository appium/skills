---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.xcuitest.xcuitest-driver-doctor
name: "xcuitest-driver-doctor"
description: "Install and validate Appium XCUITest driver and doctor required fixes"

---

# xcuitest-driver-doctor

## Install And List

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install -g "appium@$APPIUM_VERSION"
appium driver install xcuitest
appium driver list --installed --json
```

The installed list must include `xcuitest`.

## Doctor Gate

```bash
appium driver doctor xcuitest
```

Completion requires `0 required fixes needed`. If wording changes, try `--json`; if still ambiguous, mark `needs-manual-review` and do not mark complete.

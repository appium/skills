---
owner: appium
id: appium.setup.references.xcuitest.xcuitest-driver-doctor
name: "xcuitest-driver-doctor"
description: "Install and validate Appium XCUITest driver and doctor required fixes"

---

# xcuitest-driver-doctor

## Install And List

```bash
npm install -g appium
appium driver install xcuitest
appium driver list --installed --json
```

The installed list must include `xcuitest`.

## Doctor Gate

```bash
appium driver doctor xcuitest
```

Completion requires `0 required fixes needed`. If wording changes, try `--json`; if still ambiguous, mark `needs-manual-review` and do not mark complete.

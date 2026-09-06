---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.xcuitest.xcuitest-driver-doctor
name: "xcuitest-driver-doctor"
description: "Install and validate Appium XCUITest driver and doctor required fixes"

---

# xcuitest-driver-doctor

## Install And List

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
appium driver install xcuitest
appium driver list --installed --json
```

The installed list must include `xcuitest`.

## Doctor Gate

```bash
appium driver doctor xcuitest
```

Completion requires `0 required fixes needed`. If wording changes, try `--json`; if still ambiguous, mark `needs-manual-review` and do not mark complete.

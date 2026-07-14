---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.chromium.chromium-driver-validation
name: "chromium-driver-validation"
description: "Install and validate Appium Chromium driver and doctor behavior"

---

# chromium-driver-validation

## Install And List

Use the selected command profile. First list installed drivers in that mode. If
`chromium` is already listed, skip every install command below. If Appium or the
driver is missing, run only the applicable install after the setup request authorizes
that change. The global default is:

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install -g "appium@$APPIUM_VERSION"
appium driver list --installed --json
appium driver install chromium  # only when the installed list does not include chromium
```

In explicitly selected local mode, run from the project root. Install or upgrade the
project-local Appium dependency only when project dependency changes are authorized,
then use the existing local CLI without download fallback:

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install --save-dev "appium@$APPIUM_VERSION"  # only when missing or an approved upgrade is required
npx --no-install appium driver list --installed --json
npx --no-install appium driver install chromium  # only when the installed list does not include chromium
```

The installed list must include `chromium`.

## Doctor

```bash
appium driver doctor chromium
```

In local mode use `npx --no-install appium driver doctor chromium`.

Use `0 required fixes needed` as the pass/fail gate when doctor is supported. If doctor is unsupported by the installed driver, report `not-supported` and continue only if install/list/smoke checks pass.

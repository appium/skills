---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.chromium.chromium-driver-validation
name: "chromium-driver-validation"
description: "Install and validate Appium Chromium driver and doctor behavior"

---

# chromium-driver-validation

## Install And List

Use the selected command profile. Inspect the global default with:

```bash
appium -v
appium driver list --installed --json
```

If Appium is missing or needs an approved upgrade, install its approved exact version:

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install -g "appium@$APPIUM_VERSION"
```

If the installed list does not include `chromium`, install the driver, then list again:

```bash
appium driver install chromium
appium driver list --installed --json
```

In explicitly selected local mode, run the inspection from the project root without
download fallback:

```bash
npx --no-install appium -v
npx --no-install appium driver list --installed --json
```

If local Appium is missing or needs an approved upgrade, change the project dependency
only when that change is authorized:

```bash
: "${APPIUM_VERSION:?Set APPIUM_VERSION to the project's approved exact Appium 3.x version}"
npm install --save-dev "appium@$APPIUM_VERSION"
```

If the local installed list does not include `chromium`, install it through the local
CLI, then list again:

```bash
npx --no-install appium driver install chromium
npx --no-install appium driver list --installed --json
```

In either mode, an already listed `chromium` driver satisfies the install-state gate;
skip the corresponding install command. The final installed list must include
`chromium`.

## Doctor

```bash
appium driver doctor chromium
```

In local mode use `npx --no-install appium driver doctor chromium`.

Use `0 required fixes needed` as the pass/fail gate when doctor is supported. If doctor is unsupported by the installed driver, report `not-supported` and continue only if install/list/smoke checks pass.

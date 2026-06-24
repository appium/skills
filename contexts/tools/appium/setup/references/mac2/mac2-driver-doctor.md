---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/mac2/mac2-driver-doctor.md"
id: appium.setup.references.mac2.mac2-driver-doctor
name: "mac2-driver-doctor"
description: "Install and validate Appium Mac2 driver and doctor behavior"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/mac2/mac2-driver-doctor.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/mac2/mac2-driver-doctor.md bounded command output, local paths, driver names, IDs, and logs

---

# mac2-driver-doctor

## Install And List

```bash
npm install -g appium@3.5.2
appium driver install mac2
appium driver list --installed --json
```

The installed list must include `mac2`.

## Doctor

```bash
appium driver doctor mac2
```

Use `0 required fixes needed` as the pass/fail gate. Optional warnings are non-blocking, but report them if they affect the requested target app.

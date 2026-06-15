---
name: "safari-01"
description: "Preserved safari setup procedure part 1 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# safari Part 1

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-safari.md; strip this generated header when comparing -->

---
name: "environment-setup-safari"
description: "Set up and validate Appium Safari Driver for macOS Safari and optional iOS Safari targets using Apple's safaridriver"
last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# appium-safari-environment-setup

## Goal

Prepare Appium Safari Driver by validating Node/npm, Appium 3, `safaridriver`, Safari driver installation, and smoke checks.

## Decision Tree

- If host OS is not macOS: stop. Safari driver setup is macOS-only because it depends on Apple's `safaridriver`.
- If Node.js misses `appium` or `appium-safari-driver` engines: install active LTS through `environment-setup-node`.
- If Appium CLI is not installed: install `appium` globally.
- If Appium major version is `< 3`: upgrade Appium to 3.x before installing or validating `safari`.
- If `safaridriver` is missing: stop and ask the user to install or repair Safari/macOS.
- If Safari automation has not been enabled: run `safaridriver --enable` only after the user accepts the macOS authorization prompt.
- If the `safari` driver is not installed: install it with `appium driver install safari`.
- If `appium driver doctor safari` is unsupported: mark doctor as `not-supported` and continue with install/list, `safaridriver`, and smoke checks.

## Procedure

1. **Validate macOS and Node/Appium prerequisites**

   ```bash
   uname -s
   node -v
   npm -v
   npm ping
   appium -v
   npm view appium-safari-driver engines appium --json
   ```


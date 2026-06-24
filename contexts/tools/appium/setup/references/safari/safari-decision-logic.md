---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/safari/safari-decision-logic.md"
id: appium.setup.references.safari.safari-decision-logic
name: "safari-decision-logic"
description: "macOS-only Safari Appium setup gates and authorization boundaries"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/safari/safari-decision-logic.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/safari/safari-decision-logic.md bounded command output, local paths, driver names, IDs, and logs

---

# safari-decision-logic

## Decision Logic

- If host OS is not macOS: stop.
- If Node.js or npm needs repair: run `contexts/tools/appium/setup/node-environment.md`.
- If Appium CLI is missing or Appium major version is `< 3`: install or upgrade global Appium.
- If `safaridriver` is missing: stop and repair Safari/macOS tooling.
- Run `safaridriver --enable` only when Safari automation is not enabled and the user can accept the macOS authorization prompt.
- If the `safari` Appium driver is missing: install it with Appium CLI.

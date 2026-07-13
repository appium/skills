---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.safari.safari-decision-logic
name: "safari-decision-logic"
description: "macOS-only Safari Appium setup gates and authorization boundaries"

---

# safari-decision-logic

## Decision Logic

- If host OS is not macOS: stop.
- If Node.js or npm needs repair: run `contexts/tools/appium/setup-basics.md`.
- If Appium CLI is missing or Appium major version is `< 3`: install or upgrade global Appium.
- Validate Safari browser prerequisites with `contexts/browser/safari/prereqs.md`.
- If the `safari` Appium driver is missing: install it with Appium CLI.

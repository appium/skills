---
owner: appium
id: appium.setup.references.safari.safari-decision-logic
name: "safari-decision-logic"
description: "macOS-only Safari Appium setup gates and authorization boundaries"

---

# safari-decision-logic

## Decision Logic

- If host OS is not macOS: stop.
- If Node.js or npm needs repair: run `environment-setup-node.md`.
- If Appium CLI is missing or Appium major version is `< 3`: install or upgrade global Appium.
- If `safaridriver` is missing: stop and repair Safari/macOS tooling.
- Run `safaridriver --enable` only when Safari automation is not enabled and the user can accept the macOS authorization prompt.
- If the `safari` Appium driver is missing: install it with Appium CLI.

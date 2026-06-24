---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/xcuitest/xcuitest-decision-logic.md"
id: appium.setup.references.xcuitest.xcuitest-decision-logic
name: "xcuitest-decision-logic"
description: "macOS-only XCUITest setup gates and optional dependency boundaries"
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/setup/references/xcuitest/xcuitest-decision-logic.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/xcuitest/xcuitest-decision-logic.md bounded command output, local paths, driver names, IDs, and logs

---

# xcuitest-decision-logic

## Decision Logic

- If host OS is not macOS: stop.
- If Xcode is missing or command-line tools are unconfigured: install or configure them before continuing.
- If Node.js or npm needs repair: run `contexts/tools/appium/setup/node-environment.md`.
- If Appium CLI or `xcuitest` driver is missing: install with Appium CLI.
- If install returns "already installed": continue.
- Run `contexts/tools/appium/setup/ffmpeg-environment.md` only when the user explicitly requests media capabilities.
- Re-run `appium driver doctor xcuitest` after every fix.

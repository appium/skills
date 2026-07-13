---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.xcuitest.xcuitest-decision-logic
name: "xcuitest-decision-logic"
description: "macOS-only XCUITest setup gates and optional dependency boundaries"

---

# xcuitest-decision-logic

## Decision Logic

- If host OS is not macOS: stop.
- If Xcode is missing or command-line tools are unconfigured: install or configure them before continuing.
- If Node.js or npm needs repair: run `contexts/tools/appium/setup-basics.md`.
- If Appium CLI or `xcuitest` driver is missing: install with Appium CLI.
- If install returns "already installed": continue.
- Run `contexts/tools/ffmpeg/setup.md` only when the user explicitly requests media capabilities.
- Re-run `appium driver doctor xcuitest` after every fix.

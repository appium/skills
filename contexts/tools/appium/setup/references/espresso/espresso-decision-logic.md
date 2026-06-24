---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/espresso/espresso-decision-logic.md"
id: appium.setup.references.espresso.espresso-decision-logic
name: "espresso-decision-logic"
description: "Espresso setup triggers, dependency order, optional boundaries, and pass/fail gates"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/espresso/espresso-decision-logic.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/espresso/espresso-decision-logic.md bounded command output, local paths, driver names, IDs, and logs

---

# espresso-decision-logic

## Decision Logic

- If host OS is not macOS, Linux, or Windows: stop.
- Before Espresso-specific steps, complete the shared Node/Appium setup in `contexts/tools/appium/setup/node-environment.md` and the Android prerequisite checks in `contexts/tools/appium/setup/references/environment-setup-android.md`.
- Use global npm/Appium unless the user explicitly asks for `npx appium`.
- If Appium CLI is missing: install `appium` globally under the active Node runtime.
- If the `espresso` driver is not installed: install it with Appium CLI.
- If install returns "already installed": continue.
- If doctor reports required fixes: resolve each required item and re-run doctor.
- Optional FFmpeg and bundletool setup is only for explicitly requested capabilities.

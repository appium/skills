---
owner: appium
id: appium.setup.references.espresso.espresso-decision-logic
name: "espresso-decision-logic"
description: "Espresso setup triggers, dependency order, optional boundaries, and pass/fail gates"

---

# espresso-decision-logic

## Decision Logic

- If host OS is not macOS, Linux, or Windows: stop.
- Before Espresso-specific steps, complete the shared Node/Appium setup in `contexts/tools/appium/setup-basics.md` and the Android prerequisite checks in `contexts/platform/android/emulator-setup.md`.
- Use global npm/Appium unless the user explicitly asks for `npx appium`.
- If Appium CLI is missing: install `appium` globally under the active Node runtime.
- If the `espresso` driver is not installed: install it with Appium CLI.
- If install returns "already installed": continue.
- If doctor reports required fixes: resolve each required item and re-run doctor.
- Optional FFmpeg and bundletool setup is only for explicitly requested capabilities.

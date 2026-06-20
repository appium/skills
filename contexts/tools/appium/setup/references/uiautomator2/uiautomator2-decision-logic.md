---
owner: appium
id: appium.setup.references.uiautomator2.uiautomator2-decision-logic
name: "uiautomator2-decision-logic"
description: "UiAutomator2 setup triggers, dependency order, optional boundaries, and pass/fail gates"

---

# uiautomator2-decision-logic

## Decision Logic

- If host OS is not macOS, Linux, or Windows: stop.
- Run `contexts/tools/appium/setup/node-environment.md`, then `contexts/tools/appium/setup/references/environment-setup-android.md`, before driver-specific steps.
- Use global npm/Appium unless the user explicitly asks for `npx appium`.
- If Appium CLI is missing: install `appium` globally under the active Node runtime.
- If the `uiautomator2` driver is not installed: install it with Appium CLI.
- If install returns "already installed": ignore that condition and continue.
- If doctor reports required fixes: resolve each required item, then re-run the deterministic check.
- Optional FFmpeg, bundletool, GStreamer, and screen-streaming warnings are non-blocking unless requested.

## Deterministic Check

Use `node tools/appium/setup/scripts/check-uiautomator2-env.mjs` for read-only status. Treat `summary.requiredOk` as the pass gate. If `summary.needsUnsandboxedAppiumHome` is true, rerun outside the managed sandbox before deciding the driver is missing.

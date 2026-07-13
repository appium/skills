---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.gecko.gecko-decision-logic
name: "gecko-decision-logic"
description: "Decide Gecko setup path from host OS, Appium mode, Firefox channel, and GeckoDriver state"

---

# gecko-decision-logic

## Inputs To Confirm

- Host OS and shell.
- Global Appium mode (`appium`) or explicit local mode (`npx appium`).
- Target Firefox channel: release, ESR, Developer Edition, Nightly, or user-specified executable path.
- Whether the user requested browser installation or only validation.

## Required Gates

1. Node.js and npm satisfy `contexts/tools/appium/setup-basics.md`.
2. `appium -v` succeeds and Appium major version is `>= 3`.
3. `appium driver list --installed` includes `gecko`.
4. A Firefox executable is available or the user provides one through capabilities.
5. `appium driver doctor gecko` has `0 required fixes needed` when the installed driver supports doctor checks.

## GeckoDriver Handling

Appium Gecko Driver can manage GeckoDriver in normal flows, but an externally installed `geckodriver` may still be useful for diagnostics or constrained hosts. Treat missing `geckodriver` as non-blocking unless the selected driver version, doctor output, or user request requires it.

## Decisions

- If Firefox is missing, ask before installing it.
- If the user provides a Firefox executable path, validate that path before installing another browser.
- If doctor is unsupported, continue only when Appium version, driver installation, Firefox availability, and smoke checks pass.
- If Linux browser startup fails, load `contexts/browser/firefox/prereqs.md` and validate shared library/display prerequisites before retrying sessions.

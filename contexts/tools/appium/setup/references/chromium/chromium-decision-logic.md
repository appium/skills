---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.chromium.chromium-decision-logic
name: "chromium-decision-logic"
description: "Chromium Appium setup triggers, browser gates, and driver validation strategy"

---

# chromium-decision-logic

## Decision Logic

- If host OS is not macOS, Linux, or Windows: stop.
- If Node.js or npm does not satisfy Appium/Chromium driver engines: run `contexts/tools/appium/setup-basics.md`.
- If Appium CLI is missing or Appium major version is `< 3`: install or upgrade global Appium in the default profile; in local mode, use the project's package manager only when dependency-file changes are authorized, otherwise report a blocker.
- If `chromium` driver is missing: install it through the Appium CLI selected by the command profile.
- If no Chrome, Chromium, or Edge browser is available: install one appropriate to the host.
- For Microsoft Edge, use a matching `msedgedriver` through `appium:executable`; automatic chromedriver download does not cover Edge.
- If `appium driver doctor chromium` is unsupported, mark doctor as `not-supported` and rely on install/list/smoke checks.
- Before the smoke session, determine whether Chromium would download `chromedriver` or `msedgedriver`; obtain approval before that download or use an already available compatible executable.

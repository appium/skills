---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.environment-setup-chromium
name: "environment-setup-chromium"
description: "Route Appium Chromium driver setup, browser prerequisites, doctor handling, and smoke checks"
optional_context:
  - contexts/tools/appium/setup-basics.md
  - contexts/browser/chromium/prereqs.md
  - contexts/tools/appium/setup/references/chromium/chromium-decision-logic.md
  - contexts/tools/appium/setup/references/chromium/chromium-driver-validation.md
  - contexts/tools/appium/setup/references/chromium/chromium-smoke-status.md

---

# appium-chromium-environment-setup

## Goal

Prepare Appium Chromium Driver by validating Node/Appium, browser availability, driver installation, optional doctor checks, and server smoke evidence.

## Routing

Load these references in order:

1. `contexts/tools/appium/setup-basics.md` for Node.js and npm.
2. `contexts/tools/appium/setup/references/chromium/chromium-decision-logic.md` for host, Appium, browser, and Edge-driver gates.
3. `contexts/browser/chromium/prereqs.md` for Chrome, Chromium, Edge, and Linux dependency setup.
4. `contexts/tools/appium/setup/references/chromium/chromium-driver-validation.md` for Appium driver installation and doctor handling.
5. `contexts/tools/appium/setup/references/chromium/chromium-smoke-status.md` for `/status`, log evidence, and cleanup.

## Validation Command

```bash
node tools/appium/setup/scripts/check-chromium-env.mjs
```

Use `summary.requiredOk: true` as the read-only setup gate before smoke checks.

## Completion Criteria

- `appium -v` succeeds and Appium major version is `>= 3`.
- Installed driver list includes `chromium`.
- At least one supported Chromium browser is available.
- Doctor reports `0 required fixes needed` when supported; otherwise install/list/smoke checks are the blocking gate.
- `/status` returns a successful response and logs include `Available drivers:` with `chromium`.

## Constraints

Use global npm/Appium by default. Use `npx appium` only when explicitly requested. Ask before privileged package-manager commands.

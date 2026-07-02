---
owner: appium
id: appium.setup.references.environment-setup-safari
name: "environment-setup-safari"
description: "Route Appium Safari driver setup for macOS Safari and optional iOS Safari targets"

---

# appium-safari-environment-setup

## Goal

Prepare Appium Safari Driver by validating macOS, Node/Appium, Safari prerequisites, Safari driver installation, optional doctor behavior, and smoke checks.

## Routing

Load these references in order:

1. `contexts/tools/appium/setup-basics.md` for Node.js and npm.
2. `contexts/tools/appium/setup/references/safari/safari-decision-logic.md` for macOS-only gates and authorization boundaries.
3. `contexts/browser/safari/prereqs.md` for Safari and `safaridriver` availability plus authorization boundaries.
4. `contexts/tools/appium/setup/references/safari/safari-driver-install.md` for Appium Safari driver installation.
5. `contexts/tools/appium/setup/references/safari/safari-smoke-status.md` for `/status`, log evidence, and cleanup.

## Validation Command

```bash
node tools/appium/setup/scripts/check-safari-env.mjs
```

Use `summary.requiredOk: true` as the read-only setup gate before smoke checks. The script does not enable Safari automation because that changes host authorization state.

## Completion Criteria

- Host OS is macOS.
- `safaridriver --version` succeeds.
- Safari automation is enabled when needed.
- `appium -v` succeeds and installed driver list includes `safari`.
- Doctor passes when supported; unsupported doctor behavior is reported.
- `/status` returns readiness and logs include `Available drivers:` with `safari`.

## Constraints

macOS only. Use global npm/Appium by default. Use `npx appium` only when explicitly requested. Require explicit human approval before privileged elevation.

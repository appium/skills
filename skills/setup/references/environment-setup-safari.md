---
name: "environment-setup-safari"
description: "Route Appium Safari driver setup for macOS Safari and optional iOS Safari targets"
---

# appium-safari-environment-setup

## Goal

Prepare Appium Safari Driver by validating macOS, Node/Appium, `safaridriver`, Safari driver installation, optional doctor behavior, and smoke checks.

## Routing

Load these references in order:

1. `environment-setup-node.md` for Node.js and npm.
2. `safari/safari-decision-logic.md` for macOS-only gates and authorization boundaries.
3. `safari/safari-driver-install.md` for Appium Safari driver installation and `safaridriver` checks.
4. `safari/safari-smoke-status.md` for `/status`, log evidence, and cleanup.

## Validation Command

```bash
node skills/setup/scripts/check-safari-env.mjs
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

macOS only. Use global npm/Appium by default. Use `npx appium` only when explicitly requested. Do not use `sudo` unless the user explicitly asks.

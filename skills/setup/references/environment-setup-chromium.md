---
name: "environment-setup-chromium"
description: "Route Appium Chromium driver setup, browser prerequisites, doctor handling, and smoke checks"
---

# appium-chromium-environment-setup

## Goal

Prepare Appium Chromium Driver by validating Node/Appium, browser availability, driver installation, optional doctor checks, and server smoke evidence.

## Routing

Load these references in order:

1. `environment-setup-node.md` for Node.js and npm.
2. `chromium/chromium-decision-logic.md` for host, Appium, browser, and Edge-driver gates.
3. `chromium/chromium-browser-prereqs.md` for Chrome, Chromium, Edge, and Linux dependency setup.
4. `chromium/chromium-driver-validation.md` for Appium driver installation and doctor handling.
5. `chromium/chromium-smoke-status.md` for `/status`, log evidence, and cleanup.

## Completion Criteria

- `appium -v` succeeds and Appium major version is `>= 3`.
- Installed driver list includes `chromium`.
- At least one supported Chromium browser is available.
- Doctor reports `0 required fixes needed` when supported; otherwise install/list/smoke checks are the blocking gate.
- `/status` returns a successful response and logs include `Available drivers:` with `chromium`.

## Constraints

Use global npm/Appium by default. Use `npx appium` only when explicitly requested. Ask before privileged package-manager commands.

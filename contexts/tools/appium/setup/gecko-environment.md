---
owner: appium
id: setup-references-environment-setup-gecko
status: stable

---

# Gecko Environment

## Goal

Prepare Appium Gecko Driver by validating Node/Appium, Firefox availability, driver installation, optional GeckoDriver availability, doctor checks, and server smoke evidence.

## Routing

1. `contexts/tools/appium/setup/node-environment.md` for Node.js and npm.
2. `contexts/tools/appium/setup/references/gecko/gecko-decision-logic.md` for host, Appium, Firefox, and GeckoDriver gates.
3. `contexts/tools/appium/setup/references/gecko/gecko-browser-prereqs.md` for Firefox release, ESR, Developer Edition, Nightly, and Linux dependency setup.
4. `contexts/tools/appium/setup/references/gecko/gecko-driver-validation.md` for Appium driver installation and doctor handling.
5. `contexts/tools/appium/setup/references/gecko/gecko-smoke-status.md` for `/status`, log evidence, and cleanup.

## Validation Command

```bash
node tools/appium/setup/scripts/check-gecko-env.mjs
```

Treat `summary.requiredOk: true` as the read-only setup gate before running smoke checks.

## Completion Criteria

- `appium -v` succeeds and Appium major version is `>= 3`.
- Installed driver list includes `gecko`.
- At least one supported Firefox browser is available.
- Doctor reports `0 required fixes needed` when supported; otherwise install/list/Firefox/smoke checks are the blocking gate.
- `/status` returns a successful response and logs include `Available drivers:` with `gecko`.

## Constraints

- Use global npm/Appium by default.
- Use `npx appium` only when explicitly requested.
- Ask before privileged package-manager commands or browser installs.
- Do not install optional Firefox channels unless the user requests that channel.

## Self-Improvement Prompt

Run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing Gecko setup instruction with the section and proposed wording. Do not edit the skill unless asked.

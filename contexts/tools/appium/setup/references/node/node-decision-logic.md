---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/node/node-decision-logic.md"
id: appium.setup.references.node.node-decision-logic
name: "node-decision-logic"
description: "Node.js and npm setup triggers for Appium environment setup"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/node/node-decision-logic.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/node/node-decision-logic.md bounded command output, local paths, driver names, IDs, and logs

---

# node-decision-logic

## Decision Logic

- If `node` is missing or active Node major version is `< 20`: install or switch to active LTS.
- If a maintained version manager exists (`nvm`, `fnm`, or `asdf`): use it to install or switch Node versions.
- If no Node version manager is available on Windows: install `fnm` with `winget` non-interactively.
- If Windows PowerShell cannot find `node` after `fnm` setup: configure the user PowerShell profile.
- If `npm` is unavailable: repair npm before continuing.
- If `npm ping` fails: resolve registry or network configuration before package installs.
- If a calling Appium driver skill has stricter engine ranges: validate those ranges before installing drivers.

## Deterministic Check

Run:

```bash
node tools/appium/setup/scripts/check-node-env.mjs
```

Use `summary.requiredOk` as the read-only setup gate and inspect `checks.npmPing` before package installation.

---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/node/node-npm-health.md"
id: appium.setup.references.node.node-npm-health
name: "node-npm-health"
description: "Validate npm availability, registry connectivity, and Windows PowerShell script policy"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/node/node-npm-health.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/node/node-npm-health.md bounded command output, local paths, driver names, IDs, and logs

---

# node-npm-health

## npm Checks

Run:

```bash
node tools/appium/setup/scripts/check-node-env.mjs
```

The check captures `npm -v`, `npm config get registry`, and `npm ping`.

## Registry Failures

If `npm ping` fails, report the registry URL and error. Resolve proxy, registry, authentication, or network policy before installing Appium packages.

## Windows PowerShell Policy

If npm fails with `npm.ps1 cannot be loaded`, repair only the current user scope:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

Re-run validation after the policy change.

---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/node/node-validation-evidence.md"
id: appium.setup.references.node.node-validation-evidence
name: "node-validation-evidence"
description: "Final Node.js and npm validation evidence for setup completion"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/node/node-validation-evidence.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/node/node-validation-evidence.md bounded command output, local paths, driver names, IDs, and logs

---

# node-validation-evidence

## Final Validation

Run:

```bash
node tools/appium/setup/scripts/check-node-env.mjs
```

Completion requires `summary.requiredOk: true`. If `summary.npmConnectivityOk` is false, do not install packages until the registry or network issue is handled.

## Evidence

Report:

- `host.platform` and `host.arch`
- `executables.node` and `executables.npm`
- `versions.node` and `versions.npm`
- detected version manager
- npm registry
- npm ping result
- engine compatibility result requested by the calling setup reference

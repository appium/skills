---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.node.node-validation-evidence
name: "node-validation-evidence"
description: "Final Node.js and npm validation evidence for setup completion"

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

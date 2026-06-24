---
owner: appium
policy_scope: "contexts/tools/appium/setup/node-environment.md"
id: setup-references-environment-setup-node
status: stable
source: contexts/tools/appium/setup/node-environment.md
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/node-environment.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/node-environment.md bounded command output, local paths, driver names, IDs, and logs

---

# Node Environment

## Goal

Prepare a stable Node.js and npm environment by validating the active runtime, npm availability, registry connectivity, and engine compatibility needed by Appium setup workflows.

## Routing

Load these references in order:

1. `contexts/tools/appium/setup/references/node/node-decision-logic.md` for version, package-manager, and install triggers.
2. `contexts/tools/appium/setup/references/node/node-version-manager-setup.md` for `nvm`, `fnm`, `asdf`, and Windows `winget` setup.
3. `contexts/tools/appium/setup/references/node/node-npm-health.md` for npm availability, registry checks, and PowerShell policy repair.
4. `contexts/tools/appium/setup/references/node/node-validation-evidence.md` for final evidence and completion criteria.

For deterministic read-only validation, run:

```bash
node tools/appium/setup/scripts/check-node-env.mjs
```

## Completion Criteria

- `node -v` succeeds.
- Active Node major version is `>= 20`.
- `npm -v` succeeds.
- `npm ping` succeeds or a registry/network problem is explicitly reported.
- Any calling Appium driver skill's Node engine requirements are satisfied.
- On Windows, npm PowerShell script policy errors are repaired with CurrentUser scope only.

## Evidence To Report

Report OS, architecture, shell, `node -v`, `npm -v`, active Node executable path, active npm executable path, detected version manager, npm registry, npm ping result, and any engine-range compatibility issue.

## Constraints

Prefer maintained LTS Node versions and user-space installs. Avoid privileged elevation. Use global npm/Appium mode unless the user explicitly asks for local `npx` mode.

---
id: setup-references-environment-setup-node
owner: skills/setup
status: active
source: skills/setup/references/environment-setup-node.md
---

# environment-setup-node

## Goal

Prepare a stable Node.js and npm environment by validating the active runtime, npm availability, registry connectivity, and engine compatibility needed by Appium setup workflows.

## Routing

Load these references in order:

1. `node/node-decision-logic.md` for version, package-manager, and install triggers.
2. `node/node-version-manager-setup.md` for `nvm`, `fnm`, `asdf`, and Windows `winget` setup.
3. `node/node-npm-health.md` for npm availability, registry checks, and PowerShell policy repair.
4. `node/node-validation-evidence.md` for final evidence and completion criteria.

For deterministic read-only validation, run:

```bash
node skills/setup/scripts/check-node-env.mjs
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

Prefer maintained LTS Node versions and user-space installs. Avoid `sudo`. Use global npm/Appium mode unless the user explicitly asks for local `npx` mode.

---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.basics
status: stable
source: contexts/tools/appium/setup-basics.md
optional_context:
  - contexts/tools/appium/setup/references/node/node-decision-logic.md
  - contexts/tools/appium/setup/references/node/node-version-manager-setup.md
  - contexts/tools/appium/setup/references/node/node-npm-health.md
  - contexts/tools/appium/setup/references/node/node-validation-evidence.md

---

# Appium Setup Basics

## Goal

Prepare the shared Appium setup baseline by validating the active Node.js runtime, npm availability, registry connectivity, command mode, and engine compatibility needed by Appium setup workflows.

## Routing

Start with the read-only readiness helper, or reuse equivalent current-run
evidence from the calling driver helper:

```bash
node tools/appium/setup/scripts/check-node-env.mjs
```

If Node is missing and the helper cannot run, use shell detection as evidence.
Load only the references needed for failed or unresolved checks:

- `contexts/tools/appium/setup/references/node/node-decision-logic.md` when Node,
  npm, or engine compatibility needs repair; read it before making changes.
- `contexts/tools/appium/setup/references/node/node-version-manager-setup.md`
  when Node must be installed or switched.
- `contexts/tools/appium/setup/references/node/node-npm-health.md` for npm,
  registry, or Windows PowerShell policy failures.
- `contexts/tools/appium/setup/references/node/node-validation-evidence.md`
  when the helper's evidence needs interpretation.

## Appium Version Selection

Keep an existing compatible Appium installation. When installation or an upgrade
is needed, resolve `APPIUM_VERSION` to an exact version before running an install:

1. Honor an explicit user version or project policy. Inspect the target project's
   dependency manifest, lockfile, and setup documentation for an Appium pin; do
   not treat this skills repository as the target project by default.
2. If a project range is specified, use its compatible locked version, or resolve
   an exact version within that range from npm package metadata.
3. If there is no pin or project approval requirement, select the latest stable
   Appium 3.x version compatible with the selected driver and host Node/npm engine
   ranges using current package metadata. Record the exact version and source.
4. If pins conflict, compatibility cannot be established, or project policy
   requires an approval not yet given, report the specific blocker and needed
   decision. Do not invent an approved version or silently replace a pin.

In local mode, dependency-file changes still require authorization under the
local command profile. Resolving a version does not authorize an unrelated upgrade.

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

Prefer maintained LTS Node versions and user-space installs. Require explicit human approval before any privileged elevation. Use global npm/Appium mode unless the user explicitly asks for local `npx` mode.

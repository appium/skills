---
name: "node-environment-setup"
description: "Prepare and validate Node.js and npm environment"
metadata:
  last_modified: "Sun, 08 Mar 2026 07:00:00 GMT"

---
# node-environment-setup

## Goal
Prepares a stable Node.js and npm environment by validating the active Node runtime, confirming npm availability, and checking basic npm connectivity and health diagnostics.

## Decision Logic
- If `node` is missing or major version is `< 20`: install/upgrade Node.js to active LTS.
- If a maintained Node version manager exists (`nvm`, `fnm`, `asdf`): use it as the primary way to install/switch Node versions.
- If no Node version manager is available: ask the user to adopt a Node version management tool before continuing with persistent setup.
- If `npm` is unavailable: repair npm environment before continuing.
- If `npm ping` fails: resolve registry/network configuration before continuing.

## Instructions
1. **Detect Node version management tools**
   ```bash
   command -v nvm || true
   command -v fnm || true
   command -v asdf || true
   ```
   Prefer this order when available: `fnm` / `nvm` / `asdf`.
   If none is available, ask the user whether to proceed with a version manager setup first (recommended) or continue with current system Node.

2. **Verify Node and npm availability**
   ```bash
   node -v
   npm -v
   ```

3. **Validate npm connectivity**
   ```bash
   npm ping
   ```
   Ensure connectivity succeeds before continuing.

4. **Validate active Node runtime details**
   ```bash
   node -p 'process.versions.node'
   ```
   Confirm the runtime is an active LTS release; if not, switch Node version using the detected version manager.

5. **Agent completion criteria**
   Mark complete only when all are true:
   - `node -v` and `npm -v` succeed
   - npm registry connectivity check succeeds (`npm ping`)
   - active Node runtime is an LTS release

## Constraints
- Prefer Node.js LTS versions only.
- Prefer maintained version-managed Node installations (`fnm`, `nvm`, `asdf`) when available.
- Avoid using `sudo` in setup commands; prefer user-space tooling when permissions are restricted.
- Use deterministic terminal checks, not assumptions.

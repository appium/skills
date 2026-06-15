---
name: "node-03"
description: "Preserved node setup procedure part 3 of 4"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# node Part 3

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-node.md; strip this generated header when comparing -->

   Confirm the runtime is an active LTS release; if not, switch Node version using the detected version manager.

5. **Windows troubleshooting quick checks (when `node` is still not found)**
   ```powershell
   $PROFILE
   Test-Path $PROFILE
   Get-Content $PROFILE
   Get-Command fnm -ErrorAction SilentlyContinue
   Get-Command node -ErrorAction SilentlyContinue
   ```
   If `Get-Command node` is empty, run:
   ```powershell
   . $PROFILE
   fnm use lts-latest
   node -v
   npm -v
   ```

6. **Agent completion criteria**
   Mark complete only when all are true:
   - `node -v` and `npm -v` succeed
   - npm registry connectivity check succeeds (`npm ping`)
   - active Node runtime is an LTS release

## Evidence To Report

- host OS and shell
- detected Node version manager, if any
- `node -v`
- `npm -v`
- `node -p 'process.versions.node'`
- `npm ping` result or the registry/network issue that blocks it
- whether the active runtime satisfies the engine ranges requested by the calling Appium driver skill

## Self-Improvement Prompt

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

## Constraints
- Prefer Node.js LTS versions only.
- Prefer maintained version-managed Node installations (`fnm`, `nvm`, `asdf`) when available.
- Avoid using `sudo` in setup commands; prefer user-space tooling when permissions are restricted.

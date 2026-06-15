---
name: "environment-setup-node"
description: "Validate Node.js and npm for Appium setup"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# environment-setup-node

## Goal
Prepare the shared Node.js/npm prerequisite used by Appium setup skills.

## Procedure
1. Detect host OS and command mode. Use global `appium` by default; use `npx appium` only when the user explicitly requested local mode.
2. Run:
   - `node -v`
   - `npm -v`
   - `command -v node`
   - `command -v npm`
3. Confirm the installed Node.js version satisfies the active Appium and driver engine requirements. Prefer active LTS when installing or upgrading.
4. If Node.js or npm is missing or too old, install with a user-space method suitable for the host OS. Avoid `sudo` unless the user explicitly approves it.
5. Re-open the shell or refresh PATH, then re-run the checks from step 2.
6. Install or validate global Appium only when the selected setup path needs it:
   - `npm install -g appium`
   - `appium -v`
7. If npm itself blocks driver installs because of engine support, upgrade npm in the same command mode and re-run `npm -v`.

## Completion Criteria
- `node -v` and `npm -v` succeed.
- Node.js satisfies Appium and selected driver engine requirements.
- Global `appium -v` succeeds when global Appium mode is selected.
- Any install or upgrade command used is reported.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.

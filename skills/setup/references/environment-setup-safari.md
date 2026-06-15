---
name: "environment-setup-safari"
description: "Prepare macOS Safari automation prerequisites for Appium"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# environment-setup-safari

## Goal
Validate macOS Safari automation readiness for Appium, including safaridriver, Web Inspector, Remote Automation, and smoke checks.

## Procedure
1. Confirm host OS is macOS. Stop on Linux or Windows.
2. Complete `environment-setup-node`; use global `appium` unless local mode was requested.
3. Validate Safari tooling:
   - `safaridriver --version`
   - `which safaridriver`
   - `appium -v`
4. Enable Safari automation only with user approval when needed:
   - Safari Develop menu and "Allow Remote Automation"
   - `safaridriver --enable` if required
5. Run any Safari-specific Appium doctor or prerequisite check available in the selected Appium version. Treat required fixes as blocking and optional warnings as non-blocking.
6. Start Appium, run `/status`, and confirm the log shows Safari automation support or no Safari-specific startup error.
7. Stop Appium and verify no leftover server process remains.

## Completion Criteria
- macOS host confirmed.
- `safaridriver --version` and `appium -v` succeed.
- Remote Automation is enabled when Safari sessions are required.
- `/status` smoke check succeeds.
- Any required doctor or prerequisite fixes are resolved.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.

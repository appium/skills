---
name: "environment-setup-chromium"
description: "Prepare and validate Appium Chromium Driver"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# environment-setup-chromium

## Goal
Validate Node/Appium, the Chromium driver, browser availability, driver matching, doctor output, and `/status` smoke readiness.

## Procedure
1. Confirm host OS is macOS, Linux, or Windows.
2. Complete `environment-setup-node`; use global `appium` unless the user requested `npx appium`.
3. Validate Appium 3 or newer:
   - `appium -v`
   - `appium driver list --installed --json`
4. If the `chromium` driver is missing, run `appium driver install chromium`. Ignore "already installed" as success.
5. Detect a browser target: Chrome, Chromium, or Microsoft Edge. If no supported browser exists, ask before installing one.
6. For Edge, record installed Edge version and `msedgedriver --version`; use an absolute `appium:executable` path because automatic chromedriver download does not cover Edge.
7. Run doctor:
   - `appium driver doctor chromium --json`
   - fall back to `appium driver doctor chromium`
   Pass only with zero required fixes; optional warnings are non-blocking. If unsupported, report doctor status as `not-supported`.
8. If no chromedriver binary exists and no pinned version was requested, run `appium driver run chromium install-chromedriver`.
9. Start Appium, check `/status`, confirm `Available drivers:` includes `chromium`, then stop the server.

## Completion Criteria
- `appium -v` succeeds and major version is at least 3.
- Installed driver list includes `chromium`.
- Browser target and version are reported.
- Doctor has zero required fixes or is explicitly unsupported.
- `/status` smoke check succeeds and Appium server is cleaned up.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.

---
name: "environment-setup-chromium"
description: "Use this skill to prepare Appium Chromium Driver for desktop Chromium-based browser automation, including Appium driver installation, browser checks, and smoke validation."
---
# environment-setup-chromium

## Goal
Validate Appium 3, the Chromium driver, a supported browser, and a minimal server smoke test.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Reference Routing
Load `full-guidance-part-01.md` when detailed Chromium driver install, browser discovery, or smoke-test steps are needed.

## Do Not Use For
- Do not use for native Android, iOS, tvOS, or non-Chromium browser setup.
- Do not use for installing OS browsers without approval.

## Preflight
Capture OS, Node/npm/Appium versions, installed Appium drivers, browser executable/version, and whether Edge-specific driver setup is required.

## Instructions
1. Install or update Appium and the Chromium driver only when missing or incompatible.
2. Validate a supported Chrome, Chromium, or Edge executable.
3. Ask before OS-level browser or repository changes.

## Verification
Confirm the installed driver list includes `chromium`, then start Appium and verify `/status` plus server logs.

## Examples
- Chromium driver is missing; install it with Appium CLI, confirm the browser executable, then run the status smoke test.

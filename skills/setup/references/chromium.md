# Chromium Setup

## Goal
Validate Appium 3, the Chromium driver, a supported desktop browser, and a minimal server smoke test.

## Do Not Use For
Do not use for native Android, iOS, tvOS, or non-Chromium browser setup. Do not install OS browsers unless the user explicitly approves that package change.

## Preflight
Capture OS, Node/npm/Appium versions, installed Appium drivers, browser executable/version, and Edge-specific driver setup when relevant.

## Instructions
1. Install or update Appium and the Chromium driver only when missing or incompatible.
2. Validate a supported Chrome, Chromium, or Edge executable.
3. If `appium driver doctor chromium` is unavailable, use install/list/server smoke checks as the blocking gate.

## Verification
Verify the Chromium driver is installed, start an Appium server, confirm `/status` is ready, confirm `chromium` is installed or advertised, then stop the server.

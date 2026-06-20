---
owner: appium
name: "appium-troubleshooting"
description: "Route Appium failure diagnosis to canonical troubleshooting context assets for failed commands, session startup, app launch, driver startup, device connectivity, WebDriverAgent behavior, browser automation, locator strategy, and element lookup issues."
requires_context: contexts/tools/appium/troubleshooting/triage.md, contexts/tools/appium/troubleshooting/procedure-part1.md
---

# Appium Router Entry

## Route

Use this thin entrypoint for Appium failure diagnosis. Load `contexts/tools/appium/troubleshooting/triage.md` first, then follow `contexts/tools/appium/troubleshooting/procedure-part1.md` and the relevant profiles, references, and examples under `contexts/tools/appium/troubleshooting/`.

## When Not To Use

do not use for mismatched requests; choose the routed alternative below.

Do not use this skill for first-time environment installation; route that input to `skills/setup/SKILL.md`. Do not use this skill for real-device signing or provisioning before any failure exists; route that input to `skills/xcuitest-real-device-config/SKILL.md`.

## Evidence

Example input: `Diagnose why my UiAutomator2 session fails during startup with this server log and desired capabilities.` Verify the suspected failure class against logs, capabilities, device state, and driver-specific checks before recommending a fix.

---
owner: appium
id: appium.capabilities
status: experimental
---

# Appium Capabilities

## Goal

Use this context when a workflow needs shared Appium capability guidance that is not specific to one setup or troubleshooting procedure.

## Rules

- Identify `platformName` and `appium:automationName` before selecting a driver-specific setup, troubleshooting, or real-device route.
- Keep capability changes narrow and tied to the observed failure, requested feature, or validated device mode.
- Prefer W3C namespaced Appium capabilities such as `appium:automationName`, `appium:deviceName`, `appium:app`, and `appium:platformVersion`.
- Do not use optional capability families such as media recording, app bundle handling, or prebuilt WebDriverAgent unless the user explicitly asks for the related feature or the selected route requires it.
- For real iOS or tvOS devices, load `skills/xcuitest-real-device-config/SKILL.md` before recommending signing, provisioning, or WebDriverAgent deployment capabilities.

## Evidence To Report

Report the smallest relevant capabilities block, the driver or platform assumption it depends on, and any optional capability that was intentionally skipped.

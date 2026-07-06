---
id: lens.tools.appium.driver-selection
type: context_lens
title: Appium Driver Selection Lens
owner: appium
status: experimental
tags:
  - appium
  - setup
  - driver-selection
purpose: driver_selection
applies_to:
  - contexts/tools/appium/setup/routing.md
  - contexts/tools/appium/setup/references/support-inventory.md
  - contexts/tools/appium/capabilities.md
focus:
  - target platform
  - automation name
  - optional capability boundary
expected_outputs:
  - selected driver assumption
  - loaded context path list
  - skipped optional capabilities
---

# Appium Driver Selection Lens

Read the applied setup contexts through the question of driver fit: what platform, automation name, browser, device mode, or host constraint is already known, and which assumption still needs to be stated before a setup path is followed.

Keep this lens at the catalog layer. The durable driver facts stay in routing, support inventory, capability, profile, and reference context assets.

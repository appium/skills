---
id: lens.tools.appium.smoke-validation
type: context_lens
title: Appium Smoke Validation Lens
owner: appium
status: experimental
tags:
  - appium
  - setup
  - smoke-validation
purpose: smoke_validation
applies_to:
  - contexts/tools/appium/setup/routing.md
  - contexts/tools/appium/setup/references/support-inventory.md
focus:
  - server readiness
  - driver availability
  - cleanup evidence
expected_outputs:
  - smoke command evidence
  - readiness result
  - cleanup status
---

# Appium Smoke Validation Lens

Use this lens when setup evidence needs to be read as a smoke-validation result rather than as a full installation guide. The useful output is the smallest proof that the Appium server, selected driver, and cleanup check behaved as the referenced contexts require.

Do not expand this into a copied command cookbook. Driver-specific commands and pass/fail criteria belong in the setup references and inventories.

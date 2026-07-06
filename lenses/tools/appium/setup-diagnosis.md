---
id: lens.tools.appium.setup-diagnosis
type: context_lens
title: Appium Setup Diagnosis Lens
owner: appium
status: experimental
tags:
  - appium
  - setup
  - diagnosis
purpose: setup_diagnosis
applies_to:
  - contexts/tools/appium/setup/routing.md
  - contexts/tools/appium/setup-basics.md
  - contexts/tools/appium/development-environment/readiness.md
focus:
  - readiness signals
  - required-fix gate
  - optional dependency boundary
expected_outputs:
  - setup diagnosis summary
  - verification evidence list
  - non-blocking warnings
---

# Appium Setup Diagnosis Lens

Use this lens to interpret setup context as a diagnosis task: identify the requested Appium target, separate required doctor failures from optional warnings, and keep environment changes tied to evidence already required by the setup contexts.

This asset is only a review orientation over the listed context files. It does not choose a route, load files at runtime, generate a prompt, or restate driver-specific setup procedure.

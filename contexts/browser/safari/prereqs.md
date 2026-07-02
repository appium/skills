---
owner: appium
id: browser.safari.prereqs
name: "safari-prereqs"
description: "Validate Safari and safaridriver availability plus macOS automation authorization boundaries"
status: stable
---

# Safari Browser Prerequisites

## Goal

Validate Safari browser automation prerequisites that are not specific to Appium driver installation.

## Checks

Run read-only checks before changing Safari automation state:

```bash
sw_vers
safaridriver --version
```

## Authorization Boundary

- If `safaridriver` is missing, stop and repair Safari or macOS tooling before Appium driver work.
- Run `safaridriver --enable` only when Safari automation is required and the user can accept the macOS authorization prompt.
- Treat Safari automation authorization as an explicit user approval step, not automatic setup.

## Evidence To Report

Report macOS version, `safaridriver --version`, whether Safari automation was already enabled or explicitly enabled, and any user action still required.

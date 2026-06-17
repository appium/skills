---
name: "environment-setup-bundletool"
description: "Route optional bundletool.jar setup for Android App Bundle support"
---

# environment-setup-bundletool

## Goal

Install and validate `bundletool.jar` from official Google bundletool releases only when Android App Bundle tooling is explicitly requested.

## Routing

Load these references in order:

1. `bundletool/bundletool-decision-logic.md` for optional-use gates and install triggers.
2. `bundletool/bundletool-install.md` for download and PATH setup.
3. `bundletool/bundletool-validation.md` for version evidence and completion criteria.

## Completion Criteria

- User explicitly requested bundletool capability.
- `bundletool.jar` is resolvable from `PATH` or a reported absolute path.
- `java -jar <bundletool.jar> version` succeeds.
- Result states whether installation was skipped or performed.

## Evidence To Report

Report host OS, GitHub release tag, release asset URL, `bundletool.jar` path, version output, and whether setup was skipped because bundletool was already present.

---
name: "environment-setup-bundletool"
description: "Optional bundletool setup for Android Appium drivers"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# environment-setup-bundletool

## Goal
Install and validate bundletool only when the user explicitly needs Android App Bundle (`.aab`) handling for UiAutomator2 or Espresso.

## Procedure
1. Confirm the user requested bundletool-related setup. If not, skip this reference.
2. Check Java and Android prerequisites first with `environment-setup-android`.
3. Detect an existing install:
   - macOS/Linux: `command -v bundletool || ls "$HOME"/.local/bin/bundletool`
   - Windows PowerShell: `Get-Command bundletool -ErrorAction SilentlyContinue`
4. If missing, install in user space. Use a release from the official bundletool project or a package manager already approved by the user.
5. Re-run the detection command and verify:
   - `bundletool version`
   - `java -version`
6. If Appium still cannot process an `.aab`, capture the Appium error and confirm the bundletool executable path is visible in the same shell that runs Appium.

## Completion Criteria
- User explicitly requested bundletool setup.
- `bundletool version` succeeds.
- Java and Android setup checks still pass.
- Report install path, version, and any PATH change.

## Self-Improvement Prompt
Before the final response, report any missing, ambiguous, outdated, or retry-causing instruction in this reference with proposed wording. Do not edit skill files unless the user asked.

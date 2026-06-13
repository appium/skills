# Full Guidance Part 1

---
name: "environment-setup-bundletool"
description: "Use this skill only when Android App Bundle tooling is explicitly requested or required by a selected UiAutomator2 or Espresso workflow that needs bundletool.jar."
---
# environment-setup-bundletool

## Goal
Install or validate `bundletool.jar` from official release assets for optional Android App Bundle support.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Do Not Use For
- Do not use for standard APK-only automation.
- Do not use for Java, Android SDK, or Appium driver installation.

## Preflight
Confirm the user requested bundletool or the active Android driver workflow requires App Bundle tooling, then check Java and existing bundletool availability.

## Instructions
1. If bundletool is already resolvable, validate it and do not reinstall.
2. If missing, download the official release asset to a user-writable PATH directory.
3. Record the source URL and checksum or signature evidence when available.

## Verification
Run `java -jar <bundletool.jar> version` and report the resolved path.

## Examples
- A user asks to test an AAB; after Android setup passes, install bundletool and verify its version.

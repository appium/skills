# Bundletool Setup

## Goal
Install or validate `bundletool.jar` from official release assets for optional Android App Bundle workflows.

## Do Not Use For
Do not use for standard APK-only automation. Do not use for Java, Android SDK, or Appium driver installation.

## Preflight
Confirm Java works, locate any existing `bundletool.jar`, identify user-writable install locations, and confirm the requested UiAutomator2 or Espresso flow needs bundletool.

## Instructions
1. If bundletool is already resolvable, validate it and do not reinstall.
2. If missing, download the official release asset to a user-writable PATH or documented tools directory after user approval.
3. Do not use privileged installation unless explicitly approved.

## Verification
Run `java -jar <bundletool.jar> version` and report the resolved path.

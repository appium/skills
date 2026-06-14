# Node Setup

## Goal
Confirm Node.js, npm, registry access, and Appium availability before driver-specific setup.

## Do Not Use For
Do not use for Android SDK, Xcode, browser, FFmpeg, bundletool, or Appium driver setup after Node/npm already validate.

## Preflight
Capture OS, shell, active Node version manager, `node -v`, `npm -v`, `npm ping`, `appium -v`, and `appium driver list --installed`.

## Instructions
1. Use an existing maintained version manager when Node is missing or too old.
2. Repair npm only when npm is unavailable or registry checks fail.
3. Prefer user-space tooling and avoid privileged setup.

## Verification
Verify `node -v`, `npm -v`, `npm ping`, and `appium -v`; report whether the checks satisfy the requested driver setup path.

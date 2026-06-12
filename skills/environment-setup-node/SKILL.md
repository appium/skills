---
name: "environment-setup-node"
description: "Use this skill to validate and repair the Node.js and npm runtime needed by Appium skills, including version-manager detection, npm availability, and registry connectivity."
---
# environment-setup-node

## Goal
Confirm Node.js, npm, and registry access satisfy the calling Appium driver skill.

## When To Use
Use this skill when the request matches the description and the preflight checks point to this exact setup or troubleshooting path. Keep detailed commands in [full guidance](references/full-guidance.md).

## Do Not Use For
- Do not use for Appium driver, Android SDK, Xcode, browser, FFmpeg, or bundletool setup after Node/npm already validate.

## Preflight
Identify OS, shell, active Node version manager, `node -v`, `npm -v`, and `npm ping` status before changing tooling.

## Instructions
1. Use an existing maintained version manager when Node is missing or too old.
2. Repair npm only when npm is unavailable or registry checks fail.
3. Avoid privileged setup; prefer user-space tooling.

## Verification
Report `node -v`, `npm -v`, `npm ping`, and whether versions satisfy the calling skill engines.

## Examples
- Appium install fails because Node is too old; switch via nvm/fnm/asdf, then rerun Node and npm checks.

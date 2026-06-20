---
owner: appium
id: setup-references-environment-setup-mac2
status: stable
source: contexts/tools/appium/setup/mac2-environment.md

---

# appium-mac2-environment-setup

## Goal

Prepare Appium Mac2 Driver by validating macOS, Node/Appium, Xcode tooling, driver installation, doctor checks, privacy authorization boundaries, and server smoke evidence.

## Routing

1. `contexts/tools/appium/setup/node-environment.md` for Node.js and npm.
2. `mac2/mac2-decision-logic.md` for macOS-only setup gates and authorization boundaries.
3. `mac2/mac2-xcode-prereqs.md` for Xcode command-line tools, license, and first-launch checks.
4. `mac2/mac2-driver-doctor.md` for driver installation and doctor pass criteria.
5. `mac2/mac2-smoke-status.md` for `/status`, log evidence, and cleanup.

## Validation Command

```bash
node tools/appium/setup/scripts/check-mac2-env.mjs
```

Use `summary.requiredOk: true` as the read-only setup gate before smoke checks.

## Completion Criteria

- Host OS is macOS.
- `xcodebuild -version` and `xcode-select -p` succeed.
- Xcode license and first-launch requirements are handled.
- `appium -v` succeeds and installed driver list includes `mac2`.
- `appium driver doctor mac2` reports `0 required fixes needed`.
- Required macOS privacy permissions are granted by the user when session startup needs them.
- `/status` returns readiness and logs include `Available drivers:` with `mac2`.

## Constraints

- macOS only.
- Use global npm/Appium by default.
- Use `npx appium` only when explicitly requested.
- Ask before privileged commands or privacy-setting changes.

## Self-Improvement Prompt

Run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing Mac2 setup instruction with the section and proposed wording. Do not edit the skill unless asked.

---
security_profile: appium-local-workflows
owner: appium
id: setup-references-environment-setup-espresso
status: stable
source: contexts/tools/appium/setup/espresso-environment.md

---

# Espresso Environment

## Goal

Prepare Appium Espresso by checking Node/Appium, Android prerequisites, driver installation, doctor output, and server smoke evidence until required fixes are zero.

## Routing

Load these references in order:

1. First load `contexts/tools/appium/setup-basics.md` to validate Node.js and npm.
2. Then load `contexts/platform/android/emulator-setup.md` to validate Java, Android SDK, ADB, emulator, and SDK packages.
3. `contexts/tools/appium/setup/references/espresso/espresso-decision-logic.md` for driver setup triggers and optional dependency boundaries.
4. `contexts/tools/appium/setup/references/espresso/espresso-driver-install.md` for global Appium and Espresso driver installation.
5. `contexts/tools/appium/setup/references/espresso/espresso-doctor-validation.md` for required doctor pass criteria.
6. `contexts/tools/appium/setup/references/espresso/espresso-smoke-status.md` for server `/status`, log evidence, and cleanup.

## Validation Command

```bash
node tools/appium/setup/scripts/check-espresso-env.mjs
```

Use `summary.requiredOk: true` as the read-only setup gate before smoke checks.

## Completion Criteria

- Android setup completion criteria are satisfied.
- `appium -v` succeeds.
- Installed driver list includes `espresso`.
- `appium driver doctor espresso` reports `0 required fixes needed`; optional warnings do not block completion.
- `/status` returns a successful Appium server response.
- Server logs include `Available drivers:` and `espresso`.
- Cleanup check reports no leftover Appium server process.

## Constraints

Use global npm/Appium by default. Use `npx appium` only when explicitly requested. Ask before optional FFmpeg or bundletool setup.

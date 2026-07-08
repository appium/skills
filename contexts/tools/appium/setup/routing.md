---
owner: appium
id: appium-setup-routing
title: Appium Setup Routing Context
status: stable
optional_context:
  - contexts/tools/appium/setup/references/support-inventory.md

---

# Appium Setup Routing Context

Reusable setup-routing contract for Appium environment work.

Confirm target platform, driver, host OS, command mode, available devices or browsers, and optional dependency requests before changing the environment. Use global `appium` commands by default and use `npx appium` only when local mode is explicitly requested.

Completion requires the selected reference criteria. Driver doctor required fixes must be `0` when doctor is supported; optional warnings do not block completion.

## Recommended Setup Routes

Use the matching route for the requested target. Load only the listed assets and any references they explicitly require.

Use `contexts/tools/appium/setup/references/support-inventory.md` as a scoped index when a setup route needs nested profiles, examples, or driver references not listed below.

### Android + UiAutomator2

1. `skills/setup/SKILL.md`
2. `contexts/platform/android/profile.md`
3. `contexts/tools/appium/setup-basics.md`
4. `contexts/platform/android/emulator-setup.md`
5. `contexts/tools/appium/setup/uiautomator2-environment.md`
6. Example: `contexts/tools/appium/setup/examples/uiautomator2.md`

### Android + Espresso

1. `skills/setup/SKILL.md`
2. `contexts/platform/android/profile.md`
3. `contexts/tools/appium/setup-basics.md`
4. `contexts/platform/android/emulator-setup.md`
5. `contexts/tools/appium/setup/espresso-environment.md`
6. Example: `contexts/tools/appium/setup/examples/espresso.md`

### Desktop Chromium Browsers

1. `skills/setup/SKILL.md`
2. `contexts/tools/appium/setup/profiles/chromium.md`
3. `contexts/tools/appium/setup-basics.md`
4. `contexts/tools/appium/setup/references/environment-setup-chromium.md`
5. Example: `contexts/tools/appium/setup/examples/chromium.md`

### Desktop Firefox Browsers

1. `skills/setup/SKILL.md`
2. `contexts/tools/appium/setup/profiles/gecko.md`
3. `contexts/tools/appium/setup-basics.md`
4. `contexts/tools/appium/setup/gecko-environment.md`
5. Example: `contexts/tools/appium/setup/examples/gecko.md`

### macOS + Mac2

1. `skills/setup/SKILL.md`
2. `contexts/platform/macos/profile.md`
3. `contexts/tools/appium/setup/profiles/mac2.md`
4. `contexts/tools/appium/setup-basics.md`
5. `contexts/tools/appium/setup/mac2-environment.md`
6. Example: `contexts/tools/appium/setup/examples/mac2.md`

### macOS + Safari

1. `skills/setup/SKILL.md`
2. `contexts/platform/macos/profile.md`
3. `contexts/tools/appium/setup/profiles/safari.md`
4. `contexts/tools/appium/setup-basics.md`
5. `contexts/browser/safari/prereqs.md`
6. `contexts/tools/appium/setup/references/environment-setup-safari.md`
7. Example: `contexts/tools/appium/setup/examples/safari.md`

### iOS + XCUITest Simulator

1. `skills/setup/SKILL.md`
2. `contexts/platform/macos/profile.md`
3. `contexts/tools/appium/setup/profiles/xcuitest.md`
4. `contexts/tools/appium/setup-basics.md`
5. `contexts/platform/ios/simulator-setup.md`
6. Example: `contexts/tools/appium/setup/examples/xcuitest.md`

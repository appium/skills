---
security_profile: appium-local-workflows
owner: appium
id: appium-setup-routing
title: Appium Setup Routing Context
status: stable
optional_context:
  - contexts/tools/appium/setup/references/support-inventory.md

---

# Appium Setup Routing Context

Reusable driver-selection and setup-routing contract for Appium environment work.

Resolve the driver-selection gate below before changing the environment. Then confirm or safely detect the target platform, host OS, command mode, available devices or browsers, and optional dependency requests. Use global `appium` commands by default and use `npx appium` only when local mode is explicitly requested.

Completion requires the selected reference criteria. Driver doctor required fixes must be `0` when doctor is supported; optional warnings do not block completion.

## Driver Selection Gate

Treat explicit driver names in the user's request or follow-up selection as authorization to set up those driver routes. Normalize common names such as `uia2` to UiAutomator2, but preserve every explicitly selected driver. If multiple drivers are named, do not ask the user to choose between them: prepare shared prerequisites once, then run and verify each route in dependency order.

When no driver is named, do not run installation or environment-changing commands. Ask the user which Appium driver or drivers they need, and use any platform or application hints to recommend the smallest relevant set:

| Intended target | Driver choice |
| --- | --- |
| Android native or hybrid apps | UiAutomator2 (recommended default) or Espresso |
| iOS or tvOS simulators | XCUITest |
| Chrome or Chromium desktop browsers | Chromium |
| Firefox desktop browsers | Gecko |
| Safari on macOS | Safari |
| Native macOS apps | Mac2 |

Use a concise question such as: `Which Appium driver or drivers do you want to set up? For example: UiAutomator2 for Android, XCUITest for iOS simulators, Chromium for Chrome, Gecko for Firefox, Safari, or Mac2.` Do not install all drivers by default and do not treat currently installed drivers as the user's selection.

If the user selects XCUITest for a real iOS or tvOS device rather than a simulator, route signing and WebDriverAgent deployment to `skills/xcuitest-real-device-config/SKILL.md`. Ask whether the target is a simulator or real device only when that distinction remains unknown and is required to choose the correct skill.

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

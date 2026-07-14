---
security_profile: appium-local-workflows
owner: appium
id: appium-setup-routing
title: Appium Setup Routing Context
status: stable
optional_context:
  - contexts/tools/appium/capabilities.md
  - contexts/tools/appium/setup-basics.md
  - contexts/tools/appium/setup/profiles/global-appium.md
  - contexts/tools/appium/setup/profiles/local-npx.md
  - contexts/platform/android/profile.md
  - contexts/platform/linux/profile.md
  - contexts/platform/macos/profile.md
  - contexts/platform/windows/profile.md
  - contexts/platform/android/emulator-setup.md
  - contexts/platform/ios/simulator-setup.md
  - contexts/tools/appium/setup/espresso-environment.md
  - contexts/tools/appium/setup/gecko-environment.md
  - contexts/tools/appium/setup/mac2-environment.md
  - contexts/tools/appium/setup/references/environment-setup-chromium.md
  - contexts/tools/appium/setup/references/environment-setup-safari.md
  - contexts/tools/appium/setup/uiautomator2-environment.md
  - contexts/tools/appium/setup/profiles/chromium.md
  - contexts/tools/appium/setup/profiles/gecko.md
  - contexts/tools/appium/setup/profiles/mac2.md
  - contexts/tools/appium/setup/profiles/safari.md
  - contexts/tools/appium/setup/profiles/xcuitest.md
  - contexts/tools/appium/setup/examples/chromium.md
  - contexts/tools/appium/setup/examples/espresso.md
  - contexts/tools/appium/setup/examples/gecko.md
  - contexts/tools/appium/setup/examples/mac2.md
  - contexts/tools/appium/setup/examples/safari.md
  - contexts/tools/appium/setup/examples/uiautomator2.md
  - contexts/tools/appium/setup/examples/xcuitest.md
  - contexts/platform/android/bundletool.md
  - contexts/tools/ffmpeg/setup.md

---

# Appium Setup Routing Context

Reusable driver-selection and setup-routing contract for Appium environment work.

Resolve the driver-selection gate below before changing the environment. Then confirm or safely detect the target platform, host OS, command mode, available devices or browsers, and optional dependency requests. Use global `appium` commands by default. When local mode is explicitly requested, load `contexts/tools/appium/setup/profiles/local-npx.md` and treat it as authoritative over every unqualified global command example in nested assets.

Command examples in route assets show the global default unless they explicitly show both modes. In local mode, run from the project root, replace every `appium ...` invocation with `npx --no-install appium ...`, and never run a nested `npm install -g` instruction. Install or upgrade project-local Appium only when project dependency changes are authorized; otherwise report the missing local component as a blocker.

Completion requires the selected reference criteria. Driver doctor required fixes must be `0` when doctor is supported; optional warnings do not block completion.

## Driver Selection Gate

Treat explicit driver names in the user's request or follow-up selection as authorization to set up those driver routes. Normalize common names such as `uia2` to UiAutomator2, but preserve every explicitly selected driver. If multiple drivers are named, do not ask the user to choose between them: prepare shared prerequisites once, then run and verify each route in dependency order.

When no driver is named, do not run installation or environment-changing commands. Ask the user which Appium driver or drivers they need, and use any platform or application hints to recommend the smallest relevant set:

| Intended target | Driver choice |
| --- | --- |
| Android native or hybrid apps | UiAutomator2 (recommended default) or Espresso |
| iOS or tvOS | XCUITest |
| Chrome or Chromium desktop browsers | Chromium |
| Firefox desktop browsers | Gecko |
| Safari on macOS | Safari |
| Native macOS apps | Mac2 |

Use a concise question such as: `Which Appium driver or drivers do you want to set up? For example: UiAutomator2 for Android, XCUITest for iOS/tvOS, Chromium for Chrome, Gecko for Firefox, Safari, or Mac2.` Do not install all drivers by default and do not treat currently installed drivers as the user's selection.

Use this setup workflow for shared iOS/tvOS XCUITest prerequisites. When the target is a real device, additionally route signing and WebDriverAgent deployment to `skills/xcuitest-real-device-config/SKILL.md`. Ask whether the target is a simulator or real device only when that distinction is required to determine whether the additional real-device workflow applies.

## Recommended Setup Routes

Use the matching route for the requested target. Load only the listed assets and any references they explicitly require.

Each route Context below owns the loading order for its nested driver and platform references. Load the matching host and command-mode profiles only when they affect execution, and load optional FFmpeg or bundletool Contexts only after an explicit request.

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

### iOS/tvOS + XCUITest

1. `skills/setup/SKILL.md`
2. `contexts/platform/macos/profile.md`
3. `contexts/tools/appium/setup/profiles/xcuitest.md`
4. `contexts/tools/appium/setup-basics.md`
5. `contexts/platform/ios/simulator-setup.md`
6. Example: `contexts/tools/appium/setup/examples/xcuitest.md`

---
owner: appium
id: appium-setup-routing
status: stable
optional_context: contexts/platform/android/decision-logic.md, contexts/tools/appium/capabilities.md, contexts/tools/appium/setup/espresso-environment.md, contexts/tools/appium/setup/examples/chromium.md, contexts/tools/appium/setup/examples/espresso.md, contexts/tools/appium/setup/examples/gecko.md, contexts/tools/appium/setup/examples/mac2.md, contexts/tools/appium/setup/examples/safari.md, contexts/tools/appium/setup/examples/uiautomator2.md, contexts/tools/appium/setup/examples/xcuitest.md, contexts/tools/appium/setup/ffmpeg-environment.md, contexts/tools/appium/setup/gecko-environment.md, contexts/tools/appium/setup/mac2-environment.md, contexts/tools/appium/setup-basics.md, contexts/platform/android/profile.md, contexts/tools/appium/setup/profiles/chromium.md, contexts/tools/appium/setup/profiles/gecko.md, contexts/tools/appium/setup/profiles/global-appium.md, contexts/tools/appium/setup/profiles/linux.md, contexts/tools/appium/setup/profiles/local-npx.md, contexts/tools/appium/setup/profiles/mac2.md, contexts/platform/macos/profile.md, contexts/tools/appium/setup/profiles/safari.md, contexts/tools/appium/setup/profiles/windows.md, contexts/tools/appium/setup/profiles/xcuitest.md, contexts/platform/android/references/detect-base-tooling.md, contexts/platform/android/references/device-emulator-validation.md, contexts/platform/android/references/java-configuration.md, contexts/platform/android/references/sdk-commandline-tools.md, contexts/platform/android/references/sdk-packages-and-path.md, contexts/platform/android/references/bundletool/decision-logic.md, contexts/platform/android/references/bundletool/install.md, contexts/platform/android/references/bundletool/validation.md, contexts/browser/chromium/prereqs.md, contexts/tools/appium/setup/references/chromium/chromium-decision-logic.md, contexts/tools/appium/setup/references/chromium/chromium-driver-validation.md, contexts/tools/appium/setup/references/chromium/chromium-smoke-status.md, contexts/platform/android/emulator-setup.md, contexts/platform/android/bundletool.md, contexts/tools/appium/setup/references/environment-setup-chromium.md, contexts/tools/appium/setup/references/environment-setup-safari.md, contexts/platform/ios/simulator-setup.md, contexts/tools/appium/setup/references/espresso/espresso-decision-logic.md, contexts/tools/appium/setup/references/espresso/espresso-doctor-validation.md, contexts/tools/appium/setup/references/espresso/espresso-driver-install.md, contexts/tools/appium/setup/references/espresso/espresso-smoke-status.md, contexts/browser/firefox/prereqs.md, contexts/tools/appium/setup/references/gecko/gecko-decision-logic.md, contexts/tools/appium/setup/references/gecko/gecko-driver-validation.md, contexts/tools/appium/setup/references/gecko/gecko-smoke-status.md, contexts/tools/appium/setup/references/mac2/mac2-decision-logic.md, contexts/tools/appium/setup/references/mac2/mac2-driver-doctor.md, contexts/tools/appium/setup/references/mac2/mac2-smoke-status.md, contexts/platform/macos/xcode-command-line-tools.md, contexts/tools/appium/setup/references/node/node-decision-logic.md, contexts/tools/appium/setup/references/node/node-npm-health.md, contexts/tools/appium/setup/references/node/node-validation-evidence.md, contexts/tools/appium/setup/references/node/node-version-manager-setup.md, contexts/tools/appium/setup/references/safari/safari-decision-logic.md, contexts/tools/appium/setup/references/safari/safari-driver-install.md, contexts/tools/appium/setup/references/safari/safari-smoke-status.md, contexts/tools/appium/setup/references/support-inventory.md, contexts/tools/appium/setup/references/uiautomator2/uiautomator2-decision-logic.md, contexts/tools/appium/setup/references/uiautomator2/uiautomator2-doctor-validation.md, contexts/tools/appium/setup/references/uiautomator2/uiautomator2-driver-install.md, contexts/tools/appium/setup/references/uiautomator2/uiautomator2-smoke-status.md, contexts/tools/appium/setup/references/xcuitest/xcuitest-decision-logic.md, contexts/tools/appium/setup/references/xcuitest/xcuitest-driver-doctor.md, contexts/tools/appium/setup/references/xcuitest/xcuitest-smoke-status.md, contexts/platform/macos/xcode-prereqs.md, contexts/tools/appium/setup/uiautomator2-environment.md

---

# Appium Setup Routing Context

Reusable setup-routing contract for Appium environment work.

Confirm target platform, driver, host OS, command mode, available devices or browsers, and optional dependency requests before changing the environment. Use global `appium` commands by default and use `npx appium` only when local mode is explicitly requested.

Completion requires the selected reference criteria. Driver doctor required fixes must be `0` when doctor is supported; optional warnings do not block completion.

## Recommended Setup Routes

Use the matching route for the requested target. Load only the listed assets and any references they explicitly require.

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
5. `contexts/tools/appium/setup/references/environment-setup-safari.md`
6. Example: `contexts/tools/appium/setup/examples/safari.md`

### iOS + XCUITest Simulator

1. `skills/setup/SKILL.md`
2. `contexts/platform/macos/profile.md`
3. `contexts/tools/appium/setup/profiles/xcuitest.md`
4. `contexts/tools/appium/setup-basics.md`
5. `contexts/platform/ios/simulator-setup.md`
6. Example: `contexts/tools/appium/setup/examples/xcuitest.md`

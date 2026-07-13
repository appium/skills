---
security_profile: appium-local-workflows
owner: appium
id: platform.macos.profile
status: stable

---

# macOS Setup Profile

Use this profile when setup is running on macOS.

- Prefer user-space installs and require explicit human approval before privileged elevation.
- For Android, check Android Studio locations, `$HOME/Library/Android/sdk`, Java/JBR, `adb`, emulator, and `sdkmanager`.
- For iOS/tvOS XCUITest, check Xcode, command-line tools, applicable runtimes or connected devices, the Appium XCUITest driver, and doctor output.
- For Mac2, check Xcode command-line tools, Appium Mac2 driver, doctor output, and user-approved macOS privacy permissions.
- For optional tooling, prefer Homebrew only after confirming the user wants the optional dependency.

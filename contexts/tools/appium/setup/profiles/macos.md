---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/macos.md"
id: appium.setup.profiles.macos
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/macos.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/macos.md bounded command output, local paths, driver names, IDs, and logs

---

# macOS Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile when setup is running on macOS.

- Prefer user-space installs and avoid privileged elevation unless the user explicitly asks.
- For Android, check Android Studio locations, `$HOME/Library/Android/sdk`, Java/JBR, `adb`, emulator, and `sdkmanager`.
- For XCUITest, check Xcode, command line tools, simulators, Appium XCUITest driver, and doctor output.
- For Mac2, check Xcode command-line tools, Appium Mac2 driver, doctor output, and user-approved macOS privacy permissions.
- For optional tooling, prefer Homebrew only after confirming the user wants the optional dependency.

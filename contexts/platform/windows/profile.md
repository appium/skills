---
security_profile: appium-local-workflows
owner: appium
id: platform.windows.profile
status: stable

---

# Windows Setup Profile

Use this profile when setup is running on Windows or PowerShell.

- Prefer `winget` for Node.js manager setup when no maintained version manager exists.
- If PowerShell blocks npm scripts, use CurrentUser execution policy repair from the Node reference.
- Validate Android SDK, Java, `adb.exe`, emulator, and browser driver paths with Windows-native commands.
- Do not attempt XCUITest setup on Windows.

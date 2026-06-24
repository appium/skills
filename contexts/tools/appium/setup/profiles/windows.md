---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/windows.md"
id: appium.setup.profiles.windows
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/windows.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/windows.md bounded command output, local paths, driver names, IDs, and logs

---

# Windows Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile when setup is running on Windows or PowerShell.

- Prefer `winget` for Node.js manager setup when no maintained version manager exists.
- If PowerShell blocks npm scripts, use CurrentUser execution policy repair from the Node reference.
- Validate Android SDK, Java, `adb.exe`, emulator, and browser driver paths with Windows-native commands.
- Do not attempt XCUITest setup on Windows.

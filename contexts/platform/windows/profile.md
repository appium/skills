---
security_profile: appium-local-workflows
owner: appium
id: platform.windows.profile
status: stable

---

# Windows Setup Profile

Use this profile when setup is running on Windows or PowerShell.

- Prefer `winget` for Node.js manager setup when no maintained version manager exists.
- If PowerShell blocks `npm.ps1`, use `npm.cmd`. Change execution policy only
  when explicitly authorized.
- Validate Android SDK, Java, `adb.exe`, emulator, and browser driver paths with Windows-native commands.
- Use the PowerShell install examples in the driver references; Bash variable
  guards do not run in PowerShell.
- The smoke helper uses built-in Windows PowerShell and a Windows Job Object to
  own and clean up its server tree, including after a parent exits. If host policy
  blocks PowerShell or `Add-Type`, report the blocker; do not change execution policy.
- Do not attempt XCUITest setup on Windows.

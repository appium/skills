---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/linux.md"
id: appium.setup.profiles.linux
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/linux.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/linux.md bounded command output, local paths, driver names, IDs, and logs

---

# Linux Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile when setup is running on Linux.

- Prefer user-space installs and distro package managers without privileged elevation unless the user explicitly asks.
- For Android, validate Java, Android SDK paths, platform tools, emulator packages, KVM or virtualization readiness, and device visibility.
- For Chromium, validate browser executable, browser driver compatibility, and any required system packages.
- Do not attempt XCUITest setup on Linux.

---
security_profile: appium-local-workflows
owner: appium
id: platform.linux.profile
status: stable

---

# Linux Setup Profile

Use this profile when setup is running on Linux.

- Prefer user-space installs and require explicit human approval before privileged package-manager elevation.
- For Android, validate Java, Android SDK paths, platform tools, emulator packages, KVM or virtualization readiness, and device visibility.
- For Chromium, validate browser executable, browser driver compatibility, and any required system packages.
- Do not attempt XCUITest setup on Linux.

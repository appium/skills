---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.profiles.safari

---

# Safari Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile for Appium Safari Driver setup on macOS.

- Load Node.js and Safari references.
- Validate macOS, Safari, Apple `safaridriver`, Appium 3, Safari driver installation, and smoke checks.
- For iOS Simulator Safari, also validate Xcode command line tools and simulator inventory.
- For iOS real devices, require the user to enable Remote Automation on the device before attempting sessions.

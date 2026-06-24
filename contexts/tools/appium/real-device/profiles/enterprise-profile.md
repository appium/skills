---
owner: appium
policy_scope: "contexts/tools/appium/real-device/profiles/enterprise-profile.md"
id: appium.real-device.profiles.enterprise-profile
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/profiles/enterprise-profile.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/profiles/enterprise-profile.md bounded command output, local paths, driver names, IDs, and logs

---

# Enterprise Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the WDA app is signed with an enterprise provisioning profile.

- Confirm the enterprise profile covers the WDA bundle ID and target device.
- Verify code signing before installation and again after any bundle modification.
- Avoid changing bundle IDs unless the profile requires explicit remapping.

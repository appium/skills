---
owner: appium
policy_scope: "contexts/tools/appium/real-device/profiles/paid-developer.md"
id: appium.real-device.profiles.paid-developer
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/profiles/paid-developer.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/profiles/paid-developer.md bounded command output, local paths, driver names, IDs, and logs

---

# Paid Developer Signing Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user has a paid Apple Developer account.

- Ask for the expected bundle ID and Team ID before signing.
- A true wildcard profile can cover arbitrary WDA bundle IDs; partial wildcard or specific profiles require bundle ID remapping.
- Verify the embedded profile covers the connected device UDID and final WDA bundle ID.

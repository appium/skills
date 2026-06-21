---
owner: appium
id: appium.real-device.profiles.paid-developer

---

# Paid Developer Signing Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user has a paid Apple Developer account.

- Ask for the expected bundle ID and Team ID before signing.
- A true wildcard profile can cover arbitrary WDA bundle IDs; partial wildcard or specific profiles require bundle ID remapping.
- Verify the embedded profile covers the connected device UDID and final WDA bundle ID.

---
maint_scope: "contexts/tools/appium/real-device/profiles/free-apple-id.md"
owner: appium
policy_scope: "contexts/tools/appium/real-device/profiles/free-apple-id.md"
id: appium.real-device.profiles.free-apple-id
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/profiles/free-apple-id.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/profiles/free-apple-id.md bounded command output, local paths, driver names, IDs, and logs

---

# Free Apple ID Signing Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user signs WDA with a free Apple ID.

- Use a bundle ID that Xcode has accepted for the Apple ID.
- Expect additional trust prompts and launch restrictions; install and trust a sample app signed with the same profile when needed.
- Do not assume wildcard provisioning profile support.

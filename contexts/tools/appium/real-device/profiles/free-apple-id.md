---
owner: appium
id: appium.real-device.profiles.free-apple-id

---

# Free Apple ID Signing Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user signs WDA with a free Apple ID.

- Use a bundle ID that Xcode has accepted for the Apple ID.
- Expect additional trust prompts and launch restrictions; install and trust a sample app signed with the same profile when needed.
- Do not assume wildcard provisioning profile support.

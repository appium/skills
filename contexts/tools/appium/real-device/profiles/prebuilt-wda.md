---
owner: appium
policy_scope: "contexts/tools/appium/real-device/profiles/prebuilt-wda.md"
id: appium.real-device.profiles.prebuilt-wda
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/profiles/prebuilt-wda.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/profiles/prebuilt-wda.md bounded command output, local paths, driver names, IDs, and logs

---

# Prebuilt WDA Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user provides or builds a signed WDA app before the Appium session.

- Verify `appium:prebuiltWDAPath` points to the signed `.app`.
- After any iOS or tvOS 17+ framework cleanup, verify the code signature before installation.
- Reinstall only after signing/provisioning verification succeeds.

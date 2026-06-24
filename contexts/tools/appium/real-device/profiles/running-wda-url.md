---
owner: appium
policy_scope: "contexts/tools/appium/real-device/profiles/running-wda-url.md"
id: appium.real-device.profiles.running-wda-url
network_allowed: true
external_upload_allowed: false
secrets_allowed: true
allowed_data:
  - contexts/tools/appium/real-device/profiles/running-wda-url.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/real-device/profiles/running-wda-url.md bounded command output, local paths, driver names, IDs, and logs

---

# Running WDA URL Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user wants Appium to attach to an already running WDA.

- Confirm WDA is reachable at the intended `appium:webDriverAgentUrl`.
- Treat repeated `ECONNREFUSED 127.0.0.1:8100` as evidence to revisit signing, installation, launch, or port-forwarding.
- Keep Appium capabilities aligned with attach mode rather than rebuilding WDA every session.

---
security_profile: appium-real-device-workflows
owner: appium
id: appium.real-device.profiles.running-wda-url

---

# Running WDA URL Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user wants Appium to attach to an already running WDA.

- Confirm WDA is reachable at the intended `appium:webDriverAgentUrl`.
- Accept USB visibility or an already paired wireless device that appears in `xcrun xctrace list devices`; do not require a new USB trust flow solely for attach mode.
- Skip local WDA build, signing, provisioning, artifact inspection, and installation steps. Treat existing device trust and Developer Mode as prerequisites; do not change them unless separate evidence and approval make that necessary.
- Treat repeated `ECONNREFUSED 127.0.0.1:8100` as endpoint, WDA-process, or port-forwarding evidence. Do not enter a signing or installation route when the user excluded those changes.
- Keep Appium capabilities aligned with attach mode rather than rebuilding WDA every session.
- Complete only when the endpoint is reachable and one Appium session attaches successfully. Report no local signing evidence for this route.

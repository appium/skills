# Prebuilt WDA Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user provides or builds a signed WDA app before the Appium session.

- Verify `appium:prebuiltWDAPath` points to the signed `.app`.
- After any iOS or tvOS 17+ framework cleanup, verify the code signature before installation.
- Reinstall only after signing/provisioning verification succeeds.

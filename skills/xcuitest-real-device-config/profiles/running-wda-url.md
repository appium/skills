# Running WDA URL Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the user wants Appium to attach to an already running WDA.

- Confirm WDA is reachable at the intended `appium:webDriverAgentUrl`.
- Treat repeated `ECONNREFUSED 127.0.0.1:8100` as evidence to revisit signing, installation, launch, or port-forwarding.
- Keep Appium capabilities aligned with attach mode rather than rebuilding WDA every session.

---
security_profile: appium-local-workflows
owner: appium
id: appium.troubleshooting.examples.session-startup

---

# Example: Session Startup Failure

Use this example when an Appium session fails before the first command succeeds.

1. Load `skills/appium-troubleshooting/SKILL.md`.
2. Capture the exact `POST /session` capabilities and first real error.
3. Follow the Skill's driver and symptom selection.
4. Load the matching startup reference when available.
5. Re-run the smallest failing session start check after each fix.

Report the failing command, evidence collected, change made, and verification result.

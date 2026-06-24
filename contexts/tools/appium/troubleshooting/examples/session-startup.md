---
owner: appium
policy_scope: "contexts/tools/appium/troubleshooting/examples/session-startup.md"
id: appium.troubleshooting.examples.session-startup
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/troubleshooting/examples/session-startup.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/troubleshooting/examples/session-startup.md bounded command output, local paths, driver names, IDs, and logs

---

# Example: Session Startup Failure

Use this example when an Appium session fails before the first command succeeds.

1. Load `skills/appium-troubleshooting/SKILL.md`.
2. Capture the exact `POST /session` capabilities and first real error.
3. Load the matching driver profile.
4. Load `contexts/tools/appium/troubleshooting/procedure-part1.md` and `contexts/tools/appium/troubleshooting/references/troubleshooting-procedure-part2.md` in order.
5. Load the matching startup reference when available.
6. Re-run the smallest failing session start check after each fix.

Report the failing command, evidence collected, change made, and verification result.

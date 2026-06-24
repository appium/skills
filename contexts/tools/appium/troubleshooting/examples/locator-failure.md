---
owner: appium
policy_scope: "contexts/tools/appium/troubleshooting/examples/locator-failure.md"
id: appium.troubleshooting.examples.locator-failure
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/troubleshooting/examples/locator-failure.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/troubleshooting/examples/locator-failure.md bounded command output, local paths, driver names, IDs, and logs

---

# Example: Locator Failure

Use this example when a session starts but element lookup fails.

1. Load `skills/appium-troubleshooting/SKILL.md`.
2. Capture the selector strategy, selector value, page source or inspector evidence, platform, automation driver, and relevant app state.
3. Load the matching driver profile.
4. Load the matching locator or element lookup reference.
5. Prefer platform-native locator guidance before community search.
6. Re-run the smallest element lookup reproduction after each fix.

Report the selector, evidence collected, locator change, and verification result.

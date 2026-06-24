---
maint_scope: "contexts/tools/appium/troubleshooting/triage.md"
owner: appium
policy_scope: "contexts/tools/appium/troubleshooting/triage.md"
id: appium-troubleshooting-triage
status: stable
optional_context: contexts/tools/appium/troubleshooting/examples/locator-failure.md, contexts/tools/appium/troubleshooting/examples/session-startup.md, contexts/tools/appium/troubleshooting/procedure-part1.md, contexts/tools/appium/troubleshooting/profiles/chromium.md, contexts/tools/appium/troubleshooting/profiles/uiautomator2.md, contexts/tools/appium/troubleshooting/profiles/xcuitest.md, contexts/tools/appium/troubleshooting/references/community-search.md, contexts/tools/appium/troubleshooting/references/troubleshooting-procedure-part2.md, contexts/tools/appium/troubleshooting/references/uiautomator2-locators.md, contexts/tools/appium/troubleshooting/references/uiautomator2-session-startup.md, contexts/tools/appium/troubleshooting/references/xcuitest-element-lookup.md, contexts/tools/appium/troubleshooting/references/xcuitest-locators.md, contexts/tools/appium/troubleshooting/references/xcuitest-troubleshooting.md
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/troubleshooting/triage.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/troubleshooting/triage.md bounded command output, local paths, driver names, IDs, and logs

---

# Appium Failure Triage Context

Reusable diagnosis contract for Appium commands, session startup, driver startup, device connection, browser startup, WebDriverAgent launch, and element lookup failures.

Capture the exact failing command, error text, platform, automation driver, desired capabilities, Appium version, installed driver list, and smallest reproduction before changing anything. After each fix, rerun the smallest failing command or doctor check and report the evidence.

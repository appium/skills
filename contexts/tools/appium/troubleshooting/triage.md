---
security_profile: appium-local-workflows
owner: appium
id: appium-troubleshooting-triage
status: stable
optional_context: contexts/tools/appium/troubleshooting/examples/locator-failure.md, contexts/tools/appium/troubleshooting/examples/session-startup.md, contexts/tools/appium/troubleshooting/procedure-part1.md, contexts/tools/appium/troubleshooting/profiles/chromium.md, contexts/tools/appium/troubleshooting/profiles/uiautomator2.md, contexts/tools/appium/troubleshooting/profiles/xcuitest.md, contexts/tools/appium/troubleshooting/references/community-search.md, contexts/tools/appium/troubleshooting/references/troubleshooting-procedure-part2.md, contexts/tools/appium/troubleshooting/references/uiautomator2-locators.md, contexts/tools/appium/troubleshooting/references/uiautomator2-session-startup.md, contexts/tools/appium/troubleshooting/references/xcuitest-element-lookup.md, contexts/tools/appium/troubleshooting/references/xcuitest-locators.md, contexts/tools/appium/troubleshooting/references/xcuitest-troubleshooting.md

---

# Appium Failure Triage Context

Reusable diagnosis contract for Appium commands, session startup, driver startup, device connection, browser startup, WebDriverAgent launch, and element lookup failures.

Capture the exact failing command, error text, platform, automation driver, desired capabilities, Appium version, installed driver list, and smallest reproduction before changing anything. After each fix, rerun the smallest failing command or doctor check and report the evidence.

## Recommended Route

1. If setup or doctor output is failing, run `skills/setup/SKILL.md` with the matching setup references first.
2. Load `skills/appium-troubleshooting/SKILL.md`.
3. Load the matching driver profile and symptom references from `contexts/tools/appium/troubleshooting/`.
4. Use `contexts/tools/appium/troubleshooting/examples/session-startup.md` or `contexts/tools/appium/troubleshooting/examples/locator-failure.md` when the example matches the failure.

# Appium Agent Skills

This repository contains AI Agent skills for Appium automation, including environment setup, real-device configuration, and troubleshooting common failures.

Appium Skills is repository-first. Each `SKILL.md` is a focused workflow entry point that owns its selection boundary, inputs, workflow outline, safety rules, loading instructions, and completion criteria. Shared knowledge remains in top-level `contexts/`, and deterministic checks remain in top-level `tools/`, so multiple Skills can reuse them without duplicating procedures.

Fine-grained Context Assets are intentional when they represent independently selectable platform, driver, validation, security, or troubleshooting concerns. Generated inventories and validation reports are projections of this architecture, not sources of domain guidance.

Each workflow includes or delegates to a self-improvement prompt in the loaded context, reference, or procedure. After use, note missing, ambiguous, outdated, or retry-causing instructions and propose a focused update to the asset that owns the affected guidance.

## Available Skills

| Skill | Description |
|---|---|
| [setup](skills/setup/SKILL.md) | Selects and sets up UiAutomator2, Espresso, Chromium, Gecko, Mac2, Safari, or iOS/tvOS XCUITest, loading only the shared Context Assets and tools required for the selected drivers |
| [prepare-development-environment](skills/prepare-development-environment/SKILL.md) | Prepares this repository for local development and validation by checking Git, Node, npm, helper scripts, Agent Skills, repository relationships, and the configured Renma gate |
| [appium-troubleshooting](skills/appium-troubleshooting/SKILL.md) | Diagnoses implemented UiAutomator2 startup, transport, and locator failures or XCUITest WDA, startup, device-state, and element-lookup failures, re-checking the smallest reproduction after each fix |
| [xcuitest-real-device-config](skills/xcuitest-real-device-config/SKILL.md) | Prepares a real iOS/tvOS device for Appium XCUITest automation |

## Reliable Execution Notes

- Run one skill at a time in dependency order.
- If output appears incomplete, rerun only the affected step and collect logs from that step.
- Treat Appium doctor as the source of truth for pass/fail (`0 required fixes needed`).
- For FFmpeg-dependent capabilities, use `contexts/tools/ffmpeg/setup.md` only when explicitly requested.
- For bundletool-dependent capabilities, use `contexts/platform/android/bundletool.md` only when explicitly requested.
- For supported UiAutomator2 or XCUITest startup, WDA, transport, device-state, or locator failures after setup is complete, use `appium-troubleshooting` in a single driver path.
- For Renma, require the configured blocking gate to pass. Review every remaining advisory and either address it or explicitly accept it with a documented rationale; non-blocking advisories do not have to disappear.

## Future Work

Dedicated troubleshooting routes for Espresso, Chromium, Gecko, Safari, and Mac2 are desirable but are not implemented selection targets yet. Add a driver profile, symptom-specific references, verification steps, and completion evidence before advertising any of these drivers in the troubleshooting Skill description.

## Agent Instructions

- See [AGENTS.md](AGENTS.md) for repository-level execution rules and skill entrypoint guidance.
- Use the selected `SKILL.md` and its routed `contexts/` assets for target-specific step order.

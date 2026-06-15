---
name: "espresso-05"
description: "Preserved espresso setup procedure part 5 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# espresso Part 5

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-espresso.md; strip this generated header when comparing -->

- doctor result, preferring structured required/optional fix counts
- Android prerequisite summary from `environment-setup-android`
- connected device and emulator inventory
- `/status` smoke-test response
- server log evidence that `Available drivers:` includes `espresso`
- cleanup check showing no leftover Appium server process

## Self-Improvement Prompt

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

## Constraints
- Always run `appium driver doctor espresso` after each environment change.
- Use global npm/Appium.
- Use `npx appium` only if asked.
- Do not skip Android prerequisite validation; rely on `environment-setup-android` for source-of-truth checks.
- Use shell-appropriate commands (`bash` for macOS/Linux, PowerShell/cmd for Windows).
- Optional warnings are non-blocking.
- Ask the user before installing optional dependencies, and install them only when the user explicitly needs that capability.
- Prefer CLI evidence.
- For privileged commands, pause and provide exact command.
- Claim success only after doctor and smoke pass.

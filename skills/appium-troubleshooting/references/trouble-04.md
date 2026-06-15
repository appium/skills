---
name: "trouble-04"
description: "Preserved troubleshooting-procedure procedure part 04 of 05"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# troubleshooting-procedure Part 04

<!-- preserved-source: 64dcf79:skills/appium-troubleshooting/references/troubleshooting-procedure.md; strip this generated header when comparing -->

   Include the baseline checks you ran, the change you made, and the smallest reproduction or check you re-ran to confirm the result.

## Completion Criteria
Mark troubleshooting complete only when one of these is true:
- the failing check passes after a verified fix, or
- the exact blocker is isolated to something the user must do manually (for example signing, device trust, app build defects), with the relevant command output and next action captured

## Self-Improvement Prompt

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

## Constraints
- Run commands one step at a time and re-run checks after each fix.
- Treat Appium doctor output `0 required fixes needed` as the pass/fail gate; optional warnings are non-blocking.
- Prefer doctor `--json` output when supported and fall back to text summaries only when JSON is unavailable.
- Use global `appium` command mode by default unless the user explicitly asks for local `npx appium`.
- Prefer the official Appium driver docs referenced by this skill before using community answers.
- Keep troubleshooting scoped to one driver path (`uiautomator2`, `espresso`, `xcuitest`, or `chromium`) per run unless the user explicitly asks for cross-driver comparison.

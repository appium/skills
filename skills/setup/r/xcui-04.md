---
name: "xcui-04"
description: "Preserved xcuitest setup procedure part 4 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# xcuitest Part 4

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-xcuitest.md; strip this generated header when comparing -->

   - `appium driver doctor xcuitest` reports `0 required fixes needed` (optional warnings are allowed)
   - task result includes the doctor summary line with required/optional fix counts
   - `curl -s http://127.0.0.1:4723/status` returns a successful status response
   - Appium server logs show startup/readiness successfully after the curl check, or (if banner logs are unavailable) readiness is confirmed by `/status` plus JSON driver listing that includes `xcuitest`
   - If logs are available, `Available drivers:` includes an `xcuitest` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Doctor Gate

Prefer doctor `--json`; fall back to text. Require `0 required fixes needed`.

If doctor output changes and cannot be classified deterministically, mark the run as `needs-manual-review` and do not mark the skill complete.

## Evidence To Report

- `appium -v`
- installed `xcuitest` driver version from `appium driver list --installed --json` or text fallback
- `xcodebuild -version`
- active `xcode-select -p`
- doctor result, preferring structured required/optional fix counts
- simulator inventory when simulator validation is run
- `/status` smoke-test response
- server log evidence that `Available drivers:` includes `xcuitest`
- cleanup check showing no leftover Appium server process

## Self-Improvement Prompt


---
name: "safari-04"
description: "Preserved safari setup procedure part 4 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# safari Part 4

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-safari.md; strip this generated header when comparing -->

- If `appium driver doctor safari` is supported, it reports `0 required fixes needed`.
- If doctor is unsupported, doctor status is reported as `not-supported`.
- `/status` check returns a successful Appium readiness response.
- Server logs or installed-driver fallback confirm `safari` is available.
- Appium smoke-test server process is cleanly stopped after validation.

## Evidence To Report

- `appium -v`
- installed `safari` driver version from `appium driver list --installed --json`
- `safaridriver --version`
- active macOS version from `sw_vers`
- doctor result, or `not-supported`
- optional simulator inventory when simulator validation was requested
- `/status` smoke-test response
- server log evidence that `Available drivers:` includes `safari`
- cleanup verification

## Self-Improvement Prompt

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction wording. Do not edit the skill unless asked.

- Is Safari driver doctor behavior still accurate for the installed driver version?
- Did the `safaridriver --enable` authorization flow need clearer wording?
- Did iOS Simulator or real-device Safari setup require extra routing instructions?
- Did any command need a platform-specific variant not documented here?

## Constraints

- macOS only.
- Use global npm/Appium by default.
- Use `npx appium` only if the user explicitly requests local execution.

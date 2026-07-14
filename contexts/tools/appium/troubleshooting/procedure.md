---
security_profile: appium-local-workflows
owner: appium
id: appium-troubleshooting-procedure
status: stable
source: contexts/tools/appium/troubleshooting/procedure.md
---

# Appium Troubleshooting Procedure

## Goal
Triage one Appium driver failure and isolate its cause. For a fix request, apply the smallest plausible fix and re-check until confirmed or handed back; for diagnosis-only work, stop before changing state and report the evidence-backed cause or next discriminating check.

Resolve command mode once. Use `appium` by default; when the user explicitly selects local mode, run from the project root and replace every `appium ...` invocation in this procedure with `npx --no-install appium ...`. Never mix global and local modes in one run or allow `npx` to download a missing Appium package.

## Decision Logic
- Identify the active automation driver first (`uiautomator2` or `xcuitest`). If unknown, stop and ask for the failing session capabilities or log line that names the driver. If another driver is named, report that this repository does not implement a troubleshooting route for it and hand off to the driver's official guidance.
- If the failure is an environment or driver-install problem (`node`, `npm`, `appium`, Java, Android SDK, `Xcode`, doctor failures): run the matching setup skill for the selected driver first.
- UiAutomator2 path only:
  - session startup, wrong activity, early drop, or `socket hang up`: read `contexts/tools/appium/troubleshooting/references/uiautomator2-session-startup.md`.
  - locator issues: read `contexts/tools/appium/troubleshooting/references/uiautomator2-locators.md`.
- XCUITest path only:
  - WebDriverAgent startup/install/reachability, app install/launch, device/simulator state: read `contexts/tools/appium/troubleshooting/references/xcuitest-troubleshooting.md`.
  - element lookup or locator issues: read `contexts/tools/appium/troubleshooting/references/xcuitest-element-lookup.md` and `contexts/tools/appium/troubleshooting/references/xcuitest-locators.md`.
- If the official docs do not explain the exact stack trace or symptom, use `contexts/tools/appium/troubleshooting/references/community-search.md` as a fallback workflow.

## Instructions
1. **Capture the failing command and lock the driver scope**
   Record the exact error text, platform, automation driver, and relevant capabilities before changing anything. If the driver is still unclear, ask for one of these before continuing:
   - the desired capabilities block containing `platformName` and `appium:automationName`
   - the Appium server log lines from `POST /session` through the first real error after `createSession`
   If the client hides capabilities, rerun one failing session with Appium server logs enabled and capture that window before troubleshooting further.

2. **Run baseline checks only when the error message alone is not enough**
   If the error text already points to a known issue, open the matching driver-specific official reference first and confirm the closest symptom before changing anything. Then collect what is needed:
   - `appium -v` and `appium driver list --installed --json` (fallback to `appium driver list --installed` if `--json` is unsupported) — to confirm driver presence and version.
   - UiAutomator2: `adb devices -l` and `appium driver doctor uiautomator2 --json || appium driver doctor uiautomator2` — only if the error suggests a device connectivity or prerequisite problem.
   - XCUITest: `xcodebuild -version` and `appium driver doctor xcuitest --json || appium driver doctor xcuitest` — only if the error suggests a build, signing, WDA, or toolchain problem.
   If any doctor or prerequisite check fails, switch to the matching setup skill before deeper troubleshooting. Use `contexts/tools/appium/troubleshooting/references/community-search.md` only after the relevant official reference does not explain the exact stack trace or symptom.

3. **Open only the references that match the selected driver and symptom**
   Do not load both driver branches in one run. Start with the most direct reference for the observed symptom and only expand if that file does not explain the behavior.

4. **For a fix request, apply one targeted change, then re-run the smallest failing check**
   Prefer reversible capability or locator corrections. Obtain explicit approval before any device reset or erase, component reinstall, signing or trust change, or other stateful reset. Re-run the doctor command for prerequisite issues, the failing session launch for startup issues, or the failing locator lookup for element issues. For diagnosis-only work, stop after evidence-backed cause isolation and present the targeted change as the next action without applying it.

5. **Use official docs first, community second**
   Official references for this skill:
   - `https://appium.io/docs/en/latest/`
   - `https://github.com/appium/appium-uiautomator2-driver`
   - `https://appium.github.io/appium-xcuitest-driver/latest/`
   - `https://github.com/appium/appium-xcuitest-driver`
   Use `discuss.appium.io` only after the official references are exhausted, searching with exact error text plus driver name and platform version.

6. **Report the outcome with command evidence**
   Include the baseline checks you ran and the matching symptom evidence. For a fix request, include the change and smallest passing re-check. For diagnosis-only work, identify the isolated cause or remaining hypothesis and the next discriminating check without claiming a fix.

## Completion Criteria
Mark troubleshooting complete only when one of these is true:
- the failing check passes after a verified fix, or
- the exact blocker is isolated to something the user must do manually (for example signing, device trust, app build defects), with the relevant command output and next action captured, or
- for a diagnosis-only request, the cause is isolated from matching evidence and the smallest proposed fix or next discriminating check is reported without changing state

## Self-Improvement Prompt

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit this context unless asked.

## Constraints
- Run commands one step at a time and re-run checks after each fix.
- Treat Appium doctor output `0 required fixes needed` as the pass/fail gate; optional warnings are non-blocking.
- Prefer doctor `--json` output when supported and fall back to text summaries only when JSON is unavailable.
- Use global `appium` command mode by default unless the user explicitly asks for local `npx appium`.
- Prefer the official Appium driver docs referenced by this skill before using community answers.
- Keep troubleshooting scoped to one implemented driver path (`uiautomator2` or `xcuitest`) per run.
- Do not claim success from a theory alone; always tie the conclusion to a reproduced symptom or a passing re-check.

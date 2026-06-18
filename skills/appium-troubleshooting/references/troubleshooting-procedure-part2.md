
3. **Open only the references that match the selected driver and symptom**
   Do not load both driver branches in one run. Start with the most direct reference for the observed symptom and only expand if that file does not explain the behavior.

4. **Apply one targeted change, then re-run the smallest failing check**
   Prefer narrow fixes such as capability corrections, driver cleanup, device reset, or locator updates before broader environment churn. Re-run the doctor command for prerequisite issues, the failing session launch for startup issues, or the failing locator lookup for element issues.

5. **Use official docs first, community second**
   Official references for this skill:
   - `https://appium.io/docs/en/latest/`
   - `https://github.com/appium/appium-uiautomator2-driver`
   - `https://github.com/appium/appium-espresso-driver`
   - `https://appium.github.io/appium-xcuitest-driver/latest/`
   - `https://github.com/appium/appium-xcuitest-driver`
   - `https://github.com/appium/appium-chromium-driver`
   Use `discuss.appium.io` only after the official references are exhausted, searching with exact error text plus driver name and platform version.

6. **Report the outcome with command evidence**
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
- Do not claim success from a theory alone; always tie the conclusion to a reproduced symptom or a passing re-check.

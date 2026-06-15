---
name: "xcui-02"
description: "Preserved xcuitest setup procedure part 2 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# xcuitest Part 2

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-xcuitest.md; strip this generated header when comparing -->

   Run `sudo xcodebuild -license accept` or `xcodebuild -runFirstLaunch` only with user approval when checks require them.

4. **Optional FFmpeg**
   If requested, run `environment-setup-ffmpeg`.

5. **Run Appium doctor for XCUITest and fix in a loop**
   ```bash
   appium driver doctor xcuitest
   ```
   Use `0 required fixes needed` as the pass/fail gate. Optional warnings are non-blocking. Resolve required fixes, then re-run until this gate is met.
   For deterministic automation, parse the doctor output for that exact phrase instead of relying on visual formatting.
   `applesimutils` warnings are optional for basic simulator session creation, but recommended when you need permission-management helper APIs.
   Bash gate example:
   ```bash
   DOCTOR_OUT="$(appium driver doctor xcuitest 2>&1)"
   echo "$DOCTOR_OUT" | grep -q "0 required fixes needed" || { echo "$DOCTOR_OUT"; exit 1; }
   echo "$DOCTOR_OUT" | grep -E "0 required fixes needed|optional fix"
   ```
   PowerShell gate example:
   ```powershell
   $doctorOut = appium driver doctor xcuitest 2>&1 | Out-String
   if ($doctorOut -notmatch '0 required fixes needed') { throw "Doctor required fixes remain" }
   $doctorOut | Select-String '0 required fixes needed|optional fix'
   ```
   Changed doctor wording fallback:
   1. Re-run doctor once with `appium driver doctor xcuitest --json`.
   2. If JSON is unsupported, capture full text output.
   3. Accept a pass only when structured output or the text summary clearly indicates zero required issues.

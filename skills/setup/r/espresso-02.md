---
name: "espresso-02"
description: "Preserved espresso setup procedure part 2 of 5"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# espresso Part 2

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-espresso.md; strip this generated header when comparing -->

3. **Capture Android inventory**
   ```bash
   adb devices -l
   emulator -version
   emulator -list-avds
   ```

4. **Run Appium doctor for Espresso and fix in a loop**
   ```bash
   appium driver doctor espresso
   ```
   Use `0 required fixes needed` as the pass/fail gate. Optional warnings are non-blocking. If required fixes remain, apply targeted fixes and re-run.
   For deterministic automation, parse the doctor output for that exact phrase instead of relying on visual formatting.
   Bash gate example:
   ```bash
   DOCTOR_OUT="$(appium driver doctor espresso 2>&1)"
   echo "$DOCTOR_OUT" | grep -q "0 required fixes needed" || { echo "$DOCTOR_OUT"; exit 1; }
   echo "$DOCTOR_OUT" | grep -E "0 required fixes needed|optional fix"
   ```
   PowerShell gate example:
   ```powershell
   $doctorOut = appium driver doctor espresso 2>&1 | Out-String
   if ($doctorOut -notmatch '0 required fixes needed') { throw "Doctor required fixes remain" }
   $doctorOut | Select-String '0 required fixes needed|optional fix'
   ```
   Changed doctor wording fallback:
   1. Re-run doctor once with `appium driver doctor espresso --json`.
   2. If JSON is unsupported, capture full text output.
   3. Accept a pass only when structured output or the text summary clearly indicates zero required issues.
   4. If still ambiguous, mark status as `needs-manual-review` and do not mark the skill complete.

8. **Start Appium server smoke test**
   ```bash
   appium server
   ```
   Windows PowerShell recommended form (for deterministic log checks):
   ```powershell
   appium server --log "$env:TEMP\appium-espresso-smoke.log" --log-level info
   ```

---
name: "environment-setup-espresso"
description: "Set up and validate an Espresso Appium environment on Android"
metadata:
   last_modified: "Mon, 06 Apr 2026 00:00:00 GMT"

---
# appium-espresso-environment-setup

## Goal
Prepare Appium Espresso by validating Node/Appium, Android/Java, doctor, and smoke checks until `0 required fixes needed`.

## Decision Logic
- If host OS is not macOS, Linux, or Windows: stop.
- If Node.js misses `appium`/`appium-espresso-driver` engines: install active LTS.
- If Appium CLI is not installed: install `appium` globally.
- Use global npm/Appium (`npm install -g appium`, `appium ...`) unless the user asks for `npx`.
- If Android SDK prerequisites are missing (`adb`, emulator, SDK packages): run `environment-setup-android`.
- If requested, run `environment-setup-ffmpeg` or `environment-setup-bundletool` before final validation.
- Report device/emulator inventory.
- If the `espresso` driver is not installed: install it via Appium CLI.
- If install returns "already installed", ignore the error and continue (or run driver update).
- If `appium driver doctor espresso` reports missing dependencies: resolve each missing item and re-run doctor.

## Instructions
1. **Run prerequisite skills**
   Run `environment-setup-node`, then `environment-setup-android`. Continue only after both completion criteria pass.

2. **Install Espresso driver**
   ```bash
   npm install -g appium
   appium driver install espresso || appium driver update espresso
   appium driver list --installed --json || appium driver list --installed
   ```
   Use `--unsafe` update only with user approval. Confirm `espresso` is installed.

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
   Keep this server process running in Terminal A.
   In Terminal B, run:
   ```bash
   curl -s http://127.0.0.1:4723/status
   ```
   First confirm `/status` responds successfully.
   Windows PowerShell reliable variant (recommended on Windows due to `curl` alias behavior):
   ```powershell
   $ok = $false
   for ($i = 0; $i -lt 20; $i++) {
      try {
         $resp = Invoke-RestMethod -Uri "http://127.0.0.1:4723/status" -Method Get -TimeoutSec 5
         if ($resp.value.ready -eq $true) {
            $ok = $true
            $resp | ConvertTo-Json -Depth 5
            break
         }
      } catch {
         Start-Sleep -Milliseconds 500
      }
   }
   if (-not $ok) { throw "Appium /status did not become ready in time" }
   ```
   Then confirm startup/readiness from server logs and ensure the `Available drivers:` block contains `espresso` (for example: `- espresso@<version> (automationName 'Espresso')`).
   If startup banner logs are not available in your terminal integration, use this fallback verification path:
   - `appium driver list --installed --json` includes `espresso`
   - `/status` reports server readiness
   Windows PowerShell log verification example:
   ```powershell
   Get-Content "$env:TEMP\appium-espresso-smoke.log" | Select-String "listener started|Available drivers:|espresso@"
   ```
   After smoke validation, clean up the running Appium server:
   - In Terminal A, stop the server with `Ctrl+C`.
   - Verify no leftover Appium server process (Terminal B, macOS/Linux):
   ```bash
   pgrep -fl "appium.*server" || echo "no appium server process"
   ```
   - Verify no leftover Appium server process (Terminal B, Windows PowerShell):
   ```powershell
   if (Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'appium.*server' }) {
      Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'appium.*server' } | Select-Object ProcessId, Name, CommandLine
   } else {
      "no appium server process"
   }
   ```

9. **Agent completion criteria**
   Mark the skill complete only when all are true:
   - `appium driver list --installed --json` includes `espresso` (fallback to `appium driver list --installed` if `--json` is unsupported)
   - `appium -v` succeeds
   - `appium driver doctor espresso` reports `0 required fixes needed` (optional warnings are allowed)
   - task result includes the doctor summary line with required/optional fix counts
   - `environment-setup-android` completion criteria are satisfied
   - task result includes connected-device output (`adb devices -l`) and emulator inventory (`emulator -version`, `emulator -list-avds`)
   - task result explicitly states whether emulator preparation was skipped (and why)
   - `/status` check returns a successful status response (`curl` on macOS/Linux, `Invoke-RestMethod` retry loop recommended on Windows)
   - Appium server logs show startup/readiness successfully after the status check, or (if banner logs are unavailable) readiness is confirmed by `/status` plus JSON driver listing that includes `espresso`
   - If logs are available, `Available drivers:` includes an `espresso` entry
   - Appium smoke-test server process is cleanly stopped after validation

## Doctor Gate

Prefer doctor `--json`; fall back to text. Require `0 required fixes needed`.

If doctor output changes and cannot be classified deterministically, mark the run as `needs-manual-review` and do not mark the skill complete.

## Evidence To Report

- `appium -v`
- installed `espresso` driver version from `appium driver list --installed --json` or text fallback
- doctor result, preferring structured required/optional fix counts
- Android prerequisite summary from `environment-setup-android`
- connected device and emulator inventory
- `/status` smoke-test response
- server log evidence that `Available drivers:` includes `espresso`
- cleanup check showing no leftover Appium server process

## Self-Improvement Prompt

After use, report any missing, ambiguous, outdated, or retry-causing instruction with section and proposed wording. Do not edit the skill unless asked.

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

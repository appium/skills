# UiAutomator2 Setup

## Goal
Prepare Appium UiAutomator2 by validating Node/Appium, Android/Java, driver installation, doctor output, and smoke checks until `0 required fixes needed`.

## Decision Logic
- Run `node.md` and `android.md` checks first.
- If Appium CLI is missing, install Appium globally.
- If `uiautomator2` is missing, install it with the Appium CLI.
- If install says the driver is already installed, treat that as non-fatal and continue with validation.
- Optional FFmpeg and bundletool warnings are non-blocking unless the user requested those capabilities.

## Commands

```bash
appium -v
appium driver list --installed
appium driver install uiautomator2 || appium driver update uiautomator2
appium driver list --installed
adb devices -l
emulator -version
emulator -list-avds
appium driver doctor uiautomator2
```

PowerShell equivalents:

```powershell
appium -v
appium driver list --installed
appium driver install uiautomator2
if ($LASTEXITCODE -ne 0) { appium driver update uiautomator2 }
adb devices -l
emulator -version
emulator -list-avds
appium driver doctor uiautomator2
```

## Doctor Handling
Accept a pass only when doctor output clearly reports `0 required fixes needed`. If wording changes or output is ambiguous:

1. Re-run `appium driver doctor uiautomator2 --json`.
2. If JSON is unsupported, capture full text output.
3. Accept a pass only when structured output or summary indicates zero required issues.
4. If still ambiguous, mark status as `needs-manual-review` and do not claim completion.

## Smoke Test
Start a temporary Appium server, preferably on a free port:

```bash
appium server
curl -s http://127.0.0.1:4723/status
```

If port 4723 is occupied, use another port:

```bash
appium server -p 4725
curl -s http://127.0.0.1:4725/status
```

Confirm startup logs include `Available drivers:` and `uiautomator2`, or confirm `appium driver list --installed` includes `uiautomator2`.

Stop the test server with `Ctrl+C`, then verify cleanup:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```

PowerShell cleanup:

```powershell
$p = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'appium.*server' }
if ($p) { $p | Select-Object ProcessId, Name, CommandLine } else { "no appium server process" }
```

## Completion Criteria
- `appium -v` succeeds.
- `appium driver list --installed` includes `uiautomator2`.
- `appium driver doctor uiautomator2` reports `0 required fixes needed`.
- Android setup evidence includes `adb devices -l` and emulator inventory.
- `/status` returns a ready response.
- The temporary Appium server is stopped.

## Evidence To Report
Report Appium version, UiAutomator2 driver version, doctor required/optional fix counts, `adb devices -l`, emulator inventory, `/status` JSON, server log driver evidence, and cleanup result.

# Espresso Setup

## Goal
Prepare Appium Espresso by validating Node/Appium, Android/Java, driver installation, doctor output, and smoke checks until `0 required fixes needed`.

## Decision Logic
- Run `node.md` and `android.md` checks first.
- If Appium CLI is missing, install Appium globally.
- If `espresso` is missing, install it with the Appium CLI.
- If install says the driver is already installed, treat that as non-fatal and continue with validation.
- Optional bundletool warnings are non-blocking unless requested capabilities require Android App Bundles.

## Commands

```bash
appium -v
appium driver list --installed
appium driver install espresso || appium driver update espresso
appium driver list --installed
adb devices -l
emulator -version
emulator -list-avds
appium driver doctor espresso
```

## Doctor Handling
Accept a pass only when doctor output clearly reports `0 required fixes needed`. If wording changes or output is ambiguous:

1. Re-run `appium driver doctor espresso --json`.
2. If JSON is unsupported, capture full text output.
3. Accept a pass only when structured output or text indicates zero required issues.
4. If still ambiguous, mark status as `needs-manual-review` and do not claim completion.

## Smoke Test
Start Appium, check `/status`, and confirm `espresso` is installed or advertised:

```bash
appium server
curl -s http://127.0.0.1:4723/status
appium driver list --installed
```

If port 4723 is occupied, use another free port such as 4725. Stop the test server with `Ctrl+C`, then verify cleanup:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```

## Completion Criteria
- `appium -v` succeeds.
- `appium driver list --installed` includes `espresso`.
- `appium driver doctor espresso` reports `0 required fixes needed`.
- Android setup evidence includes `adb devices -l` and emulator inventory.
- `/status` returns a ready response.
- The temporary Appium server is stopped.

## Evidence To Report
Report Appium version, Espresso driver version, doctor result, Android device/emulator inventory, `/status` JSON, server log driver evidence, and cleanup result.

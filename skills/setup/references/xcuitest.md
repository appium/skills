# XCUITest Setup

## Goal
Prepare Appium XCUITest on macOS by validating Node/Appium, Xcode, simulator readiness, driver installation, doctor output, and smoke checks until `0 required fixes needed`.

## Decision Logic
- If host OS is not macOS, stop; this setup path is macOS-only.
- If Xcode or command line tools are missing or unconfigured, fix them before continuing.
- If Appium CLI or `xcuitest` driver is missing, install them via Appium CLI.
- If install says the driver is already installed, treat that as non-fatal and continue with validation.
- Optional `applesimutils` and FFmpeg warnings are non-blocking unless requested capabilities need them.

## Preflight Commands

```bash
uname -s
xcode-select -p
xcodebuild -version
xcodebuild -showsdks
xcrun simctl list devices available
appium -v
appium driver list --installed
```

If `xcrun simctl` cannot connect to CoreSimulatorService in a sandbox, rerun with permissions that allow CoreSimulator access before deciding simulators are unavailable.

## Install Or Update

```bash
appium driver install xcuitest || appium driver update xcuitest
appium driver list --installed
```

Ask before running Xcode license, first-launch, or privileged commands. Do not skip Xcode license and first-launch checks when the tools report they are required.

## Doctor Handling

```bash
appium driver doctor xcuitest
```

Accept a pass only when doctor output clearly reports `0 required fixes needed`. If wording changes or output is ambiguous:

1. Re-run `appium driver doctor xcuitest --json`.
2. If JSON is unsupported, capture full text output.
3. Accept a pass only when structured output or summary indicates zero required issues.
4. If still ambiguous, mark status as `needs-manual-review` and do not claim completion.

## Smoke Test
Start Appium and check `/status`:

```bash
appium server
curl -s http://127.0.0.1:4723/status
```

If port 4723 is occupied, use another free port such as 4725. Confirm startup logs include `Available drivers:` and `xcuitest`, or confirm `appium driver list --installed` includes `xcuitest`.

Stop the test server with `Ctrl+C`, then verify cleanup:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```

## Completion Criteria
- `appium -v` succeeds.
- `appium driver list --installed` includes `xcuitest`.
- `xcodebuild -version` and `xcode-select -p` succeed.
- `appium driver doctor xcuitest` reports `0 required fixes needed`.
- `/status` returns a ready response.
- The temporary Appium server is stopped.

## Evidence To Report
Report Appium version, XCUITest driver version, Xcode version, active developer directory, installed simulator SDKs or simulator inventory, doctor required/optional fix counts, `/status` JSON, server log driver evidence, and cleanup result.

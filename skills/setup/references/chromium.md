# Chromium Setup

## Goal
Prepare Appium Chromium Driver by validating Node/npm, Appium 3, driver installation, supported browser prerequisites, and smoke checks.

## Decision Logic
- If host OS is not macOS, Linux, or Windows, stop.
- If Node.js or npm misses Appium/driver engine requirements, install active LTS or repair npm first.
- If Appium major version is less than 3, upgrade Appium before installing the Chromium driver.
- If `chromium` driver is missing, install it with Appium CLI.
- If no supported Chromium-based browser exists (`chrome`, `chromium`, `msedge`), ask before installing a browser.
- Microsoft Edge automation may require a matching `msedgedriver` and an explicit `appium:executable` capability.

## Preflight Commands

```bash
appium -v
appium driver list --installed
command -v google-chrome || true
command -v chromium || true
command -v chromium-browser || true
command -v msedge || true
google-chrome --version || true
chromium --version || true
msedge --version || true
```

Windows PowerShell:

```powershell
appium -v
appium driver list --installed
Get-Command chrome.exe -ErrorAction SilentlyContinue
Get-Command msedge.exe -ErrorAction SilentlyContinue
```

## Install Or Update

```bash
npm install -g appium
appium driver install chromium || appium driver update chromium
appium driver list --installed
```

If `appium driver doctor chromium` is unsupported, mark doctor status as `not-supported` and use install/list/browser/server smoke checks as the blocking gate.

If no chromedriver is available and no pinned version was requested, run:

```bash
appium driver run chromium install-chromedriver
```

For Microsoft Edge, report Edge version, `msedgedriver --version`, and the absolute driver path used in capabilities:

```json
{
  "platformName": "macOS",
  "browserName": "MicrosoftEdge",
  "appium:automationName": "Chromium",
  "appium:executable": "/absolute/path/to/msedgedriver"
}
```

## Smoke Test
Start Appium, check `/status`, and confirm `chromium` is installed or advertised:

```bash
appium server
curl -s http://127.0.0.1:4723/status
appium driver list --installed
```

If port 4723 is occupied, use another free port. Stop the test server and verify cleanup:

```bash
pgrep -fl "appium.*server" || echo "no appium server process"
```

## Completion Criteria
- Appium 3+ is installed.
- `appium driver list --installed` includes `chromium`.
- A supported Chrome, Chromium, or Edge executable is available.
- Browser/driver compatibility is explained when Edge or pinned chromedriver is used.
- `/status` returns a ready response.
- The temporary Appium server is stopped.

## Evidence To Report
Report Appium version, Chromium driver version, browser executable/version, chromedriver or msedgedriver path/version when relevant, doctor status if supported, `/status` JSON, and cleanup result.

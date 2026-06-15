---
name: "chromium-05"
description: "Preserved chromium setup procedure part 5 of 8"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# chromium Part 5

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-chromium.md; strip this generated header when comparing -->

   Use version/directory pinning only when the user explicitly requests manual pinning or mirrored download flows.
   macOS/Linux examples:
   ```bash
   CHROMEDRIVER_VERSION=131.0.6778.3 appium driver run chromium install-chromedriver
   CHROMEDRIVER_EXECUTABLE_DIR=/path/to/dir appium driver run chromium install-chromedriver
   ```
   Windows PowerShell examples:
   ```powershell
   $env:CHROMEDRIVER_VERSION='131.0.6778.3'; appium driver run chromium install-chromedriver; Remove-Item Env:\CHROMEDRIVER_VERSION
   $env:CHROMEDRIVER_EXECUTABLE_DIR='C:\path\to\folder'; appium driver run chromium install-chromedriver; Remove-Item Env:\CHROMEDRIVER_EXECUTABLE_DIR
   ```

   Optional Edge WebDriver setup (run only when the user explicitly requests Microsoft Edge automation):
   - Appium Chromium Driver does not autodownload `msedgedriver`.
   - Download the Microsoft Edge WebDriver version matching the installed Edge build from the official Microsoft Edge WebDriver page:
       `https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/`
   - Verify the installed Edge version first:
   macOS:
   ```bash
   defaults read "/Applications/Microsoft Edge.app/Contents/Info" CFBundleShortVersionString
   ```
   Linux:
   ```bash
   microsoft-edge --version
   ```
   Windows PowerShell:
   ```powershell
   (Get-Item "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe").VersionInfo.ProductVersion
   ```
   - After downloading and extracting `msedgedriver`, place it in a stable path and confirm it works:
   macOS/Linux:
   ```bash
   chmod +x /path/to/msedgedriver
   /path/to/msedgedriver --version
   ```
   Windows PowerShell:
   ```powershell
   & "C:\path\to\msedgedriver.exe" --version
   ```
   - For Edge sessions, pass the absolute driver path through capabilities:
   ```json
   {
      "platformName": "macOS",
      "browserName": "MicrosoftEdge",
      "appium:automationName": "Chromium",
      "appium:executable": "/absolute/path/to/msedgedriver"
   }
   ```

6. **Run Appium doctor for Chromium when supported**
   ```bash
   appium driver doctor chromium
   ```
   Use `0 required fixes needed` as the pass/fail gate when doctor is supported. Optional warnings are non-blocking. If required fixes remain, apply targeted fixes and re-run.

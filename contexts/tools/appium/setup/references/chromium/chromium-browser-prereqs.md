---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/chromium/chromium-browser-prereqs.md"
id: appium.setup.references.chromium.chromium-browser-prereqs
name: "chromium-browser-prereqs"
description: "Install or validate Chrome, Chromium, Edge, and Linux browser dependencies"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/chromium/chromium-browser-prereqs.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/chromium/chromium-browser-prereqs.md bounded command output, local paths, driver names, IDs, and logs

---

# chromium-browser-prereqs

## Browser Checks

Validate at least one browser executable: Chrome, Chromium, or Microsoft Edge.

## Linux Notes

Install required shared libraries before browser smoke checks. Debian/Ubuntu examples include `libnspr4`, `libnss3`, `libxss1`, `libatk-bridge2.0-0`, `libatk1.0-0`, `libcups2`, and `libdrm2`.

## Windows/macOS Notes

Use normal Chrome, Chromium, or Edge installers. For Windows, `winget install --id Google.Chrome` is the preferred Chrome path when the user approves installation.

## Edge Capability Pattern

```json
{"browserName":"MicrosoftEdge","appium:automationName":"Chromium","appium:executable":"/absolute/path/to/msedgedriver"}
```

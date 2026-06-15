---
name: "chromium-07"
description: "Preserved chromium setup procedure part 7 of 8"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# chromium Part 7

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-chromium.md; strip this generated header when comparing -->


8. **Agent completion criteria**
   Mark the skill complete only when all are true:
   - `appium driver list --installed --json` includes `chromium` (fallback to `appium driver list --installed` if `--json` is unsupported)
   - `appium -v` succeeds and is Appium 3.x
   - active Node/npm versions satisfy `appium` and `appium-chromium-driver` engines
   - if supported, `appium driver doctor chromium` reports `0 required fixes needed` (optional warnings are allowed)
   - if unsupported, result explicitly marks doctor status as `not-supported`
   - if no chromedriver binary was present initially and no pinned version was requested, task result includes successful execution of `appium driver run chromium install-chromedriver`
   - if Microsoft Edge automation was explicitly requested, task result includes installed Edge version, `msedgedriver --version` output, and the absolute path intended for `appium:executable`
   - task result includes browser availability check and the selected browser target (`chrome`, `chromium`, or `msedge`)
   - if optional browser setup was requested, task result includes browser install command(s) used and the post-install browser detection output
   - `/status` check returns a successful status response (`curl` on macOS/Linux, `Invoke-RestMethod` retry loop recommended on Windows)
   - Appium server logs show startup/readiness successfully after the status check, or readiness is confirmed by `/status` plus JSON driver listing that includes `chromium`
   - if logs are available, `Available drivers:` includes a `chromium` entry

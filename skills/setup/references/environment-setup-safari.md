---
name: "environment-setup-safari"
description: "Set up and validate Appium Safari Driver for macOS Safari and optional iOS Safari targets using Apple's safaridriver"
last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# appium-safari-environment-setup

## Goal

Prepare Appium Safari Driver by validating Node/npm, Appium 3, `safaridriver`, Safari driver installation, and smoke checks.

## Decision Tree

- If host OS is not macOS: stop. Safari driver setup is macOS-only because it depends on Apple's `safaridriver`.
- If Node.js misses `appium` or `appium-safari-driver` engines: install active LTS through `environment-setup-node`.
- If Appium CLI is not installed: install `appium` globally.
- If Appium major version is `< 3`: upgrade Appium to 3.x before installing or validating `safari`.
- If `safaridriver` is missing: stop and ask the user to install or repair Safari/macOS.
- If Safari automation has not been enabled: run `safaridriver --enable` only after the user accepts the macOS authorization prompt.
- If the `safari` driver is not installed: install it with `appium driver install safari`.
- If `appium driver doctor safari` is unsupported: mark doctor as `not-supported` and continue with install/list, `safaridriver`, and smoke checks.

## Procedure

1. **Validate macOS and Node/Appium prerequisites**

   ```bash
   uname -s
   node -v
   npm -v
   npm ping
   appium -v
   npm view appium-safari-driver engines appium --json
   ```

   Use `environment-setup-node.md` for Node/npm/Appium fixes. Safari Driver 5.x requires Appium 3 and Node `^20.19.0 || ^22.12.0 || >=24.0.0`.

2. **Validate Safari and safaridriver**

   ```bash
   sw_vers
   command -v safaridriver
   safaridriver --version
   /usr/bin/mdfind "kMDItemCFBundleIdentifier == 'com.apple.Safari'" | head -n 5
   ```

   If `safaridriver --version` fails, repair the Safari/macOS developer tooling before continuing.

3. **Enable Safari WebDriver automation**

   ```bash
   safaridriver --enable
   ```

   This is a required Apple configuration step before automated sessions can run. It may show a macOS administrator authorization prompt. Do not use `sudo` unless the user explicitly asks.

4. **Install or validate the Appium Safari driver**

   ```bash
   appium driver list --installed --json
   appium driver install safari
   appium driver list --installed --json
   ```

   If install returns "already installed", ignore it and continue. Completion requires the installed driver list to include `safari`.

5. **Run Appium doctor if supported**

   ```bash
   appium driver doctor safari
   ```

   If doctor is supported, accept a pass only when the output reports `0 required fixes needed`; optional warnings are non-blocking. If the command says doctor is unsupported or unavailable for `safari`, mark doctor as `not-supported` and continue.

6. **Optional iOS simulator readiness preflight**

   Run this only when the user wants iOS Simulator Safari automation.

   ```bash
   xcodebuild -version
   xcode-select -p
   xcrun simctl list devices available
   ```

   Use capabilities with `platformName: "iOS"`, `appium:automationName: "Safari"`, `browserName: "Safari"` or a client-compatible Safari browser name, and `safari:useSimulator: true`.

7. **Real iOS device prerequisite**

   For real devices, tell the user to enable Remote Automation on the device:

   `Settings -> Safari -> Advanced -> Remote Automation`

   Do not attempt signing, WebDriverAgent, or XCUITest real-device setup from this reference. Route those requests to `skills/xcuitest-real-device-config/SKILL.md` only when explicitly needed.

8. **Start Appium server smoke test**

   ```bash
   appium server
   ```

   Keep this server process running in Terminal A.

   In Terminal B, run:

   ```bash
   curl -s http://127.0.0.1:4723/status
   ```

   First confirm `/status` responds successfully. Then confirm startup/readiness from server logs and ensure the `Available drivers:` block contains `safari` (for example, `- safari@<version> (automationName 'Safari')`).

   If startup banner logs are unavailable, use this fallback verification path:

   - `appium driver list --installed --json` includes `safari`
   - `/status` reports server readiness

   After smoke validation, clean up the running Appium server:

   - In Terminal A, stop the server with `Ctrl+C`.
   - Verify no leftover Appium server process:

   ```bash
   pgrep -fl "appium.*server" || echo "no appium server process"
   ```

## Agent Completion Criteria

Mark complete only when all are true:

- `appium -v` succeeds and reports Appium 3.x.
- `safaridriver --version` succeeds.
- Safari WebDriver automation was already enabled or `safaridriver --enable` completed.
- `appium driver list --installed --json` includes `safari`.
- If `appium driver doctor safari` is supported, it reports `0 required fixes needed`.
- If doctor is unsupported, doctor status is reported as `not-supported`.
- `/status` check returns a successful Appium readiness response.
- Server logs or installed-driver fallback confirm `safari` is available.
- Appium smoke-test server process is cleanly stopped after validation.

## Evidence To Report

- `appium -v`
- installed `safari` driver version from `appium driver list --installed --json`
- `safaridriver --version`
- active macOS version from `sw_vers`
- doctor result, or `not-supported`
- optional simulator inventory when simulator validation was requested
- `/status` smoke-test response
- server log evidence that `Available drivers:` includes `safari`
- cleanup verification

## Self-Improvement Prompt

After use, always run this self-improvement check before the final response. Report any missing, ambiguous, outdated, or retry-causing instruction wording. Do not edit the skill unless asked.

- Is Safari driver doctor behavior still accurate for the installed driver version?
- Did the `safaridriver --enable` authorization flow need clearer wording?
- Did iOS Simulator or real-device Safari setup require extra routing instructions?
- Did any command need a platform-specific variant not documented here?

## Constraints

- macOS only.
- Use global npm/Appium by default.
- Use `npx appium` only if the user explicitly requests local execution.
- Do not use `sudo` unless the user explicitly requests it.
- Optional warnings are non-blocking.
- Ask before installing optional dependencies.
- Do not claim readiness until install/list and smoke checks pass.

---
name: "chromium-02"
description: "Preserved chromium setup procedure part 2 of 8"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# chromium Part 2

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-chromium.md; strip this generated header when comparing -->

- If no supported Chromium-based browser is available and the user explicitly approves optional browser setup: install Chrome or Chromium with OS-native package tooling, then re-run browser availability checks.
- If running inside WSL and browser install is requested: prefer distro package-manager installation as root in WSL (for example via `wsl -u root`) rather than user-space `.deb` extraction, because runtime shared-library dependencies are otherwise easy to miss.
- If Chrome is present but fails to start with missing shared libraries (for example `libnspr4.so`): treat this as an incomplete Linux dependency install and fix with package-manager dependencies before continuing.
- If the user does not request a pinned chromedriver version and no chromedriver binary is present in the environment: run `appium driver run chromium install-chromedriver` before smoke validation.
- If the user explicitly targets Microsoft Edge: treat `msedgedriver` setup as a separate optional step, require a driver version matching the installed Edge build, and pass it through `appium:executable` because automatic chromedriver download does not cover Edge.

## Instructions
1. **Run prerequisite skill**
   Run `environment-setup-node`. Continue only after its completion criteria pass.

2. **Install/upgrade Appium and Chromium driver**
   ```bash
   npm install -g appium@latest
   appium driver install chromium || appium driver update chromium
   appium driver list --installed --json || appium driver list --installed
   ```

---
id: appium-setup-routing
owner: skills/setup
status: stable
---

# Appium Setup Routing Context

Reusable setup-routing contract for Appium environment work.

Confirm target platform, driver, host OS, command mode, available devices or browsers, and optional dependency requests before changing the environment. Use global `appium` commands by default and use `npx appium` only when local mode is explicitly requested.

Completion requires the selected reference criteria. Driver doctor required fixes must be `0` when doctor is supported; optional warnings do not block completion.

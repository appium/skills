---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/mac2/mac2-decision-logic.md"
id: appium.setup.references.mac2.mac2-decision-logic
name: "mac2-decision-logic"
description: "Decide Mac2 setup path from macOS host, Appium mode, Xcode state, and privacy authorization needs"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/mac2/mac2-decision-logic.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/mac2/mac2-decision-logic.md bounded command output, local paths, driver names, IDs, and logs

---

# mac2-decision-logic

## Inputs To Confirm

- Host is macOS.
- Global Appium mode (`appium`) or explicit local mode (`npx appium`).
- Target app style: bundle ID, app path, or system app.
- Whether the user is ready to grant Accessibility, Screen Recording, or other macOS privacy prompts if sessions require them.

## Required Gates

1. Node.js and npm satisfy `contexts/tools/appium/setup/node-environment.md`.
2. Xcode tooling satisfies `mac2-xcode-prereqs.md`.
3. `appium -v` succeeds and Appium major version is `>= 3`.
4. `appium driver list --installed` includes `mac2`.
5. `appium driver doctor mac2` reports `0 required fixes needed`.

## Authorization Boundary

Do not silently change macOS privacy settings. If doctor or a session reports missing Accessibility, Screen Recording, automation, or developer tool permission, pause and guide the user through the exact setting or command they approved.

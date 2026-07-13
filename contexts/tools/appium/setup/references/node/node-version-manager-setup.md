---
security_profile: appium-local-workflows
owner: appium
id: appium.setup.references.node.node-version-manager-setup
name: "node-version-manager-setup"
description: "Use maintained Node version managers and Windows fnm setup when Node is missing or too old"

---

# node-version-manager-setup

## Preferred Managers

Use the first maintained manager already present:

- `nvm`
- `fnm`
- `asdf`

Install or switch to active LTS, then re-run `node tools/appium/setup/scripts/check-node-env.mjs`.

## Windows Fallback

When no maintained manager exists on Windows, install `fnm`:

```powershell
winget install Schniz.fnm --accept-source-agreements --accept-package-agreements
fnm install --lts
fnm use --lts
```

If a new PowerShell session cannot find `node`, add `fnm` initialization to the CurrentUser profile, reopen the shell, and validate again.

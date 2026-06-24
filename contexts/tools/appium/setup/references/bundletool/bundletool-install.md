---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/bundletool/bundletool-install.md"
id: appium.setup.references.bundletool.bundletool-install
name: "bundletool-install"
description: "Download bundletool.jar from official GitHub releases and place it on user PATH"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/bundletool/bundletool-install.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/bundletool/bundletool-install.md bounded command output, local paths, driver names, IDs, and logs

---

# bundletool-install

## macOS/Linux

```bash
mkdir -p "$HOME/bin"
RELEASE_API="https://api.github.com/repos/google/bundletool/releases/latest"
DOWNLOAD_URL=$(curl -fsSL "$RELEASE_API" | grep -Eo 'https://[^"]+/bundletool-all-[^"]+\.jar' | head -1)
curl -fL "$DOWNLOAD_URL" -o "$HOME/bin/bundletool.jar"
chmod +x "$HOME/bin/bundletool.jar"
export PATH="$HOME/bin:$PATH"
```

## Windows PowerShell

```powershell
$targetDir = "$HOME\bin"
New-Item -ItemType Directory -Force $targetDir | Out-Null
$release = Invoke-RestMethod "https://api.github.com/repos/google/bundletool/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '^bundletool-all-.*\.jar$' } | Select-Object -First 1
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile "$targetDir\bundletool.jar"
```

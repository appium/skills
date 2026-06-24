---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/bundletool/bundletool-validation.md"
id: appium.setup.references.bundletool.bundletool-validation
name: "bundletool-validation"
description: "Validate bundletool.jar path, version, and setup evidence"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/bundletool/bundletool-validation.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/bundletool/bundletool-validation.md bounded command output, local paths, driver names, IDs, and logs

---

# bundletool-validation

## Validation

macOS/Linux:

```bash
command -v bundletool.jar
java -jar "$(command -v bundletool.jar)" version
```

Windows PowerShell:

```powershell
$btPath = ($env:Path -split ';' | ForEach-Object { Join-Path $_ 'bundletool.jar' } | Where-Object { Test-Path $_ } | Select-Object -First 1)
$btPath
java -jar $btPath version
```

Report the path and version output. Mark complete only when both commands succeed.

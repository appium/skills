---
owner: appium
id: platform.android.bundletool.validation
name: "bundletool-validation"
description: "Validate bundletool.jar path, version, and setup evidence"
status: stable

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

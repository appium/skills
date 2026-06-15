---
name: "bundletool-02"
description: "Preserved bundletool setup procedure part 2 of 3"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# bundletool Part 2

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-bundletool.md; strip this generated header when comparing -->

   Windows PowerShell:
   ```powershell
   $targetDir = "$HOME\bin"
   New-Item -ItemType Directory -Force $targetDir | Out-Null
   $release = Invoke-RestMethod "https://api.github.com/repos/google/bundletool/releases/latest"
   $asset = $release.assets | Where-Object { $_.name -match '^bundletool-all-.*\.jar$' } | Select-Object -First 1
   if (-not $asset) { throw "bundletool release asset not found" }
   Invoke-WebRequest -Uri $asset.browser_download_url -OutFile "$targetDir\bundletool.jar"
   $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
   if ($currentPath -notlike "*$targetDir*") {
     [Environment]::SetEnvironmentVariable('Path', "$currentPath;$targetDir", 'User')
   }
   $env:Path = [Environment]::GetEnvironmentVariable('Path', 'User')
   ```

3. **Validate installation**
   macOS/Linux:
   ```bash
   command -v bundletool.jar
   java -jar "$(command -v bundletool.jar)" version
   ```
   Windows PowerShell:
   ```powershell
   $btPath = ($env:Path -split ';' | Where-Object { $_ -and (Test-Path (Join-Path $_ 'bundletool.jar')) } | ForEach-Object { Join-Path $_ 'bundletool.jar' } | Select-Object -First 1)
   if (-not $btPath) { throw "bundletool.jar not found in PATH directories" }
   $btPath
   java -jar $btPath version
   ```

4. **Report task result**
   Include:
   - resolved `bundletool.jar` path
   - `bundletool` version output
   - whether installation was skipped because bundletool was already present

## Completion criteria
Mark complete only when all are true:
- `bundletool.jar` is resolvable from `PATH`
- `java -jar <bundletool.jar> version` succeeds
- result summary states whether install was performed or skipped

## Evidence To Report

- host OS
- whether bundletool was already present or installed
- GitHub release tag and asset URL when a download was performed
- checksum/signature verification source when available
- resolved `bundletool.jar` path

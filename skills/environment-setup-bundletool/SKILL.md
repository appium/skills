---
name: "environment-setup-bundletool"
description: "Install and validate bundletool.jar from GitHub releases for optional UiAutomator2/Espresso capabilities"
metadata:
  last_modified: "Thu, 12 Mar 2026 03:25:00 GMT"

---
# environment-setup-bundletool

## Goal
Installs and validates `bundletool.jar` from official GitHub releases so Android App Bundle tooling is available when explicitly requested for UiAutomator2 or Espresso setup.

## Decision Logic
- If host OS is unsupported: stop and ask the user to run on macOS, Linux, or Windows.
- If user did not explicitly request bundletool setup: skip this skill.
- If `bundletool.jar` is already resolvable via `PATH`: do not reinstall; validate and report current version.
- If `bundletool.jar` is not present in `PATH`: download the latest release asset (`bundletool-all-*.jar`) from `https://github.com/google/bundletool/releases` and place it in a `PATH` directory.

## Instructions
1. **Detect OS and current bundletool availability**
   macOS/Linux:
   ```bash
   uname -s
   command -v bundletool.jar || echo "bundletool.jar not found"
   if command -v bundletool.jar >/dev/null 2>&1; then java -jar "$(command -v bundletool.jar)" version; fi
   ```
   Windows PowerShell:
   ```powershell
   [System.Environment]::OSVersion.VersionString
   $btPath = ($env:Path -split ';' | Where-Object { $_ -and (Test-Path (Join-Path $_ 'bundletool.jar')) } | ForEach-Object { Join-Path $_ 'bundletool.jar' } | Select-Object -First 1)
   $btPath
   if ($btPath) { java -jar $btPath version }
   ```

2. **Download latest `bundletool-all-*.jar` when missing**
   macOS/Linux:
   ```bash
   mkdir -p "$HOME/bin"
   RELEASE_API="https://api.github.com/repos/google/bundletool/releases/latest"
   DOWNLOAD_URL=$(curl -fsSL "$RELEASE_API" | grep -Eo 'https://github.com/google/bundletool/releases/download/[^\"]+/bundletool-all-[^\"]+\.jar' | head -n 1)
   test -n "$DOWNLOAD_URL"
   curl -fL "$DOWNLOAD_URL" -o "$HOME/bin/bundletool.jar"
   chmod +x "$HOME/bin/bundletool.jar"
   export PATH="$HOME/bin:$PATH"
   ```
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

## Constraints
- This is an optional skill; run only when the user explicitly requests bundletool setup.
- Ask the user before installing optional dependencies.
- If privileged commands are required, pause and provide exact commands for user execution.
- Do not modify unrelated Appium, Android SDK, Java, or Xcode configuration in this skill.

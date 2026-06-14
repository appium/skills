# Bundletool Setup

## Goal
Install and validate `bundletool.jar` from official GitHub releases for optional UiAutomator2 or Espresso Android App Bundle workflows.

## Decision Logic
- If host OS is not macOS, Linux, or Windows, stop and ask for a supported host.
- If `bundletool.jar` is already resolvable from `PATH`, do not reinstall; validate and report current version.
- If missing, download the latest `bundletool-all-*.jar` release asset from `https://github.com/google/bundletool/releases`.
- Place the jar in a user-writable tools directory such as `$HOME/bin`.
- Do not change Java, Android SDK, Appium, or Xcode setup in this reference.

## Preflight Commands
macOS/Linux:

```bash
uname -s
command -v bundletool.jar || echo "bundletool.jar not found"
if command -v bundletool.jar >/dev/null; then java -jar "$(command -v bundletool.jar)" version; fi
java -version
```

Windows PowerShell:

```powershell
[System.Environment]::OSVersion.VersionString
$btPath = ($env:Path -split ';' | Where-Object { Test-Path (Join-Path $_ 'bundletool.jar') } | ForEach-Object { Join-Path $_ 'bundletool.jar' } | Select-Object -First 1)
$btPath
if ($btPath) { java -jar $btPath version }
java -version
```

## Install When Missing
macOS/Linux:

```bash
mkdir -p "$HOME/bin"
RELEASE_API="https://api.github.com/repos/google/bundletool/releases/latest"
DOWNLOAD_URL="$(curl -fsSL "$RELEASE_API" | grep -Eo 'https://[^"]+/bundletool-all-[^"]+\.jar' | head -n 1)"
test -n "$DOWNLOAD_URL"
curl -fL "$DOWNLOAD_URL" -o "$HOME/bin/bundletool.jar"
chmod +x "$HOME/bin/bundletool.jar"
export PATH="$HOME/bin:$PATH"
```

Windows PowerShell:

```powershell
$targetDir = "$HOME\bin"
New-Item -ItemType Directory -Force $targetDir
$release = Invoke-RestMethod "https://api.github.com/repos/google/bundletool/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '^bundletool-all-.*\.jar$' } | Select-Object -First 1
if (-not $asset) { throw "bundletool release asset not found" }
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile "$targetDir\bundletool.jar"
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notlike "*$targetDir*") {
  [Environment]::SetEnvironmentVariable('Path', "$currentPath;$targetDir", 'User')
}
```

## Verification
Run:

```bash
command -v bundletool.jar
java -jar "$(command -v bundletool.jar)" version
```

## Completion Criteria
- `bundletool.jar` is resolvable from `PATH`.
- `java -jar <bundletool.jar> version` succeeds.
- The result states whether install was performed or skipped.

## Evidence To Report
Report host OS, release tag or asset URL when downloaded, `bundletool.jar` path, version output, and whether installation was skipped because bundletool was already present.

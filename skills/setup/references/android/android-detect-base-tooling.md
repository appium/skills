---
name: "android-detect-base-tooling"
description: "Detect Android setup host, Java, SDK variables, ADB, and emulator binary"
---

# android-detect-base-tooling

## Detect OS And Base Tooling

Run this before installing anything.

macOS/Linux:

```bash
uname -s
uname -m
java -version
javac -version
echo "$JAVA_HOME"
echo "$ANDROID_HOME"
command -v adb
test -x "$ANDROID_HOME/emulator/emulator" && echo "emulator binary: OK"
```

Windows PowerShell:

```powershell
[System.Environment]::OSVersion.VersionString
[System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture
java -version
javac -version
$env:JAVA_HOME
$env:ANDROID_HOME
Get-Command adb.exe -ErrorAction SilentlyContinue
Test-Path "$env:ANDROID_HOME\emulator\emulator.exe"
```

## SDK Path Trigger

Run Android SDK command-line tools setup only when the configured SDK path is missing.

macOS/Linux:

```bash
test -n "$ANDROID_HOME" && test -d "$ANDROID_HOME" || echo "run Android SDK tools setup"
```

Windows PowerShell:

```powershell
if (-not $env:ANDROID_HOME -or -not (Test-Path $env:ANDROID_HOME)) { "run Android SDK tools setup" }
```

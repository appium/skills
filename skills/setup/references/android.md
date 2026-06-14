# Android Setup

## Goal
Validate Android SDK, Java, adb, emulator, environment variables, SDK packages, and device or emulator readiness for Android Appium drivers.

## Decision Logic
- If the host OS is not macOS, Linux, or Windows, stop and ask the user to switch hosts.
- If `java -version` and `javac -version` already pass, keep the existing Java setup and do not reconfigure `JAVA_HOME`.
- Prefer existing Android Studio or command-line tools paths before installing anything.
- Skip emulator preparation when at least one Android device is connected or at least one AVD already exists.
- Install missing SDK packages only after confirming the exact gap.

## Preflight Commands
macOS/Linux:

```bash
uname -s
java -version
javac -version
echo "$JAVA_HOME"
echo "$ANDROID_HOME"
echo "$ANDROID_SDK_ROOT"
command -v adb || true
adb version
adb devices -l
command -v sdkmanager || true
command -v avdmanager || true
command -v emulator || true
test -x "$ANDROID_HOME/emulator/emulator" && echo "emulator binary: OK"
"$ANDROID_HOME/emulator/emulator" -list-avds || true
```

Windows PowerShell:

```powershell
[System.Environment]::OSVersion.VersionString
java -version
javac -version
$env:JAVA_HOME
$env:ANDROID_HOME
$env:ANDROID_SDK_ROOT
Get-Command adb.exe -ErrorAction SilentlyContinue
adb.exe version
adb.exe devices -l
Get-Command sdkmanager.bat -ErrorAction SilentlyContinue
Get-Command avdmanager.bat -ErrorAction SilentlyContinue
Test-Path "$env:ANDROID_HOME\emulator\emulator.exe"
```

## Common SDK Paths
- macOS: `$HOME/Library/Android/sdk`
- Linux: `$HOME/Android/Sdk`
- Windows: `%LOCALAPPDATA%\Android\Sdk`
- macOS Android Studio JBR: `/Applications/Android Studio.app/Contents/jbr/Contents/Home` or `$HOME/Applications/Android Studio.app/Contents/jbr/Contents/Home`
- Windows Android Studio JBR: `%LOCALAPPDATA%\Programs\Android Studio\jbr` or `C:\Program Files\Android\Android Studio\jbr`

## PATH Setup
macOS:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$PATH"
```

Linux:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$PATH"
```

Windows PowerShell:

```powershell
[Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
$androidPaths = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin;$env:LOCALAPPDATA\Android\Sdk\emulator"
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notlike "*$androidPaths*") {
  [Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPaths", 'User')
}
```

## SDK Package Repair
macOS/Linux:

```bash
sdkmanager --sdk_root="$ANDROID_HOME" --licenses
sdkmanager --sdk_root="$ANDROID_HOME" "platform-tools" "emulator" "cmdline-tools;latest"
LATEST_PLATFORM="$(sdkmanager --sdk_root="$ANDROID_HOME" --list | grep -Eo 'platforms;android-[0-9]+' | sort -V | tail -n 1)"
LATEST_BUILD_TOOLS="$(sdkmanager --sdk_root="$ANDROID_HOME" --list | grep -Eo 'build-tools;[0-9][^ ]*' | sort -V | tail -n 1)"
sdkmanager --sdk_root="$ANDROID_HOME" "$LATEST_PLATFORM" "$LATEST_BUILD_TOOLS"
```

Windows PowerShell:

```powershell
cmd /c "sdkmanager.bat --licenses"
sdkmanager.bat "platform-tools" "emulator" "cmdline-tools;latest"
```

## Emulator Preparation
Prefer a connected real device or existing AVD. When creating an AVD, choose the latest stable `google_apis` system image and prefer the native host architecture first (`arm64-v8a` on Apple Silicon, `x86_64` on Intel), then fallback.

macOS/Linux:

```bash
emulator -version
emulator -list-avds
adb devices -l
```

## Verification
Verify Java/Javac, adb, emulator, SDK paths, required packages, and a connected device or prepared emulator. Then run the requested Android driver doctor and confirm `0 required fixes needed`.

Report Java version, `ANDROID_HOME`, adb path/version, `adb devices -l`, emulator inventory, installed SDK package changes, and whether emulator preparation was skipped because a device or AVD already existed.

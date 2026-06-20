---
owner: appium
id: appium.setup.references.android.android-sdk-packages-and-path
name: "android-sdk-packages-and-path"
description: "Configure Android SDK environment variables, accept licenses, and install required SDK packages"

---

# android-sdk-packages-and-path

## Configure Android SDK Variables

macOS:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$PATH"
echo "$ANDROID_HOME"
command -v adb
ls "$ANDROID_HOME/emulator/emulator"
```

Linux:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$PATH"
echo "$ANDROID_HOME"
command -v adb
ls "$ANDROID_HOME/emulator/emulator"
```

Windows PowerShell:

```powershell
[Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
$androidPaths = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin;$env:LOCALAPPDATA\Android\Sdk\emulator"
$currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ($currentPath -notlike "*$env:LOCALAPPDATA\Android\Sdk\platform-tools*") {
  [Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPaths", 'User')
}
$env:ANDROID_HOME = [Environment]::GetEnvironmentVariable('ANDROID_HOME', 'User')
$env:PATH = "$androidPaths;$env:PATH"
```

After configuration, run `node tools/appium/setup/scripts/check-android-env.mjs` and verify `paths.missingRecommendedPathEntries` is empty or explain which shell startup file still needs the entries.

## Accept Licenses And Install Packages

macOS/Linux:

```bash
yes | sdkmanager --sdk_root="$ANDROID_HOME" --licenses
sdkmanager --sdk_root="$ANDROID_HOME" "platform-tools" "emulator" "platforms;android-35" "build-tools;35.0.0"
adb version
"$ANDROID_HOME/emulator/emulator" -version
```

Windows PowerShell:

```powershell
sdkmanager --sdk_root="$env:ANDROID_HOME" --licenses
sdkmanager --sdk_root="$env:ANDROID_HOME" "platform-tools" "emulator" "platforms;android-35" "build-tools;35.0.0"
adb version
& "$env:ANDROID_HOME\emulator\emulator.exe" -version
```

After package installation, use the script's `installed` object as the deterministic pass/fail summary.

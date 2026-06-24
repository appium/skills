---
owner: appium
policy_scope: "contexts/tools/appium/setup/references/android/android-sdk-commandline-tools.md"
id: appium.setup.references.android.android-sdk-commandline-tools
name: "android-sdk-commandline-tools"
description: "Install Android SDK command-line tools only when the SDK path is missing"
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/references/android/android-sdk-commandline-tools.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/references/android/android-sdk-commandline-tools.md bounded command output, local paths, driver names, IDs, and logs

---

# android-sdk-commandline-tools

## Platform Defaults

- macOS: `$HOME/Library/Android/sdk`
- Linux: `$HOME/Android/Sdk`
- Windows: `%LOCALAPPDATA%\Android\Sdk`

## macOS Android Studio Path

- Download Android Studio from `https://developer.android.com/studio`.
- Check both `/Applications/Android Studio.app` and `$HOME/Applications/Android Studio.app`.
- Use Android Studio's bundled JBR when command-line tools require Java.

macOS CLI tools example:

```bash
ANDROID_CMDLINE_TOOLS_VERSION=14742923
ANDROID_CMDLINE_TOOLS_WORKDIR="$(mktemp -d -t android-cmdline-tools.XXXXXX)"
ANDROID_CMDLINE_TOOLS_ZIP="$ANDROID_CMDLINE_TOOLS_WORKDIR/commandlinetools-mac-${ANDROID_CMDLINE_TOOLS_VERSION}.zip"
curl -L -o "$ANDROID_CMDLINE_TOOLS_ZIP" "https://dl.google.com/android/repository/commandlinetools-mac-${ANDROID_CMDLINE_TOOLS_VERSION}_latest.zip"
unzip -q "$ANDROID_CMDLINE_TOOLS_ZIP" -d "$ANDROID_CMDLINE_TOOLS_WORKDIR"
export JAVA_HOME="$HOME/Applications/Android Studio.app/Contents/jbr/Contents/Home"
if [ ! -d "$JAVA_HOME" ]; then
  export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
fi
export PATH="$JAVA_HOME/bin:$PATH"
"$ANDROID_CMDLINE_TOOLS_WORKDIR/cmdline-tools/bin/sdkmanager" --sdk_root="$HOME/Library/Android/sdk" "cmdline-tools;latest"
```

macOS Homebrew fallback:

```bash
test -d "/Applications/Android Studio.app" || echo "Install Android command-line tools with a user-approved, pinned Homebrew cask or Android Studio package."
mkdir -p "$HOME/Library/Android/sdk/cmdline-tools/latest"
cp -R /opt/homebrew/share/android-commandlinetools/* "$HOME/Library/Android/sdk/cmdline-tools/latest/"
```

Linux example:

```bash
Only after explicit user approval for privileged package installation:
sudo apt-get update
sudo apt-get install -y unzip wget openjdk-21-jdk
mkdir -p "$HOME/Android/Sdk/cmdline-tools/latest"
```

Windows PowerShell example:

```powershell
New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest"
```

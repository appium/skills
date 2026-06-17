---
name: "android-sdk-commandline-tools"
description: "Install Android SDK command-line tools only when the SDK path is missing"
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
curl -L -o /tmp/commandlinetools-mac-latest.zip https://dl.google.com/android/repository/commandlinetools-mac-14742923_latest.zip
unzip -q /tmp/commandlinetools-mac-latest.zip -d /tmp/android-cmdline-tools
export JAVA_HOME="$HOME/Applications/Android Studio.app/Contents/jbr/Contents/Home"
if [ ! -d "$JAVA_HOME" ]; then
  export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
fi
export PATH="$JAVA_HOME/bin:$PATH"
/tmp/android-cmdline-tools/cmdline-tools/bin/sdkmanager --sdk_root="$HOME/Library/Android/sdk" "cmdline-tools;latest"
```

macOS Homebrew fallback:

```bash
test -d "/Applications/Android Studio.app" || brew install --cask android-commandlinetools
mkdir -p "$HOME/Library/Android/sdk/cmdline-tools/latest"
cp -R /opt/homebrew/share/android-commandlinetools/* "$HOME/Library/Android/sdk/cmdline-tools/latest/"
```

Linux example:

```bash
sudo apt-get update
sudo apt-get install -y unzip wget openjdk-21-jdk
mkdir -p "$HOME/Android/Sdk/cmdline-tools/latest"
```

Windows PowerShell example:

```powershell
New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest"
```

---
owner: appium
id: appium.setup.references.android.android-sdk-commandline-tools
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
- Prefer installing `Android Studio.app` in `/Applications`; use `$HOME/Applications/Android Studio.app` only when the user explicitly requests a user-local app install or `/Applications` is unavailable.
- Check `/Applications/Android Studio.app` before `$HOME/Applications/Android Studio.app`.
- Use Android Studio's bundled JBR when command-line tools require Java.
- Keep the Android SDK at the macOS user-local default `$HOME/Library/Android/sdk`, even when Android Studio itself is installed in `/Applications`.

macOS CLI tools example:

```bash
ANDROID_TOOLS_TMP_DIR="$(mktemp -d)"
curl -L -o "$ANDROID_TOOLS_TMP_DIR/commandlinetools-mac-latest.zip" https://dl.google.com/android/repository/commandlinetools-mac-14742923_latest.zip
unzip -q "$ANDROID_TOOLS_TMP_DIR/commandlinetools-mac-latest.zip" -d "$ANDROID_TOOLS_TMP_DIR/android-cmdline-tools"
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
if [ ! -d "$JAVA_HOME" ]; then
  export JAVA_HOME="$HOME/Applications/Android Studio.app/Contents/jbr/Contents/Home"
fi
export PATH="$JAVA_HOME/bin:$PATH"
"$ANDROID_TOOLS_TMP_DIR/android-cmdline-tools/cmdline-tools/bin/sdkmanager" --sdk_root="$HOME/Library/Android/sdk" "cmdline-tools;latest"
```
Delete `ANDROID_TOOLS_TMP_DIR` after the command-line tools are installed.

macOS Homebrew fallback:

```bash
test -d "/Applications/Android Studio.app" || brew install --cask android-commandlinetools
mkdir -p "$HOME/Library/Android/sdk/cmdline-tools/latest"
cp -R /opt/homebrew/share/android-commandlinetools/* "$HOME/Library/Android/sdk/cmdline-tools/latest/"
```

Linux package prerequisites, after explicit human approval for privileged
package changes: `unzip`, `wget`, and `openjdk-21-jdk` on Debian/Ubuntu-style
systems.

```bash
mkdir -p "$HOME/Android/Sdk/cmdline-tools/latest"
```

Windows PowerShell example:

```powershell
New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest"
```

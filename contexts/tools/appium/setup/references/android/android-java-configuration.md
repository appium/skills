---
owner: appium
id: appium.setup.references.android.android-java-configuration
name: "android-java-configuration"
description: "Configure Java for Android setup only when java or javac is missing"

---

# android-java-configuration

## macOS Primary

```bash
if [ -d "/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]; then
  export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
elif [ -d "$HOME/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]; then
  export JAVA_HOME="$HOME/Applications/Android Studio.app/Contents/jbr/Contents/Home"
fi
if [ -n "$JAVA_HOME" ] && [ -d "$JAVA_HOME" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi
java -version
javac -version
```

## Linux Primary

```bash
if [ -d "$HOME/android-studio/jbr" ]; then
  export JAVA_HOME="$HOME/android-studio/jbr"
elif [ -d "/opt/android-studio/jbr" ]; then
  export JAVA_HOME="/opt/android-studio/jbr"
elif [ -d "/usr/local/android-studio/jbr" ]; then
  export JAVA_HOME="/usr/local/android-studio/jbr"
fi
if [ -n "$JAVA_HOME" ] && [ -d "$JAVA_HOME" ]; then
  export PATH="$JAVA_HOME/bin:$PATH"
fi
java -version
javac -version
```

## Linux Fallback

```bash
export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
export PATH="$JAVA_HOME/bin:$PATH"
java -version
javac -version
```

## Windows Primary

```powershell
$studioJbrCandidates = @(
  "$env:LOCALAPPDATA\Programs\Android Studio\jbr",
  "C:\Program Files\Android\Android Studio\jbr"
)
$studioJbr = $studioJbrCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($studioJbr) {
  [Environment]::SetEnvironmentVariable('JAVA_HOME', $studioJbr, 'User')
  $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
  if ($currentPath -notlike "*$studioJbr\bin*") {
    [Environment]::SetEnvironmentVariable('Path', "$currentPath;$studioJbr\bin", 'User')
  }
  $env:JAVA_HOME = $studioJbr
  $env:PATH = "$studioJbr\bin;$env:PATH"
}
java -version
javac -version
```

## Windows Fallback

Use Microsoft OpenJDK only when Android Studio JBR is unavailable and Java is missing.

## macOS Learned Constraint

When installing Android Studio during setup, prefer `/Applications/Android Studio.app` so `JAVA_HOME=/Applications/Android Studio.app/Contents/jbr/Contents/Home` is stable across shells and matches Appium doctor output. Preserve an existing working Java setup unless Java or `javac` is missing.

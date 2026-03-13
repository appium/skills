---
name: "environment-setup-android"
description: "Prepare and validate Android SDK, Java, and device tooling for Appium Android drivers"
metadata:
  last_modified: "Thu, 12 Mar 2026 00:00:00 GMT"

---
# environment-setup-android

## Goal
Prepares a working Android automation environment for Appium by validating Java, Android SDK command-line tools, required SDK packages, environment variables, and ADB device visibility, with a verify-and-fix loop until all mandatory checks pass.

## Decision Logic
- If host OS is unsupported for Android SDK setup: stop and ask the user to switch to macOS, Linux, or Windows.
- If `java -version` and `javac -version` already succeed: keep the existing Java setup and do not reconfigure `JAVA_HOME`.
- If host OS is macOS and Java setup is needed (fresh environment): use Android Studio app setup (`/Applications/Android Studio.app`) as the primary method for both `ANDROID_HOME` (`$HOME/Library/Android/sdk`) and `JAVA_HOME` (Android Studio JBR), then fallback to Homebrew if Android Studio is unavailable.
- If host OS is Linux and Java setup is needed (fresh environment): use Android Studio bundled JBR as the primary method when Android Studio is installed, then fallback to distro/package-manager OpenJDK.
- If host OS is Windows and Java setup is needed (fresh environment): use Android Studio bundled JBR as the primary method when Android Studio is installed, then fallback to a JDK package install.
- If host OS is Linux: use package manager + `$HOME/Android/Sdk` conventions.
- If host OS is Windows: use Android SDK tools with persistent user environment variables.
- If `java` or `javac` is missing: run step 3 to install/configure Java.
- If the user wants official Android tooling setup flow: install Android Studio from the official site first, then use SDK Manager from Android Studio.
- If `ANDROID_HOME` is unset/empty or the `ANDROID_HOME` path does not exist: run step 2 to install command-line tools and create the SDK path.
- If Java tooling is missing or broken (`java`/`javac` checks fail): run step 3 before Android SDK package/license commands.
- If `adb` is missing: install `platform-tools` via `sdkmanager`.
- If emulator binary is missing under `ANDROID_HOME/emulator/emulator` (or Windows equivalent): install emulator packages.
- Prepare emulator instances using the latest stable system-image version by default.
- Use host-optimized emulator architecture (native architecture first, then fallback architecture).
- Skip step 7 emulator preparation if at least one device is already connected or at least one emulator instance already exists.
- If required SDK packages are missing: install them and re-run checks.

## Instructions
1. **Detect OS and validate Java/base tooling**
   macOS/Linux:
   ```bash
   uname -s
   java -version
   javac -version
   echo "$JAVA_HOME"
   command -v adb
   ls "$ANDROID_HOME/emulator/emulator"
   test -x "$ANDROID_HOME/emulator/emulator" && echo "emulator binary: OK"
   ```
   Windows PowerShell:
   ```powershell
   [System.Environment]::OSVersion.VersionString
   java -version
   javac -version
   $env:JAVA_HOME
   Get-Command adb.exe -ErrorAction SilentlyContinue
   Test-Path "$env:ANDROID_HOME\emulator\emulator.exe"
   ```

2. **Install Android SDK tooling when `ANDROID_HOME` path is missing**
   Trigger checks:
   - macOS/Linux:
   ```bash
   [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ] || echo "run step 2"
   ```
   - Windows PowerShell:
   ```powershell
   if (-not $env:ANDROID_HOME -or -not (Test-Path $env:ANDROID_HOME)) { "run step 2" }
   ```
   Option A (Android Studio app path; macOS priority when app exists):
   - Download Android Studio from `https://developer.android.com/studio`.
   - Complete first launch and install SDK components from SDK Manager.
   - Use platform default SDK path after setup:
     - macOS: `$HOME/Library/Android/sdk`
     - Linux: `$HOME/Android/Sdk`
     - Windows: `%LOCALAPPDATA%\Android\Sdk`

   Option B (CLI tools only):
   - macOS/Homebrew example:
   ```bash
   [ -d "/Applications/Android Studio.app" ] || brew install --cask android-commandlinetools
   mkdir -p "$HOME/Library/Android/sdk/cmdline-tools/latest"
   cp -R /opt/homebrew/share/android-commandlinetools/* "$HOME/Library/Android/sdk/cmdline-tools/latest/"
   ```
   - Linux example (Debian/Ubuntu-style prerequisites + cmdline tools placement):
   ```bash
   sudo apt-get update
   sudo apt-get install -y unzip wget openjdk-21-jdk
   mkdir -p "$HOME/Android/Sdk/cmdline-tools/latest"
   ```
   - Windows example (PowerShell, after extracting Android command-line tools zip):
   ```powershell
   New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest"
   ```

3. **Configure Java for fresh environments (skip if Java already works)**
   Trigger checks:
   - macOS/Linux:
   ```bash
   if command -v java >/dev/null 2>&1 && command -v javac >/dev/null 2>&1; then
     java -version >/dev/null 2>&1 && javac -version >/dev/null 2>&1 && echo "Java already available; skip step 3" || echo "run step 3"
   else
     echo "run step 3"
   fi
   ```
   - Windows PowerShell:
   ```powershell
   if ((Get-Command java.exe -ErrorAction SilentlyContinue) -and (Get-Command javac.exe -ErrorAction SilentlyContinue)) {
     java -version *> $null
     if ($LASTEXITCODE -eq 0) {
       javac -version *> $null
       if ($LASTEXITCODE -eq 0) { "Java already available; skip step 3" } else { "run step 3" }
     } else { "run step 3" }
   } else { "run step 3" }
   ```
   macOS primary method for fresh setup (Android Studio bundled JBR):
   ```bash
   if [ -d "/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]; then
     export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
     export PATH="$JAVA_HOME/bin:$PATH"
     java -version
     javac -version
   else
     echo "Android Studio JBR not found; use fallback method below"
   fi
   ```
   macOS fallback method (only when Android Studio is not installed):
   ```bash
   brew install --cask temurin
   export JAVA_HOME="$(/usr/libexec/java_home -v 21)"
   export PATH="$JAVA_HOME/bin:$PATH"
   java -version
   javac -version
   ```
   Linux primary method for fresh setup (Android Studio bundled JBR):
   ```bash
   if [ -d "$HOME/android-studio/jbr" ]; then
     export JAVA_HOME="$HOME/android-studio/jbr"
   elif [ -d "/opt/android-studio/jbr" ]; then
     export JAVA_HOME="/opt/android-studio/jbr"
   elif [ -d "/usr/local/android-studio/jbr" ]; then
     export JAVA_HOME="/usr/local/android-studio/jbr"
   else
     echo "Android Studio JBR not found; use fallback method below"
   fi
   if [ -n "$JAVA_HOME" ] && [ -d "$JAVA_HOME" ]; then
     export PATH="$JAVA_HOME/bin:$PATH"
     java -version
     javac -version
   fi
   ```
   Linux fallback method (OpenJDK 21 example):
   ```bash
   export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
   export PATH="$JAVA_HOME/bin:$PATH"
   java -version
   javac -version
   ```
   Windows primary method for fresh setup (Android Studio bundled JBR, persist for current user):
   ```powershell
   $studioJbr = "$env:LOCALAPPDATA\Programs\Android Studio\jbr"
   if (Test-Path $studioJbr) {
     [Environment]::SetEnvironmentVariable('JAVA_HOME', $studioJbr, 'User')
     $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
     if ($currentPath -notlike "*$studioJbr\bin*") {
       [Environment]::SetEnvironmentVariable('Path', "$currentPath;$studioJbr\bin", 'User')
     }
     $env:JAVA_HOME = [Environment]::GetEnvironmentVariable('JAVA_HOME', 'User')
     java -version
     javac -version
   } else {
     "Android Studio JBR not found; use fallback method below"
   }
   ```
   Windows fallback method (only when Android Studio is not installed):
   ```powershell
   winget install -e --id EclipseAdoptium.Temurin.21.JDK
   $jdkRoot = Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
   if ($jdkRoot) {
     [Environment]::SetEnvironmentVariable('JAVA_HOME', $jdkRoot.FullName, 'User')
     $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
     if ($currentPath -notlike "*$($jdkRoot.FullName)\\bin*") {
       [Environment]::SetEnvironmentVariable('Path', "$currentPath;$($jdkRoot.FullName)\\bin", 'User')
     }
     $env:JAVA_HOME = [Environment]::GetEnvironmentVariable('JAVA_HOME', 'User')
   }
   java -version
   javac -version
   ```

4. **Configure Android environment variables and PATH**
   macOS (priority: Android Studio SDK path):
   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
   echo "$ANDROID_HOME"
   command -v adb
   ls "$ANDROID_HOME/emulator/emulator"
   ```
   Linux:
   ```bash
   export ANDROID_HOME="$HOME/Android/Sdk"
   export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
   echo "$ANDROID_HOME"
   command -v adb
   ls "$ANDROID_HOME/emulator/emulator"
   ```
   Windows PowerShell (persist for current user):
   ```powershell
   [Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
   $androidPaths = "$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin"
   $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
   if ($currentPath -notlike "*$androidPaths*") {
     [Environment]::SetEnvironmentVariable('Path', "$currentPath;$androidPaths", 'User')
   }
   $env:ANDROID_HOME = [Environment]::GetEnvironmentVariable('ANDROID_HOME', 'User')
   ```

5. **Accept SDK licenses and install required packages**
   macOS/Linux:
   ```bash
   if command -v sdkmanager >/dev/null 2>&1; then yes | sdkmanager --licenses; fi
   if command -v sdkmanager >/dev/null 2>&1; then sdkmanager "platform-tools" "build-tools;34.0.0" "platforms;android-34" "emulator"; fi
   ```
   Windows PowerShell:
   ```powershell
   if (Get-Command sdkmanager.bat -ErrorAction SilentlyContinue) { cmd /c "echo y| sdkmanager.bat --licenses" }
   if (Get-Command sdkmanager.bat -ErrorAction SilentlyContinue) { sdkmanager.bat "platform-tools" "build-tools;34.0.0" "platforms;android-34" "emulator" }
   ```

6. **Verify Android SDK and ADB state**
   macOS/Linux:
   ```bash
   if command -v sdkmanager >/dev/null 2>&1; then sdkmanager --list | head -n 80; fi
   adb version
   ls "$ANDROID_HOME/emulator/emulator"
   test -x "$ANDROID_HOME/emulator/emulator" && echo "emulator binary: OK"
   ```
   Windows PowerShell:
   ```powershell
   if (Get-Command sdkmanager.bat -ErrorAction SilentlyContinue) { sdkmanager.bat --list }
   adb.exe version
   Test-Path "$env:ANDROID_HOME\emulator\emulator.exe"
   ```

7. **Optional emulator instance preparation (if no physical device is connected and no emulator exists)**
   Skip step 7 when either of the following is true:
   - At least one device is already connected (`adb devices` shows a `device` entry)
   - At least one emulator instance already exists (`emulator -list-avds` is non-empty)

   Prepare an emulator instance using the latest stable system-image version and host-optimized architecture only when both are false.
   macOS/Linux (prefer native architecture first, then fallback):
   ```bash
   ARCH=$(uname -m)
   if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
     PRIMARY_ARCH="arm64-v8a"
     FALLBACK_ARCH="x86_64"
   else
     PRIMARY_ARCH="x86_64"
     FALLBACK_ARCH="arm64-v8a"
   fi
   LATEST_API=$(sdkmanager --list | grep -o "system-images;android-[0-9]\+;google_apis;${PRIMARY_ARCH}" | sed 's/.*android-\([0-9]\+\).*/\1/' | sort -n | tail -1)
   IMAGE_ARCH="$PRIMARY_ARCH"
   if [ -z "$LATEST_API" ]; then
     LATEST_API=$(sdkmanager --list | grep -o "system-images;android-[0-9]\+;google_apis;${FALLBACK_ARCH}" | sed 's/.*android-\([0-9]\+\).*/\1/' | sort -n | tail -1)
     IMAGE_ARCH="$FALLBACK_ARCH"
   fi
   IMAGE="system-images;android-${LATEST_API};google_apis;${IMAGE_ARCH}"
   sdkmanager "$IMAGE"
   echo "no" | avdmanager create avd -n "api${LATEST_API}-google-${IMAGE_ARCH}" -k "$IMAGE"
   emulator -list-avds
   ```
   Windows PowerShell (prefer x86_64, fallback arm64-v8a):
   ```powershell
   $primaryArch = "x86_64"
   $fallbackArch = "arm64-v8a"
   $matches = sdkmanager.bat --list | Select-String "system-images;android-[0-9]+;google_apis;$primaryArch"
   $imageArch = $primaryArch
   if (-not $matches) {
     $matches = sdkmanager.bat --list | Select-String "system-images;android-[0-9]+;google_apis;$fallbackArch"
     $imageArch = $fallbackArch
   }
   $latestApi = ($matches | ForEach-Object { [int]([regex]::Match($_.Line, 'android-(\d+)').Groups[1].Value) } | Sort-Object)[-1]
   $image = "system-images;android-$latestApi;google_apis;$imageArch"
   sdkmanager.bat $image
   cmd /c "echo no| avdmanager.bat create avd -n api$latestApi-google-$imageArch -k $image"
   emulator.exe -list-avds
   ```
   Report version details in the task result:
   - macOS/Linux:
   ```bash
   emulator -version
   emulator -list-avds
   if command -v sdkmanager >/dev/null 2>&1; then sdkmanager --list | grep "system-images;android-" | head -n 20; fi
   ```
   - Windows PowerShell:
   ```powershell
   emulator.exe -version
   emulator.exe -list-avds
   if (Get-Command sdkmanager.bat -ErrorAction SilentlyContinue) { sdkmanager.bat --list | Select-String "system-images;android-" | Select-Object -First 20 }
   ```

8. **Completion criteria**
   Mark complete only when all are true:
   - `java -version` and `javac -version` succeed
   - `adb` is executable from `PATH`
   - Emulator binary exists under `ANDROID_HOME/emulator/emulator` (or `%ANDROID_HOME%\emulator\emulator.exe` on Windows)
   - Required SDK packages are installed (`platform-tools`, one platform, one build-tools version)
    - Existing Java setup is preserved when Java already works (no forced reconfiguration)
    - On fresh setup, Android Studio bundled JBR is used as `JAVA_HOME` when Android Studio is present (macOS/Linux/Windows)
   - Android environment checks pass without requiring a connected device
   - Latest stable emulator/system-image version is prepared with host-optimized architecture only when no connected devices and no existing emulators are present; otherwise step 7 is skipped and current version details are reported in the task result

## Constraints
- Always use detect-first behavior and install only missing components.
- Re-run validation commands after each install/config change.
- Do not report success if `adb` is unavailable or emulator binary check fails.
- Treat optional dependencies and optional doctor warnings as non-blocking unless the user requests those features.
- Ask the user before installing optional dependencies; do not install them by default.
- If privileged commands are needed, pause and provide exact commands for user execution.
- Keep Android setup independent from Appium driver installation steps.
- Use shell-appropriate commands (`bash` for macOS/Linux, PowerShell/cmd for Windows).

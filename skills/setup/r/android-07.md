---
name: "android-07"
description: "Preserved android setup procedure part 7 of 10"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# android Part 7

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-android.md; strip this generated header when comparing -->

    If license acceptance still fails in headless CI-like runs, pre-seed license hashes and retry package install:
    ```powershell
    $licensesDir = "$env:ANDROID_HOME\licenses"
    New-Item -ItemType Directory -Force $licensesDir | Out-Null
    Set-Content -Path "$licensesDir\android-sdk-license" -Value "24333f8a63b6825ea9c5514f83c2829b004d1fee`n8933bad161af4178b1185d1a37fbf41ea5269c55`nd56f5187479451eabf01fb78af6dfcb131a6481e"
    ```

6. **Verify Android SDK and ADB state**
   macOS/Linux:
   ```bash
   if command -v sdkmanager >/dev/null 2>&1; then sdkmanager --list | head -n 80; fi
   adb version
   command -v emulator
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

---
name: "android-08"
description: "Preserved android setup procedure part 8 of 10"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# android Part 8

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-android.md; strip this generated header when comparing -->

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

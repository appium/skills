---
name: "android-04"
description: "Preserved android setup procedure part 4 of 10"
metadata:
  last_modified: "Sun, 14 Jun 2026 00:00:00 GMT"
---

# android Part 4

<!-- preserved-source: 64dcf79:skills/setup/references/environment-setup-android.md; strip this generated header when comparing -->

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
   if [ -d "$HOME/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]; then
     export JAVA_HOME="$HOME/Applications/Android Studio.app/Contents/jbr/Contents/Home"
     export PATH="$JAVA_HOME/bin:$PATH"
     java -version
     javac -version
   elif [ -d "/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]; then
     export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
     export PATH="$JAVA_HOME/bin:$PATH"
     java -version
     javac -version
   else
     echo "Android Studio JBR not found; use fallback method below"
   fi
   ```

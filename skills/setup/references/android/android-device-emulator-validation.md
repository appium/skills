---
name: "android-device-emulator-validation"
description: "Validate Android device inventory, create an emulator only when needed, and capture final evidence"
---

# android-device-emulator-validation

## Device And Emulator Inventory

macOS/Linux and Windows PowerShell:

```bash
adb devices -l
emulator -list-avds
```

Skip emulator creation when either condition is true:

- `adb devices` shows at least one `device` entry.
- `emulator -list-avds` is non-empty.

## Create Emulator When Needed

macOS/Linux:

```bash
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
  PRIMARY_ARCH="arm64-v8a"
  FALLBACK_ARCH="x86_64"
else
  PRIMARY_ARCH="x86_64"
  FALLBACK_ARCH="arm64-v8a"
fi

LATEST_API=$(sdkmanager --list | grep -o "system-images;android-[0-9]\+;google_apis;${PRIMARY_ARCH}" | sed -E 's/.*android-([0-9]+).*/\1/' | sort -n | tail -1)
IMAGE_ARCH="$PRIMARY_ARCH"
if [ -z "$LATEST_API" ]; then
  LATEST_API=$(sdkmanager --list | grep -o "system-images;android-[0-9]\+;google_apis;${FALLBACK_ARCH}" | sed -E 's/.*android-([0-9]+).*/\1/' | sort -n | tail -1)
  IMAGE_ARCH="$FALLBACK_ARCH"
fi
IMAGE="system-images;android-${LATEST_API};google_apis;${IMAGE_ARCH}"
sdkmanager "$IMAGE"
avdmanager create avd -n "api${LATEST_API}-google-${IMAGE_ARCH}" -k "$IMAGE" --device "pixel"
emulator -list-avds
```

Windows should use the same ordering: native architecture first, fallback architecture second, install the selected `google_apis` image, then create a Pixel AVD with `avdmanager`.

## Final Validation

```bash
java -version
javac -version
echo "$JAVA_HOME"
echo "$ANDROID_HOME"
adb version
adb devices -l
emulator -version
emulator -list-avds
sdkmanager --list_installed
```

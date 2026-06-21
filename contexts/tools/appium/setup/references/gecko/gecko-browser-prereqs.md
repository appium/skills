---
owner: appium
id: appium.setup.references.gecko.gecko-browser-prereqs
name: "gecko-browser-prereqs"
description: "Validate Firefox browser availability and host prerequisites for Appium Gecko Driver"

---

# gecko-browser-prereqs

## Firefox Detection

Check for the selected Firefox channel before installing anything.

Common commands:

```bash
firefox --version
firefox-esr --version
firefoxdeveloperedition --version
firefox-nightly --version
```

Common macOS app paths:

```text
/Applications/Firefox.app
/Applications/Firefox Developer Edition.app
/Applications/Firefox Nightly.app
```

Common Windows executable paths:

```text
C:\Program Files\Mozilla Firefox\firefox.exe
C:\Program Files (x86)\Mozilla Firefox\firefox.exe
```

## Linux Notes

Before changing packages, verify that Firefox can start in the target environment. Headless hosts may need display support such as Xvfb or Firefox headless capabilities. Ask before running privileged package-manager commands.

Useful read-only checks:

```bash
firefox --version
firefox --headless --screenshot about:blank
```

## GeckoDriver Diagnostic Check

If a standalone GeckoDriver is installed, capture:

```bash
geckodriver --version
```

Do not treat this as required unless the Appium Gecko driver doctor or selected workflow requires it.

---
name: "setup"
description: "Use this skill to route Appium environment setup by platform and driver, load preserved setup references in order, keep optional dependencies gated by explicit request, and verify required Appium doctor checks."
---

# setup

## Use When
Use this skill for Appium environment setup across Android, iOS/macOS, Safari, Chromium, and shared Node prerequisites. It invokes platform, driver, profile, example, and preserved reference parts as routed below.

## Do Not Use For
For failures after setup, use `skills/appium-troubleshooting/SKILL.md`. Do not load FFmpeg or bundletool setup unless the user explicitly requests that optional capability.

## Preflight
Confirm OS, shell, permissions, command mode (global `appium` by default; `npx appium` only when requested), target driver, device/simulator state, Node/npm/Appium versions, Java/SDK/Xcode status, and optional dependency requests.

## Profiles
Route with `profiles/global-appium.md`, `profiles/local-npx.md`, `profiles/macos.md`, `profiles/linux.md`, `profiles/windows.md`, `profiles/android.md`, `profiles/chromium.md`, `profiles/safari.md`, and `profiles/xcuitest.md` as applicable.

## References
Shared: `references/environment-setup-node.md`. Android: `references/environment-setup-android.md`, then `references/environment-setup-uiautomator2.md` or `references/environment-setup-espresso.md`. Desktop: `references/environment-setup-chromium.md` or `references/environment-setup-safari.md`. Apple: `references/environment-setup-xcuitest.md`. Optional: `references/environment-setup-ffmpeg.md`, `references/environment-setup-bundletool.md`.

## Examples
Use `examples/uiautomator2.md`, `examples/espresso.md`, `examples/chromium.md`, `examples/safari.md`, or `examples/xcuitest.md` for representative flows.

## Preserved Split References
When a split index is selected, load these parts in order; they preserve original procedures exactly: r/node-01.md r/node-02.md r/node-03.md r/node-04.md r/android-01.md r/android-02.md r/android-03.md r/android-04.md r/android-05.md r/android-06.md r/android-07.md r/android-08.md r/android-09.md r/android-10.md r/uia2-01.md r/uia2-02.md r/uia2-03.md r/uia2-04.md r/uia2-05.md r/uia2-06.md r/espresso-01.md r/espresso-02.md r/espresso-03.md r/espresso-04.md r/espresso-05.md r/chromium-01.md r/chromium-02.md r/chromium-03.md r/chromium-04.md r/chromium-05.md r/chromium-06.md r/chromium-07.md r/chromium-08.md r/safari-01.md r/safari-02.md r/safari-03.md r/safari-04.md r/safari-05.md r/xcui-01.md r/xcui-02.md r/xcui-03.md r/xcui-04.md r/xcui-05.md r/bundletool-01.md r/bundletool-02.md r/bundletool-03.md

## Completion
Run referenced completion checks. Required doctor gate is `0 required fixes needed`; optional warnings do not block. Apply loaded Self-Improvement Prompt(s) before the final response and report proposed wording for any instruction issue.

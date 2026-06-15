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
When a split index is selected, load these parts in order; they preserve original procedures exactly: r/n1.md r/n2.md r/n3.md r/n4.md r/a1.md r/a2.md r/a3.md r/a4.md r/a5.md r/a6.md r/a7.md r/a8.md r/a9.md r/a10.md r/u1.md r/u2.md r/u3.md r/u4.md r/u5.md r/u6.md r/e1.md r/e2.md r/e3.md r/e4.md r/e5.md r/c1.md r/c2.md r/c3.md r/c4.md r/c5.md r/c6.md r/c7.md r/c8.md r/s1.md r/s2.md r/s3.md r/s4.md r/s5.md r/x1.md r/x2.md r/x3.md r/x4.md r/x5.md r/b1.md r/b2.md r/b3.md

## Completion
Run referenced completion checks. Required doctor gate is `0 required fixes needed`; optional warnings do not block. Apply loaded Self-Improvement Prompt(s) before the final response and report proposed wording for any instruction issue.

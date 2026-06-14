# Appium Agent Skills

This repository contains AI Agent skills for Appium automation setup, real-device configuration, and troubleshooting.

## Available Skills

| Skill | Purpose |
| --- | --- |
| [setup](skills/setup/SKILL.md) | Prepares Appium environment setup for Node.js, Android SDK, UiAutomator2, Espresso, XCUITest, Chromium, FFmpeg, and bundletool paths. |
| [xcuitest-real-device-config](skills/xcuitest-real-device-config/SKILL.md) | Prepares signing, provisioning, and WebDriverAgent deployment for real iOS/tvOS devices after XCUITest setup passes. |
| [appium-troubleshooting](skills/appium-troubleshooting/SKILL.md) | Diagnoses existing Appium failures with driver-scoped troubleshooting and smallest-check verification. |

## Setup Notes

- For Android + UiAutomator2, use `setup` with `node.md`, `android.md`, and `uiautomator2.md`.
- For Android + Espresso, use `setup` with `node.md`, `android.md`, and `espresso.md`.
- For macOS + XCUITest simulator setup, use `setup` with `node.md` and `xcuitest.md`.
- For desktop Chromium browser automation, use `setup` with `node.md` and `chromium.md`.
- Use `ffmpeg.md` only when FFmpeg-related media capabilities are explicitly requested.
- Use `bundletool.md` only when bundletool-dependent Android capabilities are explicitly requested.

## Agent Instructions

- See [AGENTS.md](AGENTS.md) for strict execution rules and copy-paste prompt templates.
- Use the template matching your target (`uiautomator2`, `espresso`, `chromium`, `xcuitest`, `xcuitest real device`, or `troubleshooting`) and run skills in the documented order.

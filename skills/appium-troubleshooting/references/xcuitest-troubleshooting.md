# XCUITest Troubleshooting

## Sources
- `https://appium.github.io/appium-xcuitest-driver/latest/guides/troubleshooting/`

## When To Read This
- WebDriverAgent does not build, install, or stay reachable
- session startup stalls or fails on simulator or real device
- app install or launch fails on iOS
- system alerts block automation
- simulator or real-device state looks corrupted

## Common Patterns
- WebDriverAgent setup is broken.
  Re-check Xcode selection, signing requirements for real devices, and driver doctor output before touching the test code.
- The device is reachable, but the XCTest channel is unstable.
  Real-device issues often need trust, unlock, Developer Mode, or a device restart before Appium changes will matter.
- System alerts are blocking the app under test.
  Use `appium:autoAcceptAlerts` or `appium:autoDismissAlerts` only when that matches the test intent; otherwise handle the alert explicitly.
- The simulator is in a bad state.
  Shut down or reset the simulator only when the app data is disposable and the failure clearly points to simulator corruption.
- App installation behavior is the real failure.
  Confirm the app build is valid for the target device/runtime before treating it as a generic Appium problem.

## Useful Checks
```bash
xcodebuild -version
xcode-select -p
appium driver doctor xcuitest
xcrun simctl list devices
xcrun simctl list runtimes
```

## Practical Fix Order
1. Reproduce the failure with fresh Appium server logs.
2. Confirm Xcode and `xcuitest` doctor status.
3. For real devices, verify signing, trust, unlock state, and Developer Mode before deeper debugging.
4. For simulators, shut down the target simulator and retry once before considering an erase/reset.
5. If WebDriverAgent is the failing component, focus on WDA logs and build state before modifying app capabilities unrelated to WDA.

## Notes
- Do not treat every iOS launch failure as a locator issue; many are WDA or device-state problems.
- If the issue only happens on one device or one simulator runtime, include that environment detail in the root-cause summary.

# XCUITest Troubleshooting

## Official References
- `https://appium.github.io/appium-xcuitest-driver/latest/guides/troubleshooting/`
- `https://github.com/appium/appium-xcuitest-driver`

## When To Read This
- WebDriverAgent does not build, install, or stay reachable
- session startup stalls or fails on simulator or real device
- app install or launch fails on iOS
- system alerts block automation
- simulator or real-device state looks corrupted

This page is a compact entry point into the official XCUITest troubleshooting guide.

## Local Triage Map
| Symptom | Verify First | Avoid Until Confirmed |
|---|---|---|
| WDA build or signing failure | `xcode-select`, `xcodebuild -version`, `appium driver doctor xcuitest`, and real-device signing setup | changing unrelated test capabilities |
| Proxy timeout or connection reset right after session start | fresh Appium logs, WDA reachability, and real-device unlock/trust/Developer Mode state | blaming locators or app logic |
| App install or launch fails | app binary compatibility with the target runtime or device | treating it as a generic WDA failure |
| System alert blocks the test | whether the alert should be explicitly handled or automatically accepted/dismissed | enabling auto-alert handling without matching test intent |
| One simulator behaves differently from others | one clean shutdown and retry | erase/reset before confirming corruption |

## Useful Checks
```bash
xcodebuild -version
xcode-select -p
appium driver doctor xcuitest
xcrun simctl list devices
xcrun simctl list runtimes
grep -i "WebDriverAgent\|Proxying\|timed out" <appium-server-log-file>
```

## Real Device WDA Reachability
- If WDA builds but commands time out right after session start on a real device, verify that the Appium log is actually proxying to a reachable WDA URL, typically `http://localhost:8100` when port forwarding is active.
- If you manage WDA yourself, confirm the `appium:webDriverAgentUrl` value points to the actual reachable WDA endpoint, and supply `appium:wdaRemotePort` when the remote device port differs from the local forwarded port.
- Prefer this real-device check before simulator-only recovery steps.

## Real Device WDA Reachability Sequence
1. Capture the Appium server log lines around the first timed out command and confirm which WDA URL Appium is proxying to.
2. If the environment forwards the device port locally, run:
   ```bash
   curl -sf http://localhost:8100/status
   ```
   A healthy response means the forwarded WDA endpoint is reachable from the host.
3. If you set `appium:webDriverAgentUrl`, compare it directly with the reachable endpoint. If the device-side port is not the default `8100`, set `appium:wdaRemotePort` to the device-side port that WDA actually listens on.
4. Only after the reachability check passes should you move on to deeper app or locator troubleshooting.

## Notes
- Do not treat every iOS launch failure as a locator issue; many are WDA or device-state problems.
- If the issue only happens on one real device or one simulator runtime, include that environment detail in the root-cause summary.

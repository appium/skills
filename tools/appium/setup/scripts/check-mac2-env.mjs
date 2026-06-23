#!/usr/bin/env node

import {
  appiumDriverChecks,
  doctorRequiredOk,
  hostReport,
  isMac,
  run,
  xcodeReport,
} from "./env-check-helpers.mjs";

const xcode = xcodeReport({
  xcrunXcodebuild: run("xcrun", ["--find", "xcodebuild"], { timeout: 10000 }),
});
const appium = appiumDriverChecks("mac2", { doctorTimeout: 90000 });
const appiumRequiredOk = appium.installed && doctorRequiredOk(appium.checks.doctor.stdout);

const report = {
  host: hostReport(),
  xcode,
  privacy: {
    automationNote:
      "This script does not modify Accessibility, Screen Recording, Automation, or Developer Tools privacy settings.",
  },
  appium: {
    ...appium,
    requiredOk: appiumRequiredOk,
  },
  summary: {
    requiredOk:
      isMac &&
      xcode.checks.xcodebuildVersion.ok &&
      xcode.checks.xcodeSelect.ok &&
      xcode.checks.license.ok &&
      xcode.checks.firstLaunch.ok &&
      xcode.checks.xcrunXcodebuild.ok &&
      appiumRequiredOk,
    macHost: isMac,
    xcodebuildOk: xcode.checks.xcodebuildVersion.ok,
    xcodeSelectOk: xcode.checks.xcodeSelect.ok,
    licenseOk: xcode.checks.license.ok,
    firstLaunchOk: xcode.checks.firstLaunch.ok,
    xcrunXcodebuildOk: xcode.checks.xcrunXcodebuild.ok,
    driverInstalled: appium.installed,
    doctorRequiredOk: doctorRequiredOk(appium.checks.doctor.stdout),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

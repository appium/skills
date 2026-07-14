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
  simctlList: run("xcrun", ["simctl", "list", "devices", "available"], { timeout: 30000 }),
});
const appium = appiumDriverChecks("xcuitest", { doctorTimeout: 90000 });
const appiumRequiredOk = appium.strictDoctorGateOk;

const report = {
  host: hostReport(),
  xcode,
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
      xcode.checks.simctlList.ok &&
      appiumRequiredOk,
    macHost: isMac,
    xcodebuildOk: xcode.checks.xcodebuildVersion.ok,
    xcodeSelectOk: xcode.checks.xcodeSelect.ok,
    licenseOk: xcode.checks.license.ok,
    firstLaunchOk: xcode.checks.firstLaunch.ok,
    simulatorInventoryOk: xcode.checks.simctlList.ok,
    appiumMajorAtLeast3: appium.appiumMajor !== null && appium.appiumMajor >= 3,
    driverInstalled: appium.installed,
    doctorRequiredOk: doctorRequiredOk(appium.checks.doctor.stdout),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

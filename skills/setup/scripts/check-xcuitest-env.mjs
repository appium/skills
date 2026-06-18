#!/usr/bin/env node
import {
  appiumDriverChecks,
  commandPath,
  hostReport,
  isMac,
  run,
} from "./env-check-helpers.mjs";

const xcodebuildVersion = run("xcodebuild", ["-version"], { timeout: 15000 });
const xcodeSelect = run("xcode-select", ["-p"], { timeout: 10000 });
const license = run("xcodebuild", ["-license", "check"], { timeout: 15000 });
const firstLaunch = run("xcodebuild", ["-checkFirstLaunchStatus"], { timeout: 15000 });
const simctlList = run("xcrun", ["simctl", "list", "devices", "available"], {
  timeout: 30000,
});
const appium = appiumDriverChecks("xcuitest", { doctorTimeout: 90000 });

const report = {
  host: hostReport(),
  xcode: {
    macHost: isMac,
    executables: {
      xcodebuild: commandPath("xcodebuild"),
      xcodeSelect: commandPath("xcode-select"),
      xcrun: commandPath("xcrun"),
    },
    checks: {
      xcodebuildVersion,
      xcodeSelect,
      license,
      firstLaunch,
      simctlList,
    },
  },
  appium,
  summary: {
    requiredOk:
      isMac &&
      xcodebuildVersion.ok &&
      xcodeSelect.ok &&
      license.ok &&
      firstLaunch.ok &&
      simctlList.ok &&
      appium.requiredOk,
    macHost: isMac,
    xcodebuildOk: xcodebuildVersion.ok,
    xcodeSelectOk: xcodeSelect.ok,
    licenseOk: license.ok,
    firstLaunchOk: firstLaunch.ok,
    simulatorInventoryOk: simctlList.ok,
    driverInstalled: appium.installed,
    doctorRequiredOk: /0 required fixes needed/i.test(appium.checks.doctor.stdout),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

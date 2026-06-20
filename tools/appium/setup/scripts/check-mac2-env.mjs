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
const xcrunXcodebuild = run("xcrun", ["--find", "xcodebuild"], { timeout: 10000 });
const appium = appiumDriverChecks("mac2", { doctorTimeout: 90000 });

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
      xcrunXcodebuild,
    },
  },
  privacy: {
    automationNote:
      "This script does not modify Accessibility, Screen Recording, Automation, or Developer Tools privacy settings.",
  },
  appium,
  summary: {
    requiredOk:
      isMac &&
      xcodebuildVersion.ok &&
      xcodeSelect.ok &&
      license.ok &&
      firstLaunch.ok &&
      xcrunXcodebuild.ok &&
      appium.requiredOk,
    macHost: isMac,
    xcodebuildOk: xcodebuildVersion.ok,
    xcodeSelectOk: xcodeSelect.ok,
    licenseOk: license.ok,
    firstLaunchOk: firstLaunch.ok,
    xcrunXcodebuildOk: xcrunXcodebuild.ok,
    driverInstalled: appium.installed,
    doctorRequiredOk: /0 required fixes needed/i.test(appium.checks.doctor.stdout),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

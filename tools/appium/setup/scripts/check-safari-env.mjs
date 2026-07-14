#!/usr/bin/env node
import os from "node:os";
import {
  appiumDriverChecks,
  commandPath,
  driverDoctorStatus,
  existingPaths,
  hostReport,
  isMac,
  pathJoin,
  run,
} from "./env-check-helpers.mjs";

const home = os.homedir();
const safariPaths = isMac
  ? [
      "/Applications/Safari.app",
      pathJoin(home, "Applications", "Safari.app"),
    ]
  : [];
const safaridriverVersion = run("safaridriver", ["--version"], { timeout: 10000 });
const appium = appiumDriverChecks("safari");
const doctor = driverDoctorStatus(appium.checks.doctor);
const appiumPrerequisitesOk =
  appium.checks.appiumVersion.ok &&
  appium.appiumMajor !== null &&
  appium.appiumMajor >= 3 &&
  appium.installed &&
  (!doctor.supported || doctor.requiredOk);

const report = {
  host: hostReport(),
  safari: {
    macHost: isMac,
    appPaths: existingPaths(safariPaths),
    safaridriver: commandPath("safaridriver"),
    checks: {
      safaridriverVersion,
    },
    automationNote:
      "This script does not run 'safaridriver --enable' because that changes host authorization state.",
  },
  appium,
  summary: {
    requiredOk:
      isMac &&
      safaridriverVersion.ok &&
      appiumPrerequisitesOk,
    macHost: isMac,
    safaridriverOk: safaridriverVersion.ok,
    driverInstalled: appium.installed,
    doctorSupported: doctor.supported,
    doctorRequiredOk: doctor.requiredOk,
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

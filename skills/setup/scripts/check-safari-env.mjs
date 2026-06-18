#!/usr/bin/env node
import os from "node:os";
import {
  appiumDriverChecks,
  commandPath,
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
      appium.requiredOk,
    macHost: isMac,
    safaridriverOk: safaridriverVersion.ok,
    driverInstalled: appium.installed,
    doctorRequiredOk: /0 required fixes needed/i.test(appium.checks.doctor.stdout),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

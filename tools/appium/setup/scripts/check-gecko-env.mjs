#!/usr/bin/env node

import os from "node:os";
import {
  appiumDriverChecks,
  commandExists,
  existingPaths,
  hostReport,
  isLinux,
  isMac,
  isWindows,
  pathJoin,
  run,
} from "./env-check-helpers.mjs";

const home = os.homedir();

const firefoxCommands = [
  "firefox",
  "firefox-esr",
  "firefox-developer-edition",
  "firefoxdeveloperedition",
  "firefox-nightly",
];

const firefoxAppPaths = isMac
  ? [
      "/Applications/Firefox.app",
      "/Applications/Firefox Developer Edition.app",
      "/Applications/Firefox Nightly.app",
      pathJoin(home, "Applications", "Firefox.app"),
      pathJoin(home, "Applications", "Firefox Developer Edition.app"),
      pathJoin(home, "Applications", "Firefox Nightly.app"),
    ]
  : [];

const firefoxExecutablePaths = isMac
  ? firefoxAppPaths.map((appPath) => pathJoin(appPath, "Contents", "MacOS", "firefox"))
  : isWindows
    ? [
        "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
        "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
      ]
    : [];

const commandChecks = firefoxCommands.map((name) => commandExists(name));
const availableCommands = commandChecks.filter((candidate) => candidate.ok);
const appPaths = existingPaths(firefoxAppPaths);
const executablePaths = existingPaths(firefoxExecutablePaths);
const selectedFirefox = availableCommands[0]?.path || executablePaths[0] || "";
const firefoxVersion = selectedFirefox
  ? run(selectedFirefox, ["--version"], { timeout: 10000 })
  : { command: "firefox --version", ok: false, stdout: "", stderr: "No Firefox executable found" };
const geckodriverCommand = commandExists("geckodriver");
const geckodriverVersion = geckodriverCommand.ok
  ? run(geckodriverCommand.path, ["--version"], { timeout: 10000, maxOutput: 4000 })
  : { command: "geckodriver --version", ok: false, stdout: "", stderr: "No geckodriver executable found" };
const appium = appiumDriverChecks("gecko");
const doctorSupported = !/not supported|unknown command|unrecognized|not installed/i.test(
  `${appium.checks.doctor.stdout}\n${appium.checks.doctor.stderr}`,
);
const doctorRequiredOk = /0 required fixes needed/i.test(appium.checks.doctor.stdout);
const firefoxAvailable = availableCommands.length > 0 || appPaths.length > 0;

const report = {
  host: hostReport(),
  firefox: {
    commands: commandChecks,
    appPaths,
    executablePaths,
    selected: selectedFirefox,
    checks: {
      version: firefoxVersion,
    },
    linuxNote: isLinux
      ? "If Firefox starts but sessions fail, validate display and distro browser dependencies from gecko-browser-prereqs.md."
      : "",
  },
  geckodriver: {
    required: false,
    command: geckodriverCommand,
    check: geckodriverVersion,
  },
  appium,
  summary: {
    requiredOk:
      firefoxAvailable &&
      appium.appiumMajor !== null &&
      appium.appiumMajor >= 3 &&
      appium.installed &&
      (!doctorSupported || doctorRequiredOk),
    firefoxAvailable,
    appiumMajorOk: appium.appiumMajor !== null && appium.appiumMajor >= 3,
    driverInstalled: appium.installed,
    doctorSupported,
    doctorRequiredOk,
    geckodriverFound: geckodriverVersion.ok,
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

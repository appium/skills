#!/usr/bin/env node
import os from "node:os";
import {
  appiumDriverChecks,
  commandExists,
  driverDoctorStatus,
  environmentValues,
  existingPaths,
  hostReport,
  isLinux,
  isMac,
  isWindows,
  pathJoin,
  run,
} from "./env-check-helpers.mjs";

const browserCommands = [
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
  "msedge",
  "microsoft-edge",
  "chrome",
  "chromium",
];

const home = os.homedir();
const windowsEnvironment = environmentValues([
  "LOCALAPPDATA",
  "PROGRAMFILES",
  "PROGRAMFILES(X86)",
]);
const browserPaths = isMac
  ? [
      "/Applications/Google Chrome.app",
      "/Applications/Chromium.app",
      "/Applications/Microsoft Edge.app",
      pathJoin(home, "Applications", "Google Chrome.app"),
      pathJoin(home, "Applications", "Chromium.app"),
      pathJoin(home, "Applications", "Microsoft Edge.app"),
    ]
  : isWindows
    ? [
        pathJoin(windowsEnvironment.PROGRAMFILES || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
        pathJoin(windowsEnvironment["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
        pathJoin(windowsEnvironment.LOCALAPPDATA || pathJoin(home, "AppData", "Local"), "Google", "Chrome", "Application", "chrome.exe"),
        pathJoin(windowsEnvironment.PROGRAMFILES || "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
        pathJoin(windowsEnvironment["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
      ]
    : [];

const commands = browserCommands.map(commandExists);
const paths = existingPaths(browserPaths);
const versionCommands = [
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser",
  "microsoft-edge",
  "msedge",
]
  .filter((name, index, names) => names.indexOf(name) === index)
  .map((name) => run(name, ["--version"], { timeout: 10000 }));
const appium = appiumDriverChecks("chromium");
const doctor = driverDoctorStatus(appium.checks.doctor);
const appiumPrerequisitesOk =
  appium.checks.appiumVersion.ok &&
  appium.appiumMajor !== null &&
  appium.appiumMajor >= 3 &&
  appium.installed &&
  (!doctor.supported || doctor.requiredOk);

const report = {
  host: hostReport(),
  browsers: {
    commands,
    paths,
    versionCommands,
    supportedBrowserFound:
      commands.some((candidate) => candidate.ok) || paths.length > 0,
    linuxDependencyNote: isLinux
      ? "If Chromium starts but sessions fail, validate distro browser dependencies from contexts/browser/chromium/prereqs.md."
      : "",
  },
  appium,
  summary: {
    requiredOk: appiumPrerequisitesOk &&
      (commands.some((candidate) => candidate.ok) || paths.length > 0),
    appiumMajorAtLeast3: appium.appiumMajor !== null && appium.appiumMajor >= 3,
    driverInstalled: appium.installed,
    doctorSupported: doctor.supported,
    doctorRequiredOk: doctor.requiredOk,
    supportedBrowserFound:
      commands.some((candidate) => candidate.ok) || paths.length > 0,
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

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
        pathJoin(process.env.PROGRAMFILES || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
        pathJoin(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
        pathJoin(process.env.LOCALAPPDATA || pathJoin(home, "AppData", "Local"), "Google", "Chrome", "Application", "chrome.exe"),
        pathJoin(process.env.PROGRAMFILES || "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
        pathJoin(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
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

const report = {
  host: hostReport(),
  browsers: {
    commands,
    paths,
    versionCommands,
    supportedBrowserFound:
      commands.some((candidate) => candidate.ok) || paths.length > 0,
    linuxDependencyNote: isLinux
      ? "If Chromium starts but sessions fail, validate distro browser dependencies from chromium-browser-prereqs.md."
      : "",
  },
  appium,
  summary: {
    requiredOk: appium.requiredOk &&
      (commands.some((candidate) => candidate.ok) || paths.length > 0),
    appiumMajorAtLeast3: appium.appiumMajor !== null && appium.appiumMajor >= 3,
    driverInstalled: appium.installed,
    doctorRequiredOk: /0 required fixes needed/i.test(appium.checks.doctor.stdout),
    supportedBrowserFound:
      commands.some((candidate) => candidate.ok) || paths.length > 0,
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

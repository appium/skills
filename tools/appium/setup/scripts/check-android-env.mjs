#!/usr/bin/env node

import {
  commandExists,
  environmentValues,
  executable,
  existingPaths,
  hostReport,
  isWindows,
  pathJoin,
  run,
} from "./env-check-helpers.mjs";

const env = environmentValues([
  "ANDROID_HOME",
  "ANDROID_SDK_ROOT",
  "HOME",
  "JAVA_HOME",
  "LOCALAPPDATA",
  "PATH",
  "USERPROFILE",
]);
const androidHome = env.ANDROID_HOME || env.ANDROID_SDK_ROOT || defaultAndroidHome();
const exeExt = isWindows ? ".exe" : "";
const cmdExt = isWindows ? ".bat" : "";

const recommendedPathEntries = [
  pathJoin(androidHome, "platform-tools"),
  pathJoin(androidHome, "cmdline-tools", "latest", "bin"),
  pathJoin(androidHome, "emulator"),
];

const paths = {
  adb: pathJoin(androidHome, "platform-tools", `adb${exeExt}`),
  emulator: pathJoin(androidHome, "emulator", `emulator${exeExt}`),
  sdkmanager: pathJoin(androidHome, "cmdline-tools", "latest", "bin", `sdkmanager${cmdExt}`),
};

const adbCommand = executable(paths.adb) ? paths.adb : "adb";
const emulatorCommand = executable(paths.emulator) ? paths.emulator : "emulator";
const sdkmanagerCommand = executable(paths.sdkmanager) ? paths.sdkmanager : "sdkmanager";

const java = run("java", ["-version"], { timeout: 15000 });
const javac = run("javac", ["-version"], { timeout: 15000 });
const adbVersion = run(adbCommand, ["version"], { timeout: 15000 });
const devices = run(adbCommand, ["devices", "-l"], { timeout: 15000 });
const emulatorVersion = run(emulatorCommand, ["-version"], { timeout: 15000 });
const avds = run(emulatorCommand, ["-list-avds"], { timeout: 15000 });
const sdkPackages = run(sdkmanagerCommand, ["--list_installed"], { timeout: 45000 });

const packageText = `${sdkPackages.stdout}\n${sdkPackages.stderr}`;
const pathEntries = (env.PATH || "").split(isWindows ? ";" : ":");
const installed = {
  platformTools: /(?:^|\n)\s*platform-tools\s*\|/.test(packageText),
  emulator: /(?:^|\n)\s*emulator\s*\|/.test(packageText),
  cmdlineTools: /cmdline-tools;latest/.test(packageText),
  platform: /platforms;android-\d+/.test(packageText),
  buildTools: /build-tools;\d+/.test(packageText),
  systemImage: /system-images;android-\d+/.test(packageText),
};
const connectedDeviceCount = devices.ok ? parseDeviceCount(devices.stdout) : 0;
const avdCount = avds.ok && avds.stdout
  ? avds.stdout.split(/\r?\n/).filter(Boolean).length
  : 0;
const baseToolingOk =
  java.ok &&
  javac.ok &&
  existingPaths([androidHome]).length > 0 &&
  (executable(paths.adb) || commandExists("adb").ok) &&
  (executable(paths.emulator) || commandExists("emulator").ok) &&
  (executable(paths.sdkmanager) || commandExists("sdkmanager").ok) &&
  adbVersion.ok &&
  emulatorVersion.ok &&
  sdkPackages.ok &&
  installed.platformTools &&
  installed.emulator &&
  installed.platform &&
  installed.buildTools;
const targetInventoryOk = devices.ok && avds.ok;
const targetReady =
  (devices.ok && connectedDeviceCount > 0) ||
  (avds.ok && avdCount > 0);

const report = {
  host: hostReport(),
  environment: {
    JAVA_HOME: env.JAVA_HOME || "",
    ANDROID_HOME: env.ANDROID_HOME || "",
    ANDROID_SDK_ROOT: env.ANDROID_SDK_ROOT || "",
    resolvedAndroidHome: androidHome,
  },
  paths: {
    ...paths,
    androidHomeExists: existingPaths([androidHome]).length > 0,
    adbExecutable: executable(paths.adb),
    emulatorExecutable: executable(paths.emulator),
    sdkmanagerExecutable: executable(paths.sdkmanager),
    adbOnPath: commandExists("adb").ok,
    emulatorOnPath: commandExists("emulator").ok,
    sdkmanagerOnPath: commandExists("sdkmanager").ok,
    missingRecommendedPathEntries: recommendedPathEntries.filter((entry) => !pathEntries.includes(entry)),
  },
  checks: {
    java,
    javac,
    adbVersion,
    devices,
    emulatorVersion,
    avds,
    sdkPackages,
  },
  installed,
  summary: {
    requiredOk: baseToolingOk && targetInventoryOk && targetReady,
    baseToolingOk,
    targetInventoryOk,
    targetReady,
    connectedDeviceCount,
    avdCount,
    adbVersionOk: adbVersion.ok,
    emulatorVersionOk: emulatorVersion.ok,
    deviceInventoryOk: devices.ok,
    avdInventoryOk: avds.ok,
    sdkInventoryOk: sdkPackages.ok,
    deviceInventoryNote: devices.ok
      ? ""
      : "Device inventory command failed. If stderr mentions smartsocket or Operation not permitted, retry outside the sandbox or with an already-running adb server.",
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

function defaultAndroidHome() {
  if (isWindows) {
    return pathJoin(env.LOCALAPPDATA || pathJoin(env.USERPROFILE || "", "AppData", "Local"), "Android", "Sdk");
  }

  if (process.platform === "darwin") {
    return pathJoin(env.HOME || "", "Library", "Android", "sdk");
  }

  return pathJoin(env.HOME || "", "Android", "Sdk");
}

function parseDeviceCount(output) {
  return output
    .split(/\r?\n/)
    .slice(1)
    .filter((line) => /\bdevice\b/.test(line))
    .length;
}

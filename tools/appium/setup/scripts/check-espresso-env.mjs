#!/usr/bin/env node
import os from "node:os";
import { existsSync } from "node:fs";
import {
  appiumDriverChecks,
  commandPath,
  environmentValues,
  executable,
  hostReport,
  isWindows,
  pathJoin,
  run,
} from "./env-check-helpers.mjs";

const home = os.homedir();
const env = environmentValues([
  "ANDROID_HOME",
  "ANDROID_SDK_ROOT",
  "LOCALAPPDATA",
]);
const androidHome =
  env.ANDROID_HOME ||
  env.ANDROID_SDK_ROOT ||
  (isWindows
    ? pathJoin(env.LOCALAPPDATA || pathJoin(home, "AppData", "Local"), "Android", "Sdk")
    : process.platform === "darwin"
      ? pathJoin(home, "Library", "Android", "sdk")
      : pathJoin(home, "Android", "Sdk"));
const binExt = isWindows ? ".exe" : "";
const cmdExt = isWindows ? ".bat" : "";
const adb = pathJoin(androidHome, "platform-tools", `adb${binExt}`);
const emulator = pathJoin(androidHome, "emulator", `emulator${binExt}`);
const sdkmanager = pathJoin(androidHome, "cmdline-tools", "latest", "bin", `sdkmanager${cmdExt}`);

const java = run("java", ["-version"], { timeout: 10000 });
const javac = run("javac", ["-version"], { timeout: 10000 });
const adbVersion = run("adb", ["version"], { timeout: 10000 });
const devices = run("adb", ["devices"], { timeout: 15000 });
const sdkPackages = run("sdkmanager", ["--list_installed"], { timeout: 30000 });
const appium = appiumDriverChecks("espresso", { doctorTimeout: 90000 });

const report = {
  host: hostReport(),
  android: {
    resolvedAndroidHome: androidHome,
    androidHomeExists: existsSync(androidHome),
    executables: {
      java: commandPath("java"),
      javac: commandPath("javac"),
      adb: commandPath("adb"),
      emulator: commandPath("emulator"),
      sdkmanager: commandPath("sdkmanager"),
    },
    sdkExecutables: {
      adbExecutable: executable(adb),
      emulatorExecutable: executable(emulator),
      sdkmanagerExecutable: executable(sdkmanager),
    },
    checks: {
      java,
      javac,
      adbVersion,
      devices,
      sdkPackages,
    },
    connectedDeviceCount: parseDeviceCount(devices.stdout),
  },
  appium,
  summary: {
    requiredOk:
      java.ok &&
      javac.ok &&
      existsSync(androidHome) &&
      adbVersion.ok &&
      devices.ok &&
      sdkPackages.ok &&
      appium.strictDoctorGateOk,
    androidHomeExists: existsSync(androidHome),
    javaOk: java.ok,
    javacOk: javac.ok,
    adbOk: adbVersion.ok,
    deviceInventoryOk: devices.ok,
    sdkInventoryOk: sdkPackages.ok,
    driverInstalled: appium.installed,
    doctorRequiredOk: /0 required fixes needed/i.test(appium.checks.doctor.stdout),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

function parseDeviceCount(output) {
  return output
    .split(/\r?\n/)
    .slice(1)
    .filter((line) => /\tdevice$/.test(line.trim())).length;
}

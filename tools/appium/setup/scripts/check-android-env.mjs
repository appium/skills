#!/usr/bin/env node
import { existsSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const home = os.homedir();
const env = process.env;
const androidHome =
  env.ANDROID_HOME ||
  env.ANDROID_SDK_ROOT ||
  (isWindows
    ? path.join(env.LOCALAPPDATA || path.join(home, "AppData", "Local"), "Android", "Sdk")
    : process.platform === "darwin"
      ? path.join(home, "Library", "Android", "sdk")
      : path.join(home, "Android", "Sdk"));

const binExt = isWindows ? ".exe" : "";
const cmdExt = isWindows ? ".bat" : "";
const paths = {
  adb: path.join(androidHome, "platform-tools", `adb${binExt}`),
  emulator: path.join(androidHome, "emulator", `emulator${binExt}`),
  sdkmanager: path.join(androidHome, "cmdline-tools", "latest", "bin", `sdkmanager${cmdExt}`),
};

function command(name, args = [], options = {}) {
  const result = spawnSync(name, args, {
    encoding: "utf8",
    timeout: options.timeout ?? 15000,
    shell: false,
  });
  return {
    command: [name, ...args].join(" "),
    ok: result.status === 0,
    status: result.status,
    signal: result.signal,
    stdout: trim(result.stdout),
    stderr: trim(result.stderr),
    error: result.error?.message,
  };
}

function trim(value) {
  return (value || "").trim().slice(0, 12000);
}

function executable(file) {
  try {
    const stats = statSync(file);
    return stats.isFile() && (isWindows || Boolean(stats.mode & 0o111));
  } catch {
    return false;
  }
}

function commandExists(name) {
  const probe = isWindows ? "where" : "command";
  const args = isWindows ? [name] : ["-v", name];
  return command(probe, args, { timeout: 5000 });
}

const java = command("java", ["-version"]);
const javac = command("javac", ["-version"]);
const adbVersion = executable(paths.adb)
  ? command(paths.adb, ["version"])
  : command("adb", ["version"]);
const devices = executable(paths.adb)
  ? command(paths.adb, ["devices", "-l"])
  : command("adb", ["devices", "-l"]);
const avds = executable(paths.emulator)
  ? command(paths.emulator, ["-list-avds"])
  : command("emulator", ["-list-avds"]);
const sdkPackages = executable(paths.sdkmanager)
  ? command(paths.sdkmanager, ["--list_installed"], { timeout: 30000 })
  : command("sdkmanager", ["--list_installed"], { timeout: 30000 });

const packageText = `${sdkPackages.stdout}\n${sdkPackages.stderr}`;
const installed = {
  platformTools: /(?:^|\n)\s*platform-tools\s*\|/.test(packageText),
  emulator: /(?:^|\n)\s*emulator\s*\|/.test(packageText),
  cmdlineTools: /cmdline-tools;latest/.test(packageText),
  platform: /platforms;android-\d+/.test(packageText),
  buildTools: /build-tools;\d+/.test(packageText),
  systemImage: /system-images;android-\d+/.test(packageText),
};

const pathEntries = (env.PATH || "").split(path.delimiter);
const recommendedPathEntries = [
  path.join(androidHome, "platform-tools"),
  path.join(androidHome, "cmdline-tools", "latest", "bin"),
  path.join(androidHome, "emulator"),
];

const report = {
  host: {
    platform: process.platform,
    release: os.release(),
    arch: os.arch(),
  },
  environment: {
    JAVA_HOME: env.JAVA_HOME || "",
    ANDROID_HOME: env.ANDROID_HOME || "",
    ANDROID_SDK_ROOT: env.ANDROID_SDK_ROOT || "",
    resolvedAndroidHome: androidHome,
  },
  paths: {
    ...paths,
    androidHomeExists: existsSync(androidHome),
    adbExecutable: executable(paths.adb),
    emulatorExecutable: executable(paths.emulator),
    sdkmanagerExecutable: executable(paths.sdkmanager),
    adbOnPath: commandExists("adb").ok,
    emulatorOnPath: commandExists("emulator").ok,
    sdkmanagerOnPath: commandExists("sdkmanager").ok,
    missingRecommendedPathEntries: recommendedPathEntries.filter(
      (entry) => !pathEntries.includes(entry),
    ),
  },
  checks: {
    java,
    javac,
    adbVersion,
    devices,
    avds,
    sdkPackages,
  },
  installed,
  summary: {
    requiredOk:
      java.ok &&
      javac.ok &&
      existsSync(androidHome) &&
      (executable(paths.adb) || commandExists("adb").ok) &&
      (executable(paths.emulator) || commandExists("emulator").ok) &&
      (executable(paths.sdkmanager) || commandExists("sdkmanager").ok) &&
      installed.platformTools &&
      installed.emulator &&
      installed.platform &&
      installed.buildTools,
    connectedDeviceCount: parseDeviceCount(devices.stdout),
    avdCount: avds.ok && avds.stdout ? avds.stdout.split(/\r?\n/).filter(Boolean).length : 0,
    deviceInventoryOk: devices.ok,
    deviceInventoryNote: devices.ok
      ? ""
      : "Device inventory command failed. If stderr mentions smartsocket or Operation not permitted, retry outside the sandbox or with an already-running adb server.",
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

function parseDeviceCount(output) {
  return output
    .split(/\r?\n/)
    .slice(1)
    .filter((line) => /\bdevice\b/.test(line))
    .length;
}

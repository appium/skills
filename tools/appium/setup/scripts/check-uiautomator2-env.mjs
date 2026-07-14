#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import {
  doctorRequiredOk,
  driverInstalled,
  parseDriverVersion,
  parseMajor,
  resolveAppiumCommand,
  run,
  runAppium,
} from "./env-check-helpers.mjs";

function appiumHomeBlocked(...results) {
  const text = results.map((result) => `${result.stdout}\n${result.stderr}`).join("\n");
  return /Appium home path .* must be writeable|EPERM: operation not permitted.*\.appium|access '.*\.appium'/i.test(
    text,
  );
}

const androidScript = fileURLToPath(new URL("./check-android-env.mjs", import.meta.url));
const android = run(process.execPath, [androidScript], {
  timeout: 180000,
  maxOutput: 250000,
});

let androidSummary = {};
try {
  androidSummary = JSON.parse(android.stdout).summary || {};
} catch {
  androidSummary = { parseError: true };
}

const appiumCommand = resolveAppiumCommand();
const appiumVersion = runAppium(appiumCommand, ["-v"]);
const appiumMajor = parseMajor(appiumVersion.stdout || appiumVersion.stderr);
const driversJson = runAppium(appiumCommand, ["driver", "list", "--installed", "--json"]);
const driversText = driversJson.ok
  ? driversJson
  : runAppium(appiumCommand, ["driver", "list", "--installed"]);
const doctor = runAppium(appiumCommand, ["driver", "doctor", "uiautomator2"], {
  timeout: 60000,
});

const doctorText = `${doctor.stdout}\n${doctor.stderr}`;
const driverOutput = `${driversText.stdout}\n${driversText.stderr}`;
const isDriverInstalled = driverInstalled(driversText.stdout, "uiautomator2");
const homeBlocked = appiumHomeBlocked(driversJson, driversText, doctor);

const report = {
  android: {
    ok: android.ok,
    summary: androidSummary,
  },
  appium: {
    appiumMode: appiumCommand.mode,
    appiumCommand: appiumCommand.display,
    major: appiumMajor,
    version: appiumVersion,
    drivers: driversText,
    doctor,
  },
  summary: {
    requiredOk:
      android.ok &&
      androidSummary.requiredOk === true &&
      appiumVersion.ok &&
      appiumMajor !== null &&
      appiumMajor >= 3 &&
      isDriverInstalled &&
      doctor.ok &&
      doctorRequiredOk(doctorText),
    appiumMajorAtLeast3: appiumMajor !== null && appiumMajor >= 3,
    driverInstalled: isDriverInstalled,
    driverVersion: parseDriverVersion(driverOutput, "uiautomator2"),
    doctorRequiredOk: doctorRequiredOk(doctorText),
    optionalWarningsPresent: /optional fix possible|optional manual fixes|WARN Doctor/i.test(doctorText),
    appiumHomeAccessBlocked: homeBlocked,
    needsUnsandboxedAppiumHome: homeBlocked && !isDriverInstalled,
    note: homeBlocked
      ? "Appium could not inspect the real ~/.appium directory from this sandbox. Re-run this script outside the managed sandbox or run direct appium driver list/doctor commands."
      : "",
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

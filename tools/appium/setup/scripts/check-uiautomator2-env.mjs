#!/usr/bin/env node
import { spawnSync } from "node:child_process";

function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    timeout: options.timeout ?? 30000,
    shell: false,
  });
  return {
    command: [command, ...args].join(" "),
    ok: result.status === 0,
    status: result.status,
    signal: result.signal,
    stdout: trim(result.stdout),
    stderr: trim(result.stderr),
    error: result.error?.message,
  };
}

function trim(value) {
  return (value || "").trim().slice(0, 20000);
}

function parseDriverVersion(output) {
  try {
    const parsed = JSON.parse(output);
    const candidate = parsed.uiautomator2 || parsed.drivers?.uiautomator2;
    return typeof candidate === "object" ? candidate.version || "" : "";
  } catch {
    const match = output.match(/uiautomator2[@\s]+([0-9][^\s,)]*)/i);
    return match?.[1] || "";
  }
}

function doctorRequiredOk(output) {
  return /0 required fixes needed/i.test(output);
}

function appiumHomeBlocked(...results) {
  const text = results.map((result) => `${result.stdout}\n${result.stderr}`).join("\n");
  return /Appium home path .* must be writeable|EPERM: operation not permitted.*\.appium|access '.*\.appium'/i.test(
    text,
  );
}

const android = run(process.execPath, ["tools/appium/setup/scripts/check-android-env.mjs"], {
  timeout: 45000,
});

let androidSummary = {};
try {
  androidSummary = JSON.parse(android.stdout).summary || {};
} catch {
  androidSummary = { parseError: true };
}

const appiumVersion = run("appium", ["-v"]);
const driversJson = run("appium", ["driver", "list", "--installed", "--json"]);
const driversText = driversJson.ok
  ? driversJson
  : run("appium", ["driver", "list", "--installed"]);
const doctor = run("appium", ["driver", "doctor", "uiautomator2"], {
  timeout: 60000,
});

const doctorText = `${doctor.stdout}\n${doctor.stderr}`;
const driverOutput = `${driversText.stdout}\n${driversText.stderr}`;
const driverInstalled = /uiautomator2/i.test(driverOutput);
const homeBlocked = appiumHomeBlocked(driversJson, driversText, doctor);

const report = {
  android: {
    ok: android.ok,
    summary: androidSummary,
  },
  appium: {
    version: appiumVersion,
    drivers: driversText,
    doctor,
  },
  summary: {
    requiredOk:
      android.ok &&
      androidSummary.requiredOk === true &&
      appiumVersion.ok &&
      driverInstalled &&
      doctor.ok &&
      doctorRequiredOk(doctorText),
    driverInstalled,
    driverVersion: parseDriverVersion(driverOutput),
    doctorRequiredOk: doctorRequiredOk(doctorText),
    optionalWarningsPresent: /optional fix possible|optional manual fixes|WARN Doctor/i.test(doctorText),
    appiumHomeAccessBlocked: homeBlocked,
    needsUnsandboxedAppiumHome: homeBlocked && !driverInstalled,
    note: homeBlocked
      ? "Appium could not inspect the real ~/.appium directory from this sandbox. Re-run this script outside the managed sandbox or run direct appium driver list/doctor commands."
      : "",
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

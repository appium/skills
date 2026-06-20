import { existsSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

export const isWindows = process.platform === "win32";
export const isMac = process.platform === "darwin";
export const isLinux = process.platform === "linux";

export function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    timeout: options.timeout ?? 15000,
    shell: false,
  });
  return {
    command: [command, ...args].join(" "),
    ok: result.status === 0,
    status: result.status,
    signal: result.signal,
    stdout: trim(result.stdout, options.maxOutput),
    stderr: trim(result.stderr, options.maxOutput),
    error: result.error?.message,
  };
}

export function trim(value, max = 20000) {
  return (value || "").trim().slice(0, max);
}

export function commandPath(name) {
  const result = isWindows
    ? run("where", [name], { timeout: 5000 })
    : run("sh", ["-lc", `command -v ${shellQuote(name)}`], { timeout: 5000 });
  return result.ok ? result.stdout.split(/\r?\n/)[0] : "";
}

export function commandExists(name) {
  const resolved = commandPath(name);
  return { name, path: resolved, ok: Boolean(resolved) };
}

export function executable(file) {
  if (!file || !existsSync(file)) {
    return false;
  }
  try {
    const stats = statSync(file);
    return stats.isFile() && (isWindows || Boolean(stats.mode & 0o111));
  } catch {
    return false;
  }
}

export function existingPaths(paths) {
  return paths.filter((candidate) => candidate && existsSync(candidate));
}

export function parseMajor(versionText) {
  const match = versionText.match(/v?(\d+)\./);
  return match ? Number.parseInt(match[1], 10) : null;
}

export function parseDriverVersion(output, driverName) {
  try {
    const parsed = JSON.parse(output);
    const candidate = parsed[driverName] || parsed.drivers?.[driverName];
    if (typeof candidate === "string") {
      return candidate;
    }
    if (candidate && typeof candidate === "object") {
      return candidate.version || candidate.pkgVersion || "";
    }
  } catch {
    // Fall through to text parsing.
  }

  const escaped = driverName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = output.match(new RegExp(`${escaped}[@\\s]+([0-9][^\\s,)]*)`, "i"));
  return match ? match[1] : "";
}

export function driverInstalled(output, driverName) {
  return Boolean(parseDriverVersion(output, driverName)) ||
    new RegExp(`\\b${driverName}\\b`, "i").test(output);
}

export function doctorRequiredOk(output) {
  return /0 required fixes needed/i.test(output);
}

export function appiumDriverChecks(driverName, options = {}) {
  const appiumCommand = options.appiumCommand || "appium";
  const appiumVersion = run(appiumCommand, ["-v"], { timeout: 10000 });
  const appiumMajor = parseMajor(appiumVersion.stdout);
  const driverListJson = run(
    appiumCommand,
    ["driver", "list", "--installed", "--json"],
    { timeout: 20000 },
  );
  const driverList = driverListJson.ok
    ? driverListJson
    : run(appiumCommand, ["driver", "list", "--installed"], { timeout: 20000 });
  const doctor = run(appiumCommand, ["driver", "doctor", driverName], {
    timeout: options.doctorTimeout ?? 60000,
  });
  const version = parseDriverVersion(driverList.stdout, driverName);
  const installed = driverInstalled(driverList.stdout, driverName);

  return {
    appiumCommand,
    appiumMajor,
    version,
    installed,
    requiredOk:
      appiumVersion.ok &&
      appiumMajor !== null &&
      appiumMajor >= 3 &&
      installed &&
      doctorRequiredOk(doctor.stdout),
    checks: {
      appiumVersion,
      driverList,
      doctor,
    },
  };
}

export function hostReport() {
  return {
    platform: process.platform,
    release: os.release(),
    arch: os.arch(),
    shell: process.env.SHELL || process.env.ComSpec || "",
  };
}

export function pathJoin(...parts) {
  return path.join(...parts);
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

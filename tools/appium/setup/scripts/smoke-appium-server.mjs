#!/usr/bin/env node
import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolveAppiumCommand } from "./env-check-helpers.mjs";
import { reportingOptions, writeReport } from "./reporting.mjs";
import { smokeChromiumSession } from "./smoke-chromium-session.mjs";
import { spawnWindowsJob } from "./windows-job.mjs";

const drivers = new Set(["uiautomator2", "espresso", "chromium", "gecko", "mac2", "safari", "xcuitest"]);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function serverCommand(mode, cwd = process.cwd()) {
  if (mode !== "local") return resolveAppiumCommand(["--appium-mode", mode]);
  // npx --no-install can still find a global binary. Resolve only an actual
  // project/ancestor dependency and execute its declared Node entrypoint.
  for (let directory = path.resolve(cwd); ; directory = path.dirname(directory)) {
    const manifest = path.join(directory, "node_modules/appium/package.json");
    if (existsSync(manifest)) {
      const pkg = JSON.parse(readFileSync(manifest, "utf8"));
      const bin = typeof pkg.bin === "string" ? pkg.bin : pkg.bin?.appium;
      if (!bin) throw new Error("Local Appium package has no appium entrypoint");
      const entry = path.resolve(path.dirname(manifest), bin);
      if (!existsSync(entry)) throw new Error("Local Appium entrypoint is missing");
      return { executable: process.execPath, prefixArgs: [entry] };
    }
    if (path.dirname(directory) === directory) break;
  }
  throw new Error("Local Appium dependency is missing; no download or global fallback allowed");
}

export function parseOptions(args) {
  const options = {
    driver: "", mode: "global", port: 4723, startupTimeoutMs: 30000,
    cleanupTimeoutMs: 5000, browser: "chrome", allowDriverDownload: false,
  };
  const keys = {
    "--driver": "driver", "--appium-mode": "mode", "--port": "port",
    "--startup-timeout-ms": "startupTimeoutMs", "--cleanup-timeout-ms": "cleanupTimeoutMs",
    "--browser": "browser", "--browser-binary": "browserBinary",
    "--driver-executable": "driverExecutable",
  };
  for (let i = 0; i < args.length; i += 1) {
    const [name, ...rest] = args[i].split("=");
    if (name === "--allow-driver-download" && !rest.length) {
      options.allowDriverDownload = true;
      continue;
    }
    if (!keys[name]) throw new Error(`Unknown argument: ${name}`);
    const value = rest.length ? rest.join("=") : args[++i];
    if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
    options[keys[name]] = value;
  }
  if (!drivers.has(options.driver)) throw new Error("--driver must name a supported Appium driver");
  if (!["global", "local"].includes(options.mode)) throw new Error("Invalid --appium-mode");
  for (const key of ["port", "startupTimeoutMs", "cleanupTimeoutMs"]) {
    options[key] = Number(options[key]);
    const max = key === "port" ? 65535 : 180000;
    if (!Number.isInteger(options[key]) || options[key] < (key === "port" ? 0 : 1) || options[key] > max) {
      throw new Error(`Invalid ${key}`);
    }
  }
  if (!["chrome", "edge"].includes(options.browser)) throw new Error("Invalid --browser");
  if (options.driver !== "chromium" &&
      (options.allowDriverDownload || options.browserBinary || options.driverExecutable || options.browser !== "chrome")) {
    throw new Error("Browser options require --driver chromium");
  }
  return options;
}

async function availablePort(preferred) {
  try {
    return await new Promise((resolve, reject) => {
      const server = net.createServer();
      server.once("error", reject);
      server.listen({ host: "127.0.0.1", port: preferred, exclusive: true }, () => {
        const port = server.address().port;
        server.close((error) => error ? reject(error) : resolve(port));
      });
    });
  } catch (error) {
    if (preferred && error.code === "EADDRINUSE") return availablePort(0);
    throw error;
  }
}

function groupAlive(pid) {
  try { process.kill(-pid, 0); return true; }
  catch (error) { return error.code !== "ESRCH"; }
}

async function stopOwned(child, timeoutMs) {
  if (child?.stopJob) return child.stopJob();
  if (!child?.pid) return true;
  if (!groupAlive(child.pid)) return true;
  try { process.kill(-child.pid, "SIGTERM"); } catch (error) { if (error.code !== "ESRCH") return false; }
  const end = Date.now() + timeoutMs;
  while (groupAlive(child.pid) && Date.now() < end) await delay(25);
  if (groupAlive(child.pid)) {
    try { process.kill(-child.pid, "SIGKILL"); } catch (error) { if (error.code !== "ESRCH") return false; }
    const forcedEnd = Date.now() + timeoutMs;
    while (groupAlive(child.pid) && Date.now() < forcedEnd) await delay(25);
  }
  return !groupAlive(child.pid);
}

export async function smokeServer(options, dependencies = {}) {
  const controller = new AbortController();
  const interrupt = () => controller.abort();
  process.once("SIGINT", interrupt);
  process.once("SIGTERM", interrupt);
  let child;
  let logs = "";
  let startupError = "";
  const report = {
    driver: options.driver, appiumMode: options.mode, serverUrl: "",
    checks: { serverReady: false, driverListed: false, cleanupOk: false },
    summary: { requiredOk: false, error: "" },
  };
  try {
    const command = dependencies.command || serverCommand(options.mode);
    const port = await availablePort(options.port);
    report.serverUrl = `http://127.0.0.1:${port}/`;
    // Never attach to the occupant of a raced port. Our listener log and live
    // child are required in addition to /status readiness.
    const args = [...command.prefixArgs, "server", "--address", "127.0.0.1", "--port", String(port)];
    child = process.platform === "win32" ? spawnWindowsJob(command.executable, args, options.cleanupTimeoutMs) : spawn(command.executable, args, {
      stdio: ["ignore", "pipe", "pipe"], detached: process.platform !== "win32", windowsHide: true,
    });
    child.once("error", (error) => { startupError = error.message; });
    const capture = (chunk) => {
      if (logs.length + chunk.length > 8 * 1024 * 1024) {
        startupError = "Server log capture limit exceeded";
        controller.abort();
      } else logs += chunk.toString();
    };
    child.stdout.on("data", capture);
    child.stderr.on("data", capture);
    const deadline = Date.now() + options.startupTimeoutMs;
    while (Date.now() < deadline && !controller.signal.aborted) {
      if (startupError) throw new Error(startupError);
      if (child.exitCode !== null || child.signalCode !== null) throw new Error("Appium exited before verification");
      const cleanLogs = logs.replace(/\u001b\[[0-9;]*m/g, "");
      const driverPattern = new RegExp(`\\b${options.driver}@[0-9]`, "i");
      const available = cleanLogs.indexOf("Available drivers:");
      report.checks.driverListed = available >= 0 && driverPattern.test(cleanLogs.slice(available));
      const ownListener = cleanLogs.split(/\r?\n/).some((line) =>
        line.includes("Appium REST http interface listener started") && line.includes(`:${port}`));
      if (ownListener && report.checks.driverListed) {
        try {
          const response = await fetch(`${report.serverUrl}status`, {
            signal: AbortSignal.any([controller.signal, AbortSignal.timeout(Math.min(1000, Math.max(1, deadline - Date.now())))]),
          });
          report.checks.serverReady = response.ok && (await response.json())?.value?.ready === true;
        } catch { /* Retry until the bounded deadline. */ }
        if (report.checks.serverReady) break;
      }
      await delay(50);
    }
    if (controller.signal.aborted) throw new Error(startupError || "Interrupted");
    if (!report.checks.serverReady || !report.checks.driverListed) throw new Error("Appium readiness/driver evidence timed out");
    if (options.driver === "chromium") {
      report.session = await smokeChromiumSession({
        ...options, serverUrl: report.serverUrl, signal: controller.signal,
        sessionCleanupTimeoutMs: options.cleanupTimeoutMs,
      });
      if (!report.session.summary.requiredOk) throw new Error(report.session.summary.error || "Browser session failed");
    }
    if (controller.signal.aborted) throw new Error("Interrupted");
  } catch (error) {
    report.summary.error = error.message;
  } finally {
    report.checks.cleanupOk = await stopOwned(child, options.cleanupTimeoutMs);
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", interrupt);
  }
  report.logs = logs;
  report.summary = {
    ...report.summary,
    requiredOk: !report.summary.error && report.checks.serverReady && report.checks.driverListed && report.checks.cleanupOk,
    serverReady: report.checks.serverReady, driverListed: report.checks.driverListed,
    cleanupOk: report.checks.cleanupOk,
    ...(report.session ? { sessionRequiredOk: report.session.summary.requiredOk } : {}),
  };
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const output = reportingOptions(process.argv.slice(2), "summary");
    const report = await smokeServer(parseOptions(output.args));
    writeReport(report, output);
    process.exitCode = report.summary.requiredOk ? 0 : 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

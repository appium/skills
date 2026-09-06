import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { commandInvocation, windowsArgument } from "./windows-command.mjs";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Constant PowerShell program; all paths and command data travel as JSON/env,
// never as interpolated PowerShell source. No execution-policy changes.
export const windowsJobScript = `$ErrorActionPreference = 'Stop';
try {
  Add-Type -Path $env:APPIUM_JOB_SOURCE;
  $config = Get-Content -LiteralPath $env:APPIUM_JOB_CONFIG -Raw -Encoding UTF8 | ConvertFrom-Json;
  $ok = [AppiumWindowsJob]::Run($config.executable, $config.commandLine, $config.parentId, $config.stopFile, $config.timeoutMs);
  [IO.File]::WriteAllText($config.resultFile, (@{cleanupOk=$ok} | ConvertTo-Json -Compress));
  if ([AppiumWindowsJob]::OwnerExited) { Remove-Item -LiteralPath (Split-Path -LiteralPath $env:APPIUM_JOB_CONFIG) -Recurse -Force }
  if (-not $ok) { exit 1 }
} catch { [Console]::Error.WriteLine($_); exit 1 }`;

export function spawnWindowsJob(executable, args, timeoutMs) {
  const invocation = commandInvocation(executable, args);
  const directory = mkdtempSync(path.join(os.tmpdir(), "appium-job-"));
  const stopFile = path.join(directory, "stop");
  const resultFile = path.join(directory, "result.json");
  const configFile = path.join(directory, "command.json");
  const commandLine = [windowsArgument(invocation.executable), ...invocation.args.map((arg) =>
    invocation.windowsVerbatimArguments ? arg : windowsArgument(arg))].join(" ");
  writeFileSync(configFile, JSON.stringify({ executable: invocation.executable, commandLine,
    parentId: process.pid, stopFile, timeoutMs, resultFile }), { flag: "wx" });
  const child = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", windowsJobScript], {
    stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
    env: { ...process.env, APPIUM_JOB_SOURCE: fileURLToPath(new URL("windows-job.cs", import.meta.url)), APPIUM_JOB_CONFIG: configFile },
  });
  child.stopJob = async () => {
    try {
      writeFileSync(stopFile, "stop");
      const deadline = Date.now() + timeoutMs + 1000;
      while (child.exitCode === null && child.signalCode === null && Date.now() < deadline) await delay(25);
      if (child.exitCode === null && child.signalCode === null) {
        child.kill(); // Closing the supervisor's job handle kills only our tree.
        const forcedDeadline = Date.now() + 1000;
        while (child.exitCode === null && child.signalCode === null && Date.now() < forcedDeadline) await delay(25);
        return false; // No verified job-accounting result; never claim cleanup.
      }
      return JSON.parse(readFileSync(resultFile, "utf8")).cleanupOk === true;
    } catch { return false; }
    finally { rmSync(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); }
  };
  return child;
}

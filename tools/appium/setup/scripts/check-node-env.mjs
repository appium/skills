#!/usr/bin/env node
import os from "node:os";
import { spawnSync } from "node:child_process";

function run(command, args = [], options = {}) {
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
    stdout: trim(result.stdout),
    stderr: trim(result.stderr),
    error: result.error?.message,
  };
}

function trim(value) {
  return (value || "").trim().slice(0, 12000);
}

function commandPath(name) {
  const probe = process.platform === "win32" ? "where" : "command";
  const args = process.platform === "win32" ? [name] : ["-v", name];
  const result = run(probe, args, { timeout: 5000 });
  return result.ok ? result.stdout.split(/\r?\n/)[0] : "";
}

function major(versionText) {
  const match = versionText.match(/v?(\d+)\./);
  return match ? Number.parseInt(match[1], 10) : null;
}

function managerStatus() {
  const managers = ["nvm", "fnm", "asdf"].map((name) => ({
    name,
    path: commandPath(name),
  }));
  return managers.find((manager) => manager.path) || { name: "", path: "" };
}

const nodeVersion = run("node", ["-v"]);
const npmVersion = run("npm", ["-v"]);
const npmRegistry = run("npm", ["config", "get", "registry"]);
const npmPing = run("npm", ["ping"], { timeout: 10000 });
const nodeMajor = major(nodeVersion.stdout);
const activeManager = managerStatus();

const report = {
  host: {
    platform: process.platform,
    release: os.release(),
    arch: os.arch(),
    shell: process.env.SHELL || process.env.ComSpec || "",
  },
  executables: {
    node: commandPath("node"),
    npm: commandPath("npm"),
    manager: activeManager,
  },
  versions: {
    node: nodeVersion.stdout,
    npm: npmVersion.stdout,
    nodeMajor,
  },
  checks: {
    nodeVersion,
    npmVersion,
    npmRegistry,
    npmPing,
  },
  summary: {
    requiredOk: nodeVersion.ok && npmVersion.ok && nodeMajor !== null && nodeMajor >= 20,
    npmConnectivityOk: npmPing.ok,
    registry: npmRegistry.stdout,
    nodeMajorAtLeast20: nodeMajor !== null && nodeMajor >= 20,
    powershellPolicyError: /npm\.ps1 cannot be loaded/i.test(
      `${npmVersion.stderr}\n${npmPing.stderr}`,
    ),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

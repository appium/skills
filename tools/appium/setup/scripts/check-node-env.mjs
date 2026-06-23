#!/usr/bin/env node

import {
  commandPath,
  hostReport,
  parseMajor,
  run,
} from "./env-check-helpers.mjs";

const nodeVersion = run("node", ["--version"], { timeout: 5000 });
const npmVersion = run("npm", ["--version"], { timeout: 5000 });
const npmRegistry = run("npm", ["config", "get", "registry"], { timeout: 10000 });
const npmPing = run("npm", ["ping"], { timeout: 10000 });

const nodeMajor = parseMajor(nodeVersion.stdout || nodeVersion.stderr);
const activeManager = managerStatus();

const report = {
  host: hostReport(),
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
    powershellPolicyError: /npm\.ps1 cannot be loaded/i.test(`${npmVersion.stderr}\n${npmPing.stderr}`),
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

function managerStatus() {
  const manager = ["nvm", "fnm", "asdf"].find((name) => commandPath(name));
  return manager ? { name: manager, path: commandPath(manager) } : { name: "", path: "" };
}

#!/usr/bin/env node
import { existsSync } from "node:fs";
import {
  commandPath,
  environmentValues,
  hostReport,
  run,
} from "./env-check-helpers.mjs";

const env = environmentValues(["BUNDLETOOL_JAR", "BUNDLETOOL_PATH"]);
const configuredBundletoolJar =
  env.BUNDLETOOL_JAR ||
  env.BUNDLETOOL_PATH ||
  "";
const bundletoolJarOnPath = commandPath("bundletool.jar");
const bundletoolJar =
  configuredBundletoolJar ||
  bundletoolJarOnPath ||
  "";
const resolvedJarSource = env.BUNDLETOOL_JAR
  ? "BUNDLETOOL_JAR"
  : env.BUNDLETOOL_PATH
    ? "BUNDLETOOL_PATH"
    : bundletoolJarOnPath
      ? "PATH"
      : "";
const java = run("java", ["-version"], { timeout: 10000 });
const bundletoolExecutable = commandPath("bundletool");
const bundletoolCommand = bundletoolExecutable
  ? run(bundletoolExecutable, ["version"], { timeout: 10000 })
  : {
      command: "bundletool version",
      ok: false,
      status: null,
      signal: null,
      stdout: "",
      stderr: "",
      error: "bundletool executable is not on PATH",
    };
const bundletoolJarVersion = bundletoolJar
  ? run("java", ["-jar", bundletoolJar, "version"], { timeout: 10000 })
  : {
      command: "java -jar <BUNDLETOOL_JAR> version",
      ok: false,
      status: null,
      signal: null,
      stdout: "",
      stderr: "",
      error: "bundletool.jar was not found in BUNDLETOOL_JAR, BUNDLETOOL_PATH, or PATH",
    };

const report = {
  host: hostReport(),
  bundletool: {
    envPath: configuredBundletoolJar,
    envPathExists: Boolean(configuredBundletoolJar) && existsSync(configuredBundletoolJar),
    jarOnPath: bundletoolJarOnPath,
    resolvedJarPath: bundletoolJar,
    resolvedJarSource,
    jarPathExists: Boolean(bundletoolJar) && existsSync(bundletoolJar),
    executable: bundletoolExecutable,
    checks: {
      java,
      bundletoolCommand,
      bundletoolJarVersion,
    },
  },
  summary: {
    requiredOk:
      java.ok &&
      Boolean(bundletoolJar) &&
      existsSync(bundletoolJar) &&
      bundletoolJarVersion.ok,
    javaOk: java.ok,
    bundletoolCommandOk: bundletoolCommand.ok,
    bundletoolJarOk:
      Boolean(bundletoolJar) && existsSync(bundletoolJar) && bundletoolJarVersion.ok,
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

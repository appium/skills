#!/usr/bin/env node
import { existsSync } from "node:fs";
import {
  commandPath,
  hostReport,
  run,
} from "./env-check-helpers.mjs";

const env = process.env;
const bundletoolJar =
  env.BUNDLETOOL_JAR ||
  env.BUNDLETOOL_PATH ||
  "";
const java = run("java", ["-version"], { timeout: 10000 });
const bundletoolCommand = run("bundletool", ["version"], { timeout: 10000 });
const bundletoolJarVersion = bundletoolJar
  ? run("java", ["-jar", bundletoolJar, "version"], { timeout: 10000 })
  : {
      command: "java -jar <BUNDLETOOL_JAR> version",
      ok: false,
      status: null,
      signal: null,
      stdout: "",
      stderr: "",
      error: "BUNDLETOOL_JAR or BUNDLETOOL_PATH is not set",
    };

const report = {
  host: hostReport(),
  bundletool: {
    envPath: bundletoolJar,
    envPathExists: Boolean(bundletoolJar) && existsSync(bundletoolJar),
    executable: commandPath("bundletool"),
    checks: {
      java,
      bundletoolCommand,
      bundletoolJarVersion,
    },
  },
  summary: {
    requiredOk:
      java.ok &&
      (bundletoolCommand.ok ||
        (Boolean(bundletoolJar) && existsSync(bundletoolJar) && bundletoolJarVersion.ok)),
    javaOk: java.ok,
    bundletoolCommandOk: bundletoolCommand.ok,
    bundletoolJarOk:
      Boolean(bundletoolJar) && existsSync(bundletoolJar) && bundletoolJarVersion.ok,
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

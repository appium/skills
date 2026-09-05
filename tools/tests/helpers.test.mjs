import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, statSync, chmodSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { run, doctorRequiredOk, driverDoctorStatus, parseDriverVersion } from "../appium/setup/scripts/env-check-helpers.mjs";
import { summarizeReport, reportingOptions, writeReport } from "../appium/setup/scripts/reporting.mjs";
import { smokeServer, parseOptions, serverCommand } from "../appium/setup/scripts/smoke-appium-server.mjs";
import { validateRepository } from "../validate-repository.mjs";

const fixture = fileURLToPath(new URL("fixtures/fake-appium.mjs", import.meta.url));
const options = (driver = "uiautomator2") => parseOptions(["--driver", driver, "--port", "0", "--startup-timeout-ms", "600", "--cleanup-timeout-ms", "250"]);
const command = (behavior = "normal") => ({ executable: process.execPath, prefixArgs: [fixture, behavior] });
const temporary = (t) => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "appium-helper-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
};

test("checks parse evidence beyond the old truncation boundary", () => {
  const doctor = run(process.execPath, ["-e", 'console.log("x".repeat(30000)); console.log("0 required fixes needed")']);
  assert.equal(doctor.ok, true);
  assert.equal(doctorRequiredOk(doctor.stdout), true);
  const listing = JSON.stringify({ padding: "x".repeat(30000), uiautomator2: { version: "9.0.0" } });
  const result = run(process.execPath, ["-e", `process.stdout.write(${JSON.stringify(listing)})`]);
  assert.equal(parseDriverVersion(result.stdout, "uiautomator2"), "9.0.0");
});

test("capture overflow is explicit and cannot pass", () => {
  const result = run(process.execPath, ["-e", 'process.stdout.write("x".repeat(100000))'], { maxBuffer: 1024 });
  assert.equal(result.ok, false);
  assert.equal(result.outputLimitExceeded, true);
  assert.deepEqual(driverDoctorStatus({ ok: false, error: "capture overflow", stdout: "not supported\n0 required fixes needed" }),
    { supported: true, requiredOk: false });
});

test("summary preserves gates and doctor evidence while reducing output", () => {
  const report = { checks: {
    doctor: { ok: true, stdout: `${"noise\n".repeat(8000)}0 required fixes needed`, stderr: "" },
    optional: { ok: false, command: "optional probe", stderr: "not installed" },
  }, summary: { requiredOk: true, optionalWarningsPresent: true } };
  const compact = summarizeReport(report);
  assert.deepEqual(compact.summary, report.summary);
  assert.equal(compact.status, "passed");
  assert.equal(compact.doctorEvidence[0].requiredPassLine, "0 required fixes needed");
  assert.equal(compact.unsuccessfulChecks.length, 1);
  assert.ok(JSON.stringify(compact).length < JSON.stringify(report).length / 20);
  assert.equal(summarizeReport({ summary: { requiredOk: false } }).status, "blocked");
});

test("report flags retain other arguments and diagnostic files never overwrite", (t) => {
  const dir = temporary(t);
  const reportPath = path.join(dir, "report.json");
  const parsed = reportingOptions(["--driver", "gecko", "--format=summary", "--report", reportPath]);
  assert.deepEqual(parsed.args, ["--driver", "gecko"]);
  assert.throws(() => reportingOptions(["--format", "invalid"]));
  // Run a separate process so stdout remains valid TAP in this test runner.
  const module = new URL("../appium/setup/scripts/reporting.mjs", import.meta.url).href;
  const code = `import {writeReport} from ${JSON.stringify(module)}; writeReport({summary:{requiredOk:true}}, ${JSON.stringify(parsed)});`;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", code], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).diagnosticsPath, reportPath);
  assert.equal(JSON.parse(readFileSync(reportPath)).summary.requiredOk, true);
  if (process.platform !== "win32") assert.equal(statSync(reportPath).mode & 0o777, 0o600);
  assert.throws(() => writeReport({}, parsed), /EEXIST/);
  const autoCode = `import {writeReport} from ${JSON.stringify(module)}; writeReport({summary:{requiredOk:true}}, {format:"summary",reportPath:"auto"});`;
  const auto = spawnSync(process.execPath, ["--input-type=module", "-e", autoCode], { encoding: "utf8" });
  assert.equal(auto.status, 0, auto.stderr);
  const autoPath = JSON.parse(auto.stdout).diagnosticsPath;
  t.after(() => rmSync(path.dirname(autoPath), { recursive: true, force: true }));
  assert.equal(JSON.parse(readFileSync(autoPath)).summary.requiredOk, true);
});

test("server smoke preserves an existing listener and cleans up its own process", async (t) => {
  const existing = http.createServer((req, res) => res.end("unrelated"));
  await new Promise((resolve) => existing.listen(0, "127.0.0.1", resolve));
  t.after(() => existing.close());
  const port = existing.address().port;
  const report = await smokeServer({ ...options(), port }, { command: command() });
  assert.equal(report.summary.requiredOk, true, JSON.stringify(report.summary));
  assert.notEqual(new URL(report.serverUrl).port, String(port));
  assert.equal(await (await fetch(`http://127.0.0.1:${port}`)).text(), "unrelated");
  await assert.rejects(fetch(report.serverUrl));
});

for (const behavior of ["exit", "not-ready", "wrong-driver", "invalid-json"]) {
  test(`server ${behavior} blocks and still cleans up`, async () => {
    const report = await smokeServer(options(), { command: command(behavior) });
    assert.equal(report.summary.requiredOk, false);
    assert.equal(report.checks.cleanupOk, process.platform === "win32" && behavior === "exit" ? false : true);
    assert.match(report.summary.error, behavior === "exit" ? /exited/ : /timed out/);
  });
}

test("missing command blocks without unhandled spawn errors", async () => {
  const report = await smokeServer(options(), { command: { executable: "/missing/appium", prefixArgs: [] } });
  assert.equal(report.summary.requiredOk, false);
  assert.equal(report.checks.cleanupOk, true);
});

test("owned child processes exit and stubborn servers are terminated", { skip: process.platform === "win32" }, async () => {
  for (const behavior of ["child", "ignore-term"]) {
    const report = await smokeServer(options(), { command: command(behavior) });
    assert.equal(report.summary.requiredOk, true, JSON.stringify(report.summary));
    const worker = report.logs.match(/worker-pid=(\d+)/)?.[1];
    if (worker) assert.throws(() => process.kill(Number(worker), 0), /ESRCH/);
  }
});

test("Chromium creates/deletes a session and keeps downloads disabled", async () => {
  const report = await smokeServer(options("chromium"), { command: command() });
  assert.equal(report.summary.requiredOk, true, JSON.stringify(report.summary));
  assert.match(report.logs, /autodownload=false/);
  assert.match(report.logs, /session-deleted/);
  for (const behavior of ["session-failure", "delete-failure"]) {
    const failed = await smokeServer(options("chromium"), { command: command(behavior) });
    assert.equal(failed.summary.requiredOk, false);
    assert.equal(failed.checks.cleanupOk, true);
  }
});

test("SIGTERM interrupts startup and cleans up", { skip: process.platform === "win32" }, async () => {
  const child = spawn(process.execPath, [fileURLToPath(new URL("fixtures/smoke-wrapper.mjs", import.meta.url))]);
  let stdout = "";
  child.stdout.on("data", (data) => { stdout += data; });
  const timer = setTimeout(() => child.kill("SIGTERM"), 250);
  const code = await new Promise((resolve) => child.once("exit", resolve));
  clearTimeout(timer);
  assert.equal(code, 1);
  const report = JSON.parse(stdout);
  assert.equal(report.summary.error, "Interrupted");
  assert.equal(report.checks.cleanupOk, true);
});

test("local mode resolves a real dependency and never falls back globally", (t) => {
  const dir = temporary(t);
  assert.throws(() => serverCommand("local", dir), /no download or global fallback/);
  const appium = path.join(dir, "node_modules/appium");
  mkdirSync(appium, { recursive: true });
  writeFileSync(path.join(appium, "package.json"), '{"bin":{"appium":"main.js"}}');
  writeFileSync(path.join(appium, "main.js"), "");
  assert.deepEqual(serverCommand("local", dir).prefixArgs, [path.join(appium, "main.js")]);
  assert.throws(() => parseOptions(["--driver", "gecko", "--allow-driver-download"]));
});

test("smoke CLI uses global mode by default and supports an explicit local dependency", { skip: process.platform === "win32" }, async (t) => {
  const dir = temporary(t);
  const shim = path.join(dir, "appium");
  const fixtureUrl = JSON.stringify(new URL("fixtures/fake-appium.mjs", import.meta.url).href);
  const fakeImport = `import ${fixtureUrl};\n`;
  writeFileSync(shim, `#!/usr/bin/env node\nimport(${fixtureUrl});\n`);
  chmodSync(shim, 0o755);
  const packageDir = path.join(dir, "node_modules/appium");
  mkdirSync(packageDir, { recursive: true });
  writeFileSync(path.join(packageDir, "package.json"), '{"bin":{"appium":"main.mjs"}}');
  writeFileSync(path.join(packageDir, "main.mjs"), fakeImport);
  const cli = fileURLToPath(new URL("../appium/setup/scripts/smoke-appium-server.mjs", import.meta.url));
  for (const mode of ["global", "local"]) {
    const args = [cli, "--driver", "uiautomator2", "--port", "0"];
    if (mode === "local") args.push("--appium-mode", "local");
    const child = spawn(process.execPath, args, { cwd: dir, env: { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH}` } });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    const code = await new Promise((resolve) => child.once("close", resolve));
    assert.equal(code, 0, output);
    const report = JSON.parse(output);
    assert.equal(report.appiumMode, mode);
    assert.equal(report.summary.requiredOk, true);
  }
});


test("repository validator detects broken links, metadata, syntax, and whitespace", (t) => {
  const dir = temporary(t);
  const git = (...args) => {
    const result = spawnSync("git", ["-C", dir, ...args], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  };
  mkdirSync(path.join(dir, "skills/example/agents"), { recursive: true });
  mkdirSync(path.join(dir, "contexts"));
  mkdirSync(path.join(dir, "tools"));
  writeFileSync(path.join(dir, "AGENTS.md"), "# Guide\n");
  const skillPath = path.join(dir, "skills/example/SKILL.md");
  writeFileSync(skillPath, '---\nname: example\ndescription: Example\n---\nRead `contexts/example.md`.\n');
  writeFileSync(path.join(dir, "contexts/example.md"), "Example\n");
  writeFileSync(path.join(dir, "tools/check.mjs"), "export const ok = true;\n");
  git("init", "--quiet"); git("add", ".");
  git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "--quiet", "-m", "fixture");
  assert.equal(validateRepository(dir, { all: true }).summary.requiredOk, true);
  const uiPath = path.join(dir, "skills/example/agents/openai.yaml");
  writeFileSync(uiPath, 'interface:\n  display_name: Example\n  short_description: Example\n  default_prompt: Use $wrong\n');
  assert.ok(validateRepository(dir).errors.some((item) => /wrong skill/.test(item.message)));
  rmSync(uiPath);
  rmSync(path.join(dir, "contexts/example.md"));
  assert.ok(validateRepository(dir).errors.some((item) => item.check === "reference"));
  writeFileSync(skillPath, '---\nname: wrong-name\ndescription: Example\n---\nTrailing space  \n');
  writeFileSync(path.join(dir, "tools/check.mjs"), "export const = ;\n");
  const report = validateRepository(dir);
  for (const check of ["metadata", "syntax", "whitespace"]) assert.ok(report.errors.some((item) => item.check === check), check);
});

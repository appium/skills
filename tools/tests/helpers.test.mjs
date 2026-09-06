import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, statSync, chmodSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { run, doctorRequiredOk, driverDoctorStatus, parseDriverVersion } from "../appium/setup/scripts/env-check-helpers.mjs";
import { summarizeReport, reportingOptions, writeReport } from "../appium/setup/scripts/reporting.mjs";
import { smokeServer, parseOptions, serverCommand } from "../appium/setup/scripts/smoke-appium-server.mjs";
import { validateRepository } from "../validate-repository.mjs";
import { commandInvocation, windowsArgument } from "../appium/setup/scripts/windows-command.mjs";
import { windowsJobScript } from "../appium/setup/scripts/windows-job.mjs";

const fixture = fileURLToPath(new URL("fixtures/fake-appium.mjs", import.meta.url));
const windows = process.platform === "win32";
const options = (driver = "uiautomator2") => parseOptions(["--driver", driver, "--port", "0", "--startup-timeout-ms", windows ? "10000" : "600", "--cleanup-timeout-ms", windows ? "5000" : "250"]);
const command = (behavior = "normal") => ({ executable: process.execPath, prefixArgs: [fixture, behavior] });
const temporary = (t) => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "appium helper (test)-"));
  t.after(() => rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }));
  return dir;
};

const powershell = process.env.APPIUM_TEST_POWERSHELL || (windows ? "powershell.exe" : "");
test("PowerShell supervisor reads environment paths and runs its configured entrypoint", { skip: !powershell }, (t) => {
  const dir = temporary(t);
  const source = path.join(dir, "fixture source.cs");
  const config = path.join(dir, "command.json");
  const resultFile = path.join(dir, "result.json");
  // Exercise the real PowerShell bootstrap without invoking Windows APIs.
  writeFileSync(source, `public static class AppiumWindowsJob {
    public static bool OwnerExited { get { return false; } }
    public static bool Run(string executable, string commandLine, int parentId, string stopFile, int timeoutMs) {
      return executable == "fixture.exe" && commandLine == "space argument" && parentId == 123 && timeoutMs == 5000;
    }
  }`);
  writeFileSync(config, JSON.stringify({ executable: "fixture.exe", commandLine: "space argument",
    parentId: 123, stopFile: path.join(dir, "stop"), timeoutMs: 5000, resultFile }));
  const result = spawnSync(powershell, ["-NoProfile", "-NonInteractive", "-Command", windowsJobScript], {
    encoding: "utf8", timeout: 30000,
    env: { ...process.env, APPIUM_JOB_SOURCE: source, APPIUM_JOB_CONFIG: config },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(readFileSync(resultFile, "utf8")), { cleanupOk: true });
  // Also execute the environment-path read used when the owner has exited.
  writeFileSync(source, readFileSync(source, "utf8").replace("return false;", "return true;"));
  const orphan = spawnSync(powershell, ["-NoProfile", "-NonInteractive", "-Command", windowsJobScript], {
    encoding: "utf8", timeout: 30000,
    env: { ...process.env, APPIUM_JOB_SOURCE: source, APPIUM_JOB_CONFIG: config },
  });
  assert.equal(orphan.status, 0, orphan.stderr);
  assert.throws(() => statSync(dir), { code: "ENOENT" });
});

function launcher(dir, name, source, extension = ".cmd") {
  const entry = path.join(dir, `${name}.mjs`);
  writeFileSync(entry, source);
  const shim = path.join(dir, `${name}${windows ? extension : ""}`);
  writeFileSync(shim, windows
    ? `@echo off\r\n"${process.execPath}" "${entry}" %*\r\n`
    : `#!/usr/bin/env node\nimport ${JSON.stringify(pathToFileURL(entry).href)};\n`);
  chmodSync(shim, 0o755);
  return shim;
}

test("native Windows argument quoting preserves spaces and trailing backslashes", () => {
  assert.equal(windowsArgument('C:\\Program Files\\folder\\'), '"C:\\Program Files\\folder\\\\"');
  assert.equal(windowsArgument('a"b'), '"a\\"b"');
});

test("Windows batch execution resolves PATH and preserves literal path arguments", { skip: !windows }, (t) => {
  const dir = temporary(t);
  const shim = launcher(dir, "sdkmanager", 'console.log(JSON.stringify(process.argv.slice(2)));', ".bat");
  const args = ["--list_installed", "C:\\Program Files (x86)\\SDK & Tools\\", ""];
  const result = run(shim, args);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.deepEqual(JSON.parse(result.stdout), args);
  assert.throws(() => commandInvocation(shim, ["%PATH%"]), /Unsupported/);
  const npm = run("npm", ["--version"]);
  assert.equal(npm.ok, true, JSON.stringify(npm));
});

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

for (const driver of ["xcuitest", "espresso", "mac2", "uiautomator2", "chromium", "gecko"]) {
test(`${driver} summary accepts doctor evidence from either stream only on success`, { skip: windows && ["xcuitest", "mac2"].includes(driver) }, (t) => {
  const dir = temporary(t);
  const shim = `#!/usr/bin/env node
const name = process.argv[1].split(/[\\\\/]/).pop().replace(/\\.mjs$/, "");
if (name === "appium") {
  if (process.argv[2] === "-v") console.log("3.5.2");
  else if (process.argv[3] === "list") console.log(JSON.stringify({[process.env.TEST_DRIVER]: {version: "12.8.2"}}));
  else if (process.argv[3] === "doctor") {
    process[process.env.TEST_DOCTOR_STREAM].write(process.env.TEST_DOCTOR_OUTPUT);
    process.exitCode = Number(process.env.TEST_DOCTOR_EXIT);
  } else process.exitCode = 1;
} else if (name === "xcodebuild") console.log("Xcode 26.6");
else if (name === "xcode-select") console.log("/fixture/Xcode.app/Contents/Developer");
else if (name === "xcrun") console.log("== Devices ==");
else if (name === "java" || name === "javac") console.log("21.0.1");
else if (name === "adb") console.log("List of devices attached");
else if (name === "emulator") console.log("fixture-avd");
else if (name === "sdkmanager") console.log("platform-tools | installed\\nemulator | installed\\nplatforms;android-35 | installed\\nbuild-tools;35.0.0 | installed");
else console.log("fixture version 1.0");
`;
  for (const name of ["appium", "xcodebuild", "xcode-select", "xcrun", "java", "javac", "adb", "emulator", "sdkmanager", "firefox", "geckodriver", "google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge", "msedge"]) {
    launcher(dir, name, shim, name === "sdkmanager" ? ".bat" : ".cmd");
  }
  const cli = fileURLToPath(new URL(`../appium/setup/scripts/check-${driver}-env.mjs`, import.meta.url));
  for (const stream of ["stdout", "stderr"]) {
    for (const [exitCode, output, expected] of [
      [0, "0 required fixes needed, 2 optional fixes possible.\n", true],
      [1, "0 required fixes needed\n", false],
      [0, "1 required fixes needed\n", false],
    ]) {
      const result = spawnSync(process.execPath, [cli, "--format", "summary"], {
        cwd: dir, encoding: "utf8", timeout: 30000,
        env: { ...process.env, PATH: `${dir}${path.delimiter}${process.env.PATH}`,
          ANDROID_HOME: dir, ANDROID_SDK_ROOT: dir, TEST_DRIVER: driver,
          TEST_DOCTOR_STREAM: stream, TEST_DOCTOR_OUTPUT: output, TEST_DOCTOR_EXIT: String(exitCode) },
      });
      assert.equal(result.status, 0, result.stderr);
      const report = JSON.parse(result.stdout);
      assert.equal(report.summary.doctorRequiredOk, expected, `${stream}, exit ${exitCode}, ${output}`);
      if (driver !== "uiautomator2") assert.equal(report.appium.strictDoctorGateOk, expected);
      const hostSupported = !["xcuitest", "mac2"].includes(driver) || process.platform === "darwin";
      assert.equal(report.summary.requiredOk, expected && hostSupported);
    }
  }
});
}

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
    assert.equal(report.checks.cleanupOk, true);
    assert.match(report.summary.error, behavior === "exit" ? /exited/ : /timed out/);
  });
}

test("missing command blocks without unhandled spawn errors", async () => {
  const report = await smokeServer(options(), { command: { executable: "/missing/appium", prefixArgs: [] } });
  assert.equal(report.summary.requiredOk, false);
  assert.equal(report.checks.cleanupOk, !windows); // Windows startup errors lack a verified job result.
});

test("owned child processes exit and stubborn servers are terminated", async () => {
  for (const behavior of ["child", "ignore-term"]) {
    const report = await smokeServer(options(), { command: command(behavior) });
    assert.equal(report.summary.requiredOk, true, JSON.stringify(report.summary));
    const worker = report.logs.match(/worker-pid=(\d+)/)?.[1];
    if (worker) assert.throws(() => process.kill(Number(worker), 0), /ESRCH/);
  }
});

test("cleanup removes descendants after the server parent exits", async () => {
  const report = await smokeServer(options(), { command: command("orphan") });
  assert.equal(report.summary.requiredOk, false);
  assert.equal(report.checks.cleanupOk, true, JSON.stringify(report));
  const worker = report.logs.match(/worker-pid=(\d+)/)?.[1];
  assert.ok(worker, report.logs);
  assert.throws(() => process.kill(Number(worker), 0), /ESRCH/);
});

test("Windows job survives Node supervisor death long enough to clean its tree", { skip: !windows, timeout: 30000 }, async (t) => {
  const dir = temporary(t);
  const entry = path.join(dir, "owner.mjs");
  const jobModule = new URL("../appium/setup/scripts/windows-job.mjs", import.meta.url).href;
  writeFileSync(entry, `import {spawnWindowsJob} from ${JSON.stringify(jobModule)};
const child = spawnWindowsJob(process.execPath, ${JSON.stringify([fixture, "child", "--port", "0"])}, 5000);
child.stdout.pipe(process.stdout); child.stderr.pipe(process.stderr);
`);
  const owner = spawn(process.execPath, [entry]);
  t.after(() => { if (owner.exitCode === null && owner.signalCode === null) owner.kill(); });
  let output = "";
  let worker;
  owner.stdout.on("data", (chunk) => {
    output += chunk;
    worker = output.match(/worker-pid=(\d+)/)?.[1];
    if (worker && owner.signalCode === null) owner.kill();
  });
  owner.stderr.on("data", (chunk) => { output += chunk; });
  await new Promise((resolve, reject) => { owner.once("close", resolve); owner.once("error", reject); });
  assert.ok(worker, output);
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    try { process.kill(Number(worker), 0); }
    catch (error) { if (error.code === "ESRCH") break; throw error; }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  assert.throws(() => process.kill(Number(worker), 0), /ESRCH/);
});

test("Chromium creates/deletes a session and keeps downloads disabled", async () => {
  const report = await smokeServer({ ...options("chromium"), browser: "edge",
    browserBinary: "C:\\Program Files (x86)\\Microsoft\\Edge\\msedge.exe",
    driverExecutable: "C:\\Web Drivers\\msedgedriver.exe" }, { command: command() });
  assert.equal(report.summary.requiredOk, true, JSON.stringify(report.summary));
  assert.match(report.logs, /autodownload=false/);
  assert.match(report.logs, /session-deleted/);
  const caps = JSON.parse(report.logs.match(/capabilities=(.*)/)[1]);
  assert.equal(caps.platformName, { darwin: "mac", linux: "linux", win32: "windows" }[process.platform]);
  assert.equal(caps.browserName, "MicrosoftEdge");
  assert.equal(caps["ms:edgeOptions"].binary, "C:\\Program Files (x86)\\Microsoft\\Edge\\msedge.exe");
  assert.equal(caps["appium:executable"], "C:\\Web Drivers\\msedgedriver.exe");
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

test("smoke CLI uses global mode by default and supports an explicit local dependency", async (t) => {
  const dir = temporary(t);
  const fixtureUrl = JSON.stringify(new URL("fixtures/fake-appium.mjs", import.meta.url).href);
  const fakeImport = `import ${fixtureUrl};\n`;
  launcher(dir, "appium", fakeImport);
  const packageDir = path.join(dir, "node_modules/appium");
  mkdirSync(packageDir, { recursive: true });
  writeFileSync(path.join(packageDir, "package.json"), '{"bin":{"appium":"main.mjs"}}');
  writeFileSync(path.join(packageDir, "main.mjs"), fakeImport);
  const cli = fileURLToPath(new URL("../appium/setup/scripts/smoke-appium-server.mjs", import.meta.url));
  for (const [mode, driver] of [["global", "uiautomator2"], ["local", "uiautomator2"], ["global", "espresso"], ["global", "gecko"], ["global", "chromium"]]) {
    const args = [cli, "--driver", driver, "--port", "0"];
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

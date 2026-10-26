#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { reportingOptions, writeReport } from "../../setup/scripts/reporting.mjs";

const RELEVANT_LOG_PATTERN =
  /WebDriverAgent|xcodebuild|Proxying|timed out|ECONNREFUSED|Signing for|ApplicationVerificationFailed|provisioning profile|ServerURLHere|DerivedData/i;

export function sanitizeDiagnosticText(value) {
  return String(value || "")
    .replace(/\u001b\[[0-9;]*m/g, "")
    .replace(/(https?:\/\/)[^\s/@]+:[^\s/@]+@/g, "$1<redacted>@")
    .replace(/([?&](?:token|key|password|secret)=)[^&\s]+/gi, "$1<redacted>")
    .replace(/\b(DEVELOPMENT_TEAM|xcodeOrgId)\s*[=:]\s*["']?[A-Z0-9]{10}["']?/g, "$1=<redacted-team-id>")
    .replace(/(Apple Development|Apple Distribution|iPhone Developer|iPhone Distribution):\s*[^\n"')]*/g, "$1: <redacted-identity>")
    .replace(/\b[0-9a-fA-F]{8}-[0-9a-fA-F]{16}\b/g, "<redacted-udid>")
    .replace(/\b[0-9a-fA-F]{40}\b/g, "<redacted-udid>");
}

function sanitizeUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.username || parsed.password) {
      parsed.username = "";
      parsed.password = "";
    }
    for (const key of [...parsed.searchParams.keys()]) {
      if (/^(?:token|key|password|secret)$/i.test(key)) {
        parsed.searchParams.set(key, "<redacted>");
      }
    }
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return sanitizeDiagnosticText(rawUrl).replace(/\/$/, "");
  }
}

export function parseWdaDiagnosticArgs(args = process.argv.slice(2)) {
  const options = {
    appiumLog: "",
    derivedData: "",
    wdaUrl: "",
    timeoutMs: 5000,
    maxLines: 50,
  };

  for (let i = 0; i < args.length; i += 1) {
    const [flag, ...rest] = args[i].split("=");
    const nextValue = () => {
      const value = rest.length ? rest.join("=") : args[++i];
      if (!value || value.startsWith("--")) {
        throw new Error(`${flag} requires a value`);
      }
      return value;
    };

    if (flag === "--appium-log") {
      options.appiumLog = path.resolve(nextValue());
    } else if (flag === "--derived-data") {
      options.derivedData = path.resolve(nextValue());
    } else if (flag === "--wda-url") {
      options.wdaUrl = nextValue();
    } else if (flag === "--timeout-ms") {
      const parsed = Number.parseInt(nextValue(), 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error("--timeout-ms must be a positive integer");
      }
      options.timeoutMs = parsed;
    } else if (flag === "--max-lines") {
      const parsed = Number.parseInt(nextValue(), 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error("--max-lines must be a positive integer");
      }
      options.maxLines = parsed;
    } else {
      throw new Error(
        "Usage: collect-wda-diagnostics.mjs [--appium-log path] [--derived-data path] [--wda-url url] [--timeout-ms ms] [--max-lines count] [--format summary|full] [--report path]",
      );
    }
  }

  return options;
}

export function parseAppiumWdaLog(text, maxLines = 50) {
  const lines = String(text || "").split(/\r?\n/);
  const proxiedWdaUrls = new Set();
  const serverUrlsFromLog = new Set();
  const derivedDataPaths = new Set();
  const matchedLines = [];
  const failureSignals = {
    signingError: false,
    xcodebuildFailed: false,
    proxyFailure: false,
  };

  for (const line of lines) {
    if (!line.trim()) continue;

    for (const match of line.matchAll(/Proxying\s+\[[^\]]+\]\s+to\s+\[[A-Z]+\s+(https?:\/\/[^\s\]]+)\]/gi)) {
      try {
        const parsed = new URL(match[1]);
        proxiedWdaUrls.add(sanitizeUrl(parsed.origin));
      } catch {
        // Ignore malformed URLs in log lines.
      }
    }

    for (const match of line.matchAll(/ServerURLHere->(https?:\/\/[^\s<]+)<-ServerURLHere/g)) {
      serverUrlsFromLog.add(sanitizeUrl(match[1]));
    }

    for (const match of line.matchAll(/(\/[^\s"']*\/DerivedData\/WebDriverAgent-[A-Za-z0-9_.-]+)/g)) {
      derivedDataPaths.add(match[1]);
    }

    if (/Signing for .* requires a development team|No profiles for .* were found|ApplicationVerificationFailed|unable to find usable provisioning profile|Code Signing Error/i.test(line)) {
      failureSignals.signingError = true;
    }
    if (/xcodebuild failed with code|TEST BUILD FAILED|Testing failed:/i.test(line)) {
      failureSignals.xcodebuildFailed = true;
    }
    if (/Could not proxy command to the remote server|ECONNREFUSED|socket hang up|timed out waiting for WebDriverAgent/i.test(line)) {
      failureSignals.proxyFailure = true;
    }

    if (RELEVANT_LOG_PATTERN.test(line)) {
      matchedLines.push(sanitizeDiagnosticText(line.trim()));
    }
  }

  return {
    proxiedWdaUrls: [...proxiedWdaUrls],
    serverUrlsFromLog: [...serverUrlsFromLog],
    derivedDataPaths: [...derivedDataPaths],
    failureSignals,
    matchedLines: matchedLines.slice(-maxLines),
  };
}

function collectWdaLogFiles(rootDir, maxDepth = 5) {
  if (!rootDir || !existsSync(rootDir)) return [];
  const results = [];

  function visit(currentDir, depth) {
    if (depth > maxDepth) return;
    let entries;
    try {
      entries = readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.endsWith(".xcresult")) {
          results.push({ path: fullPath, type: "xcresult", mtimeMs: safeMtime(fullPath) });
        } else {
          visit(fullPath, depth + 1);
        }
      } else if (
        entry.isFile() &&
        (/StandardOutputAndStandardError.*\.txt$/i.test(entry.name) ||
          /Session-WebDriverAgentRunner-.*\.log$/i.test(entry.name) ||
          /WebDriverAgent.*\.(?:log|txt)$/i.test(entry.name))
      ) {
        results.push({ path: fullPath, type: "log", mtimeMs: safeMtime(fullPath) });
      }
    }
  }

  visit(rootDir, 0);
  return results.sort((a, b) => b.mtimeMs - a.mtimeMs);
}

function safeMtime(targetPath) {
  try {
    return statSync(targetPath).mtimeMs;
  } catch {
    return 0;
  }
}

export function inspectDerivedDataWda(derivedDataInput, discoveredPaths = [], maxLines = 50) {
  const defaultDerivedData = path.join(os.homedir(), "Library/Developer/Xcode/DerivedData");
  const candidateRoots = [];

  if (derivedDataInput) {
    candidateRoots.push(derivedDataInput);
  } else {
    for (const discovered of discoveredPaths) {
      candidateRoots.push(discovered);
    }
    if (existsSync(defaultDerivedData)) {
      candidateRoots.push(defaultDerivedData);
    }
  }

  const wdaDirectories = [];
  for (const root of candidateRoots) {
    if (!existsSync(root)) continue;
    const baseName = path.basename(root);
    if (/^WebDriverAgent(?:-|$)/i.test(baseName) || existsSync(path.join(root, "Logs/Test"))) {
      wdaDirectories.push(root);
      continue;
    }
    try {
      for (const entry of readdirSync(root, { withFileTypes: true })) {
        if (entry.isDirectory() && !entry.isSymbolicLink() && /^WebDriverAgent-/i.test(entry.name)) {
          wdaDirectories.push(path.join(root, entry.name));
        }
      }
    } catch {
      // Ignore unreadable directories.
    }
  }

  const uniqueWdaDirs = [...new Set(wdaDirectories)].sort((a, b) => safeMtime(b) - safeMtime(a));
  const artifacts = uniqueWdaDirs.flatMap((dir) =>
    collectWdaLogFiles(existsSync(path.join(dir, "Logs/Test")) ? path.join(dir, "Logs/Test") : dir),
  );
  const logFiles = artifacts.filter((item) => item.type === "log");
  const xcresultBundles = artifacts.filter((item) => item.type === "xcresult");

  let latestLogExcerpt = [];
  const serverUrlsFromWdaLog = new Set();
  const failureSignals = {
    signingError: false,
    xcodebuildFailed: false,
    proxyFailure: false,
  };

  if (logFiles.length > 0) {
    try {
      const content = readFileSync(logFiles[0].path, "utf8");
      const parsed = parseAppiumWdaLog(content, maxLines);
      latestLogExcerpt = parsed.matchedLines.length > 0
        ? parsed.matchedLines
        : content
            .split(/\r?\n/)
            .filter((line) => line.trim())
            .slice(-maxLines)
            .map((line) => sanitizeDiagnosticText(line.trim()));
      for (const url of parsed.serverUrlsFromLog) {
        serverUrlsFromWdaLog.add(url);
      }
      failureSignals.signingError = parsed.failureSignals.signingError;
      failureSignals.xcodebuildFailed = parsed.failureSignals.xcodebuildFailed;
      failureSignals.proxyFailure = parsed.failureSignals.proxyFailure;
    } catch {
      // Ignore unreadable log files.
    }
  }

  return {
    inspectedRoots: candidateRoots,
    wdaDirectories: uniqueWdaDirs,
    logFiles: logFiles.map((item) => item.path),
    xcresultBundles: xcresultBundles.map((item) => item.path),
    serverUrlsFromWdaLog: [...serverUrlsFromWdaLog],
    failureSignals,
    latestLogExcerpt,
  };
}

export async function probeWdaStatus(wdaUrl, timeoutMs = 5000) {
  const baseUrl = sanitizeUrl(wdaUrl);
  const statusUrl = `${wdaUrl.replace(/\/$/, "")}/status`;
  try {
    const response = await fetch(statusUrl, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await response.text();
    let payload = null;
    try {
      payload = JSON.parse(text);
    } catch {
      // Non-JSON response body.
    }
    const valueObject = payload && typeof payload === "object" && typeof payload.value === "object" && payload.value !== null;
    const ok = response.ok && Boolean(valueObject);
    return {
      command: `GET ${baseUrl}/status`,
      url: baseUrl,
      ok,
      status: response.status,
      stdout: ok ? sanitizeDiagnosticText(JSON.stringify({ state: payload.value.state || "ready", os: payload.value.os?.name })) : "",
      stderr: ok ? "" : sanitizeDiagnosticText(text.slice(0, 400) || `HTTP ${response.status}`),
    };
  } catch (error) {
    return {
      command: `GET ${baseUrl}/status`,
      url: baseUrl,
      ok: false,
      status: null,
      stdout: "",
      stderr: "",
      error: sanitizeDiagnosticText(error.message),
    };
  }
}

export async function collectWdaDiagnostics(options = {}) {
  const {
    appiumLog = "",
    derivedData = "",
    wdaUrl = "",
    timeoutMs = 5000,
    maxLines = 50,
  } = options;

  let appiumLogReport = {
    provided: Boolean(appiumLog),
    exists: false,
    proxiedWdaUrls: [],
    serverUrlsFromLog: [],
    derivedDataPaths: [],
    failureSignals: {
      signingError: false,
      xcodebuildFailed: false,
      proxyFailure: false,
    },
    matchedLines: [],
  };

  if (appiumLog && existsSync(appiumLog) && statSync(appiumLog).isFile()) {
    const raw = readFileSync(appiumLog, "utf8");
    const parsed = parseAppiumWdaLog(raw, maxLines);
    appiumLogReport = {
      provided: true,
      exists: true,
      ...parsed,
    };
  }

  const derivedDataReport = inspectDerivedDataWda(
    derivedData,
    appiumLogReport.derivedDataPaths,
    maxLines,
  );

  const wdaStatus = wdaUrl ? await probeWdaStatus(wdaUrl, timeoutMs) : null;

  const combinedSignals = {
    signingError: appiumLogReport.failureSignals.signingError || derivedDataReport.failureSignals.signingError,
    xcodebuildFailed: appiumLogReport.failureSignals.xcodebuildFailed || derivedDataReport.failureSignals.xcodebuildFailed,
    proxyFailure: appiumLogReport.failureSignals.proxyFailure || derivedDataReport.failureSignals.proxyFailure,
  };

  const serverUrls = [
    ...new Set([
      ...appiumLogReport.proxiedWdaUrls,
      ...appiumLogReport.serverUrlsFromLog,
      ...derivedDataReport.serverUrlsFromWdaLog,
    ]),
  ];

  const appiumLogOk = !appiumLog || appiumLogReport.exists;
  const derivedDataOk = !derivedData || existsSync(derivedData);
  const wdaStatusOk = wdaStatus ? wdaStatus.ok : null;
  const hasEvidence =
    appiumLogReport.exists ||
    derivedDataReport.logFiles.length > 0 ||
    derivedDataReport.xcresultBundles.length > 0 ||
    wdaStatus !== null;

  return {
    appiumLog: appiumLogReport,
    derivedData: derivedDataReport,
    ...(wdaStatus ? { checks: { wdaStatus } } : {}),
    summary: {
      requiredOk: Boolean(hasEvidence && appiumLogOk && derivedDataOk && (wdaStatusOk === null || wdaStatusOk)),
      appiumLogInspected: appiumLogReport.exists,
      wdaLogFilesFound: derivedDataReport.logFiles.length,
      xcresultBundlesFound: derivedDataReport.xcresultBundles.length,
      discoveredWdaUrls: serverUrls,
      failureSignals: combinedSignals,
      wdaStatusOk,
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const outputOptions = reportingOptions(process.argv.slice(2), "summary");
    const parsedArgs = parseWdaDiagnosticArgs(outputOptions.args);
    const report = await collectWdaDiagnostics(parsedArgs);
    writeReport(report, outputOptions);
    process.exitCode = report.summary.requiredOk ? 0 : 1;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

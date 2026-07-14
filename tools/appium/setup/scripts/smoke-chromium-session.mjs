#!/usr/bin/env node

const options = parseArguments(process.argv.slice(2));
const serverUrl = normalizeServerUrl(options.serverUrl);
const platformName = platformNameForHost();
const browserName = options.browser === "edge" ? "MicrosoftEdge" : "chrome";
const automaticDriverDownloadAllowed = options.allowDriverDownload;
const alwaysMatch = {
  platformName,
  browserName,
  "appium:automationName": "Chromium",
  "appium:autodownloadEnabled": automaticDriverDownloadAllowed,
};

if (options.driverExecutable) {
  alwaysMatch["appium:executable"] = options.driverExecutable;
}

if (options.browserBinary) {
  const capability = options.browser === "edge"
    ? "ms:edgeOptions"
    : "goog:chromeOptions";
  alwaysMatch[capability] = { binary: options.browserBinary };
}

let statusCheck = emptyCheck();
let createSession = emptyCheck();
let deleteSession = emptyCheck();
let sessionId = "";
let error = "";

try {
  const result = await requestJson(`${serverUrl.href}status`, {}, 15000);
  const ready = result.body?.value?.ready === true;
  statusCheck = {
    ok: result.ok && ready,
    status: result.status,
    ready,
  };
  if (!statusCheck.ok) {
    error = responseError(result, "Appium status did not report ready");
  }
} catch (caught) {
  error = safeMessage(caught);
}

if (statusCheck.ok) {
  try {
    const result = await requestJson(
      `${serverUrl.href}session`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          capabilities: {
            alwaysMatch,
            firstMatch: [{}],
          },
        }),
      },
      120000,
    );
    sessionId = result.body?.value?.sessionId || result.body?.sessionId || "";
    createSession = {
      ok: result.ok && Boolean(sessionId),
      status: result.status,
      sessionCreated: Boolean(sessionId),
    };
    if (!createSession.ok) {
      error = responseError(result, "Chromium session was not created");
    }
  } catch (caught) {
    error = safeMessage(caught);
  }
}

if (sessionId) {
  try {
    const result = await requestJson(
      `${serverUrl.href}session/${encodeURIComponent(sessionId)}`,
      { method: "DELETE" },
      30000,
    );
    deleteSession = {
      ok: result.ok,
      status: result.status,
      sessionDeleted: result.ok,
    };
    if (!deleteSession.ok && !error) {
      error = responseError(result, "Chromium session cleanup failed");
    }
  } catch (caught) {
    error = error || safeMessage(caught);
  }
}

const report = {
  host: {
    platform: process.platform,
    platformName,
  },
  request: {
    serverUrl: sanitizedUrl(serverUrl),
    browser: options.browser,
    browserBinaryProvided: Boolean(options.browserBinary),
    driverExecutableProvided: Boolean(options.driverExecutable),
    automaticDriverDownloadAllowed,
  },
  checks: {
    status: statusCheck,
    createSession,
    deleteSession,
  },
  summary: {
    requiredOk: statusCheck.ok && createSession.ok && deleteSession.ok,
    serverReady: statusCheck.ok,
    sessionCreated: createSession.ok,
    sessionDeleted: deleteSession.ok,
    automaticDriverDownloadAllowed,
    error,
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

function parseArguments(args) {
  const parsed = {
    serverUrl: "http://127.0.0.1:4723/",
    browser: "chrome",
    browserBinary: "",
    driverExecutable: "",
    allowDriverDownload: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--allow-driver-download") {
      parsed.allowDriverDownload = true;
      continue;
    }

    const [name, inlineValue] = argument.split("=", 2);
    if (!["--server-url", "--browser", "--browser-binary", "--driver-executable"].includes(name)) {
      throw new Error(`Unknown argument: ${argument}`);
    }
    const value = inlineValue ?? args[index + 1];
    if (!value || (inlineValue === undefined && value.startsWith("--"))) {
      throw new Error(`${name} requires a value`);
    }
    parsed[optionKey(name)] = value;
    if (inlineValue === undefined) {
      index += 1;
    }
  }

  parsed.browser = parsed.browser.toLowerCase();
  if (!new Set(["chrome", "edge"]).has(parsed.browser)) {
    throw new Error("--browser must be either 'chrome' or 'edge'");
  }
  return parsed;
}

function optionKey(name) {
  return {
    "--server-url": "serverUrl",
    "--browser": "browser",
    "--browser-binary": "browserBinary",
    "--driver-executable": "driverExecutable",
  }[name];
}

function normalizeServerUrl(value) {
  const url = new URL(value);
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error("--server-url must use http or https");
  }
  url.search = "";
  url.hash = "";
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  return url;
}

function sanitizedUrl(value) {
  const url = new URL(value);
  url.username = "";
  url.password = "";
  return url.href;
}

function platformNameForHost() {
  const platformNames = {
    darwin: "mac",
    linux: "linux",
    win32: "windows",
  };
  const platformName = platformNames[process.platform];
  if (!platformName) {
    throw new Error(`Unsupported host platform: ${process.platform}`);
  }
  return platformName;
}

async function requestJson(url, init, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const text = await response.text();
    let body = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = null;
      }
    }
    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function responseError(result, fallback) {
  return trimMessage(result.body?.value?.message || result.body?.message || fallback);
}

function safeMessage(errorValue) {
  return trimMessage(errorValue instanceof Error ? errorValue.message : String(errorValue));
}

function trimMessage(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 2000);
}

function emptyCheck() {
  return { ok: false, status: null };
}

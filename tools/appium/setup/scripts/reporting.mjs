import { mkdtempSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

// Reporting flags are removed before a command's own argument validation.
export function reportingOptions(args = process.argv.slice(2), defaultFormat = "full") {
  const options = { format: defaultFormat, reportPath: "", args: [] };
  for (let i = 0; i < args.length; i += 1) {
    const [name, ...rest] = args[i].split("=");
    if (!["--format", "--report"].includes(name)) {
      options.args.push(args[i]);
      continue;
    }
    const value = rest.length ? rest.join("=") : args[++i];
    if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
    if (name === "--format") options.format = value;
    else options.reportPath = value === "auto" ? "auto" : path.resolve(value);
  }
  if (!["full", "summary"].includes(options.format)) {
    throw new Error("--format must be full or summary");
  }
  return options;
}

function excerpt(value, limit = 400) {
  return String(value || "").replace(/\u001b\[[0-9;]*m/g, "")
    .replace(/(https?:\/\/)[^\s/@]+:[^\s/@]+@/g, "$1<redacted>@")
    .replace(/(Bearer\s+)\S+/gi, "$1<redacted>")
    .replace(/([?&](?:token|key|password|secret)=)[^&\s]+/gi, "$1<redacted>")
    .trim().slice(0, limit);
}

export function summarizeReport(report) {
  const unsuccessfulChecks = [];
  const doctorEvidence = [];
  function compact(value, keyPath = "") {
    if (Array.isArray(value)) return value.map((item, i) => compact(item, `${keyPath}.${i}`));
    if (!value || typeof value !== "object") return value;
    if (typeof value.ok === "boolean" && ("stdout" in value || "stderr" in value)) {
      const output = `${value.stdout || ""}\n${value.stderr || ""}`;
      const result = { ok: value.ok };
      if (value.status !== undefined) result.status = value.status;
      if (/doctor/i.test(keyPath)) {
        const passLine = output.split(/\r?\n/).find((line) => /0 required fixes needed/i.test(line));
        const item = { check: keyPath, ok: value.ok, requiredPassLine: excerpt(passLine) };
        doctorEvidence.push(item);
      } else if (/version/i.test(keyPath) && value.ok) {
        result.value = excerpt(output, 240);
      }
      if (!value.ok) {
        unsuccessfulChecks.push({
          check: keyPath,
          command: excerpt(value.command, 240),
          message: excerpt(value.error || value.stderr || value.stdout),
        });
      }
      return result;
    }
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !["stdout", "stderr", "logs"].includes(key) && !(keyPath === "" && key === "files"))
      .map(([key, item]) => [key, compact(item, keyPath ? `${keyPath}.${key}` : key)]));
  }
  const compactReport = compact(report);
  return {
    status: report.summary?.requiredOk === true ? "passed" : "blocked",
    ...compactReport,
    // These can include optional probes; only summary.requiredOk is the gate.
    unsuccessfulChecks,
    doctorEvidence,
  };
}

export function writeReport(report, options = reportingOptions()) {
  const reportPath = options.reportPath === "auto"
    ? path.join(mkdtempSync(path.join(os.tmpdir(), "appium-report-")), "report.json")
    : options.reportPath;
  if (reportPath) {
    // A private, new file: never replace a user's existing report or follow a symlink.
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, {
      flag: "wx", mode: 0o600,
    });
  }
  const output = options.format === "summary" ? summarizeReport(report) : report;
  if (reportPath) output.diagnosticsPath = reportPath;
  process.stdout.write(`${JSON.stringify(output, null, options.format === "summary" ? 0 : 2)}\n`);
}

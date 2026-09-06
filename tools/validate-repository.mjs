#!/usr/bin/env node
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { reportingOptions, writeReport } from "./appium/setup/scripts/reporting.mjs";

function git(root, args) {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr || `git ${args[0]} failed`);
  return result.stdout;
}

function walk(root, directory) {
  const full = path.join(root, directory);
  if (!existsSync(full)) return [];
  return readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) return []; // Do not traverse external trees.
    return entry.isDirectory() ? walk(root, name) : [name.replaceAll(path.sep, "/")];
  });
}

// Validate the repository's scalar metadata contract, not arbitrary YAML.
// Folded/literal scalar descriptions are supported; unsupported values fail clearly.
function scalar(text, key, indent = 0) {
  const lines = text.split(/\r?\n/);
  const pattern = new RegExp(`^ {${indent}}${key.replaceAll(".", "\\.")}:\\s*(.*)$`);
  const matches = lines.map((line, i) => ({ match: line.match(pattern), i })).filter((item) => item.match);
  if (matches.length !== 1) throw new Error(`Expected one ${key} field at indentation ${indent}`);
  const { match, i } = matches[0];
  const value = match[1].trim();
  if (/^[>|][-+]?$/.test(value)) {
    const parts = [];
    for (const line of lines.slice(i + 1)) {
      if (line.trim() && line.search(/\S/) <= indent) break;
      parts.push(line.trim());
    }
    return parts.join(value.startsWith(">") ? " " : "\n").trim();
  }
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'")) {
    if (!value.endsWith("'")) throw new Error(`Unterminated ${key} scalar`);
    return value.slice(1, -1).replaceAll("''", "'");
  }
  if (!value || /^[\[\]{&*!]|^(true|false|null|\d+)$/i.test(value)) throw new Error(`Expected string scalar for ${key}`);
  return value.replace(/\s+#.*$/, "");
}

export function validateRepository(root, { all = false } = {}) {
  root = path.resolve(root);
  const files = ["AGENTS.md", ...walk(root, "skills"), ...walk(root, "contexts"), ...walk(root, "tools")];
  const errors = [];
  const changed = new Set([
    ...git(root, ["diff", "HEAD", "--name-only", "-z"]).split("\0"),
    ...git(root, ["ls-files", "--others", "--exclude-standard", "-z"]).split("\0"),
  ].filter(Boolean));
  const scope = files.filter((file) => all || changed.has(file));
  // Always resolve references across the repository: this catches callers of
  // a deleted/renamed target even if those callers were not edited.
  const targets = new Set();
  const skills = files.filter((file) => file.endsWith("/SKILL.md"));
  for (const file of files.filter((file) => file.endsWith(".md"))) {
    if (!existsSync(path.join(root, file))) continue;
    const text = readFileSync(path.join(root, file), "utf8");
    for (const target of text.match(/(?:contexts|tools|skills)\/[A-Za-z0-9_./-]+\.(?:md|mjs)/g) || []) {
      targets.add(target);
      const full = path.resolve(root, target);
      if (!full.startsWith(`${root}${path.sep}`) || !existsSync(full) || !statSync(full).isFile()) {
        errors.push({ file, check: "reference", message: `Missing or external target: ${target}` });
      }
    }
  }
  for (const file of skills) {
    try {
      const text = readFileSync(path.join(root, file), "utf8");
      const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
      if (!frontmatter) throw new Error("Missing frontmatter");
      const name = scalar(frontmatter, "name");
      const description = scalar(frontmatter, "description");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64 || name !== path.basename(path.dirname(file))) {
        throw new Error("Skill name must match its directory and use lowercase hyphenated words");
      }
      if (typeof description !== "string" || !description.trim()) throw new Error("Missing description");
      for (const field of ["renma.requires-context", "renma.optional-context"]) {
        if (!frontmatter.includes(`${field}:`)) continue;
        const contexts = JSON.parse(scalar(frontmatter, field, 2));
        if (!Array.isArray(contexts) || contexts.some((target) => typeof target !== "string" ||
          !target.startsWith("contexts/") || !targets.has(target))) throw new Error(`Invalid ${field} relationship`);
      }
      const ui = path.join(root, path.dirname(file), "agents/openai.yaml");
      if (existsSync(ui)) {
        const metadata = readFileSync(ui, "utf8");
        if (!/^interface:\s*$/m.test(metadata)) throw new Error("UI metadata missing interface");
        for (const field of ["display_name", "short_description", "default_prompt"]) {
          const value = scalar(metadata, field, 2);
          if (typeof value !== "string" || !value) throw new Error(`Missing UI ${field}`);
          if (field === "default_prompt" && !value.includes(`$${name}`)) throw new Error("UI prompt invokes the wrong skill");
        }
      }
    } catch (error) { errors.push({ file, check: "metadata", message: error.message }); }
  }
  for (const file of scope.filter((file) => /\.(md|mjs|yaml)$/.test(file))) {
    const lines = readFileSync(path.join(root, file), "utf8").split(/\r?\n/);
    lines.forEach((line, i) => {
      if (/[\t ]+$/.test(line)) errors.push({ file, check: "whitespace", message: `Trailing whitespace on line ${i + 1}` });
    });
  }
  // Shared helper edits require checking every module under tools/.
  const modules = files.filter((file) => file.startsWith("tools/") && file.endsWith(".mjs"));
  const syntaxScope = all || scope.some((file) => file.startsWith("tools/")) ? modules : [];
  for (const file of syntaxScope) {
    const result = spawnSync(process.execPath, ["--check", path.join(root, file)], { encoding: "utf8", timeout: 10000 });
    if (result.status !== 0) errors.push({ file, check: "syntax", message: result.stderr || result.error?.message });
  }
  const whitespace = spawnSync("git", ["-C", root, "diff", "HEAD", "--check"], { encoding: "utf8" });
  if (whitespace.status !== 0) errors.push({ check: "whitespace", message: whitespace.stdout || whitespace.stderr });
  return {
    scope: all ? "all" : "changed", files: scope, errors,
    summary: { requiredOk: errors.length === 0, filesInScope: scope.length, skillsChecked: skills.length,
      targetsChecked: targets.size, modulesChecked: syntaxScope.length, errorCount: errors.length },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const output = reportingOptions(process.argv.slice(2), "summary");
    if (output.args.some((arg) => arg !== "--all")) throw new Error("Usage: validate-repository.mjs [--all] [--format summary|full] [--report path]");
    const root = fileURLToPath(new URL("../", import.meta.url));
    const report = validateRepository(root, { all: output.args.includes("--all") });
    writeReport(report, output);
    process.exitCode = report.summary.requiredOk ? 0 : 1;
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}

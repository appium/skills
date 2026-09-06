import { spawnSync } from "node:child_process";
import path from "node:path";

// CreateProcess/CRT quoting; used only when constructing a native command line.
export function windowsArgument(value) {
  return `"${String(value).replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/, '$1$1')}"`;
}

export function commandInvocation(command, args = []) {
  if (process.platform !== "win32") return { executable: command, args };
  let resolved = command;
  if (!path.isAbsolute(command)) {
    const found = spawnSync("where.exe", [command], { encoding: "utf8", timeout: 5000, windowsHide: true });
    // npm also ships extensionless Unix launchers; Windows cannot execute those.
    resolved = (found.stdout || "").split(/\r?\n/).find((file) => /\.(exe|com|cmd|bat)$/i.test(file)) || command;
  }
  if (!/\.(cmd|bat)$/i.test(resolved)) return { executable: resolved, args };
  // Batch parameters are interpreted again by the batch file. Fail closed for
  // expansion/quote characters rather than changing their meaning or executing
  // shell syntax. Our inspection commands only need literal paths and flags.
  for (const value of [resolved, ...args]) {
    if (/["%\r\n\0]/.test(value)) throw new Error("Unsupported quote, percent, or control character in Windows batch argument");
  }
  const line = `"${[resolved, ...args].map(windowsArgument).join(" ")}"`;
  return {
    executable: process.env.ComSpec || "cmd.exe",
    args: ["/d", "/v:off", "/s", "/c", line], windowsVerbatimArguments: true,
  };
}

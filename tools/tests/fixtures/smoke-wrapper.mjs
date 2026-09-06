import { fileURLToPath } from "node:url";
import { smokeServer, parseOptions } from "../../appium/setup/scripts/smoke-appium-server.mjs";
const options = parseOptions(["--driver", "uiautomator2", "--port", "0", "--startup-timeout-ms", "10000"]);
const report = await smokeServer(options, { command: {
  executable: process.execPath,
  prefixArgs: [fileURLToPath(new URL("fake-appium.mjs", import.meta.url)), "not-ready"],
} });
process.stdout.write(JSON.stringify(report));
process.exitCode = report.summary.requiredOk ? 0 : 1;

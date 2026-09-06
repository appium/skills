import http from "node:http";
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const behavior = args[0];
const port = Number(args[args.indexOf("--port") + 1]);
if (behavior === "exit") process.exit(2);
if (behavior === "ignore-term") process.on("SIGTERM", () => {});
const worker = ["child", "orphan"].includes(behavior) ? spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" }) : null;
if (worker) {
  console.log(`worker-pid=${worker.pid}`);
  if (behavior === "orphan") setTimeout(() => process.exit(2), 100);
  process.on("SIGTERM", () => {
    worker.once("exit", () => process.exit(0));
    worker.kill();
  });
}
const server = http.createServer((req, res) => {
  res.setHeader("content-type", "application/json");
  if (behavior === "invalid-json") return res.end("not json");
  if (req.url === "/status") return res.end(JSON.stringify({ value: { ready: behavior !== "not-ready" } }));
  if (req.method === "POST" && req.url === "/session") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      const caps = JSON.parse(body).capabilities.alwaysMatch;
      console.log(`capabilities=${JSON.stringify(caps)}`);
      console.log(`autodownload=${caps["appium:autodownloadEnabled"]}`);
      if (behavior === "session-failure") { res.statusCode = 500; res.end('{"value":{"message":"session failed"}}'); }
      else res.end('{"value":{"sessionId":"fake-session"}}');
    });
    return;
  }
  if (req.method === "DELETE") {
    console.log("session-deleted");
    if (behavior === "delete-failure") res.statusCode = 500;
    return res.end('{"value":null}');
  }
  res.statusCode = 404;
  res.end("{}");
});
if (behavior !== "orphan") server.listen(port, "127.0.0.1", () => {
  console.log("[Appium] Available drivers:");
  console.log(`[Appium] - ${behavior === "wrong-driver" ? "safari" : "uiautomator2"}@1.2.3`);
  console.log("[Appium] - chromium@1.2.3");
  console.log("[Appium] - espresso@1.2.3");
  console.log("[Appium] - gecko@1.2.3");
  console.log(`[Appium] Appium REST http interface listener started on http://127.0.0.1:${port}`);
});

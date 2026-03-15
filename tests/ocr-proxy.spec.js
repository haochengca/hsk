"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { spawn } = require("node:child_process");
const path = require("node:path");
const os = require("node:os");

async function waitForServerReady(proc, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    let timer = null;
    const done = (err) => {
      if (timer) clearTimeout(timer);
      proc.stdout.off("data", onData);
      proc.stderr.off("data", onData);
      proc.off("exit", onExit);
      if (err) reject(err);
      else resolve();
    };
    const onData = (chunk) => {
      const text = String(chunk || "");
      if (text.includes("HSK server running on")) done();
    };
    const onExit = (code) => done(new Error(`server exited early with code ${code}`));
    timer = setTimeout(() => done(new Error("server start timeout")), timeoutMs);
    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
    proc.on("exit", onExit);
  });
}

async function stopProcess(proc) {
  if (!proc || proc.killed) return;
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);
    proc.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
    proc.kill("SIGTERM");
  });
}

async function api(baseUrl, pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const json = await response.json();
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${JSON.stringify(json)}`);
  return json;
}

function createMockOcrServer() {
  return http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const text = Buffer.concat(chunks).toString("utf8");
    const body = text ? JSON.parse(text) : {};

    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: true, service: "mock-ocr", ready: true }));
      return;
    }

    if (req.method === "POST" && req.url === "/ocr/recognize") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        ok: true,
        bestText: body.target || "你",
        bestScore: 0.97,
        bestVariant: "binary",
        results: [
          { variant: "binary", text: body.target || "你", score: 0.97 }
        ]
      }));
      return;
    }

    if (req.method === "POST" && req.url === "/ocr/judge") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        ok: true,
        target: body.target,
        recognizedText: body.target,
        finalResult: true,
        systemResult: true,
        accuracyPercent: 97,
        judgeDetail: {
          version: "paddleocr-v1",
          decision: "pass",
          decisionScore: 0.97,
          similarity: 1,
          variant: "binary",
          reason: "exact_match",
          ocrFirst: true
        }
      }));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: false, message: "not found" }));
  });
}

test("ocr api routes proxy requests to external paddle service", { timeout: 30000 }, async (t) => {
  const appPort = 39000 + Math.floor(Math.random() * 1000);
  const ocrPort = 40000 + Math.floor(Math.random() * 1000);
  const dbPath = path.join(os.tmpdir(), `hsk_test_${Date.now()}_${Math.random().toString(36).slice(2)}.sqlite`);
  const cwd = path.resolve(__dirname, "..");
  const mockOcr = createMockOcrServer();

  await new Promise((resolve) => mockOcr.listen(ocrPort, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise((resolve) => mockOcr.close(resolve));
  });

  const proc = spawn(process.execPath, ["server.js"], {
    cwd,
    env: {
      ...process.env,
      PORT: String(appPort),
      DB_PATH: dbPath,
      OCR_SERVICE_URL: `http://127.0.0.1:${ocrPort}`
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  t.after(async () => {
    await stopProcess(proc);
  });

  await waitForServerReady(proc);
  const baseUrl = `http://127.0.0.1:${appPort}`;
  const image = "data:image/png;base64,ZmFrZQ==";

  const health = await api(baseUrl, "/api/ocr/health");
  assert.equal(health.service, "mock-ocr");

  const recognize = await api(baseUrl, "/api/ocr/recognize", {
    method: "POST",
    body: {
      image,
      target: "你好"
    }
  });
  assert.equal(recognize.bestText, "你好");
  assert.equal(recognize.results[0].variant, "binary");

  const judge = await api(baseUrl, "/api/ocr/judge", {
    method: "POST",
    body: {
      image,
      target: "你",
      type: "char"
    }
  });
  assert.equal(judge.finalResult, true);
  assert.equal(judge.judgeDetail.reason, "exact_match");
});

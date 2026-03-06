"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
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
    const onExit = (code) => {
      done(new Error(`server exited early with code ${code}`));
    };
    timer = setTimeout(() => done(new Error("server start timeout")), timeoutMs);
    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
    proc.on("exit", onExit);
  });
}

async function stopServer(proc) {
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
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

test("submissions keep backward compatibility with optional judgeDetail", { timeout: 30000 }, async (t) => {
  const port = 35000 + Math.floor(Math.random() * 5000);
  const dbPath = path.join(os.tmpdir(), `hsk_test_${Date.now()}_${Math.random().toString(36).slice(2)}.sqlite`);
  const cwd = path.resolve(__dirname, "..");
  const proc = spawn(process.execPath, ["server.js"], {
    cwd,
    env: {
      ...process.env,
      PORT: String(port),
      DB_PATH: dbPath,
      RECOGNITION_V2_ENABLED: "1"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  t.after(async () => {
    await stopServer(proc);
  });

  await waitForServerReady(proc);
  const baseUrl = `http://127.0.0.1:${port}`;

  await api(baseUrl, "/api/register", {
    method: "POST",
    body: {
      username: "parent123",
      password: "abcdef",
      role: "parent"
    }
  });

  const login = await api(baseUrl, "/api/login", {
    method: "POST",
    body: {
      username: "parent123",
      password: "abcdef"
    }
  });
  const token = login.token;

  await api(baseUrl, "/api/submissions", {
    method: "POST",
    token,
    body: {
      type: "char",
      target: "你",
      pinyin: "ni",
      userAnswer: "",
      handwritingImage: "data:image/png;base64,abc",
      accuracyPercent: 77,
      systemResult: true,
      finalResult: true,
      pointsAwarded: 1
    }
  });

  await api(baseUrl, "/api/submissions", {
    method: "POST",
    token,
    body: {
      type: "word",
      target: "你好",
      pinyin: "ni hao",
      userAnswer: "",
      handwritingImage: "img1||img2",
      accuracyPercent: 82,
      systemResult: true,
      finalResult: true,
      pointsAwarded: 1,
      judgeDetail: {
        version: "v2",
        decision: "pass",
        decisionScore: 0.82,
        baseScore: 0.8,
        mlScore: 0.86,
        blendedScore: 0.82,
        tier: "medium",
        thresholds: { pass: 0.61, retryLow: 0.56 },
        engines: { overlap: 0.8, projection: 0.79, grid: 0.77 },
        retryAttempt: 1,
        reason: "pass_threshold"
      },
      wordCharResults: [
        {
          char: "你",
          isGood: true,
          accuracyPercent: 86,
          handwritingImage: "img1",
          judgeDetail: {
            version: "v2",
            decision: "pass",
            decisionScore: 0.86,
            baseScore: 0.84,
            mlScore: 0.88,
            blendedScore: 0.86,
            tier: "medium",
            thresholds: { pass: 0.61, retryLow: 0.56 },
            engines: { overlap: 0.85, projection: 0.83, grid: 0.8 },
            retryAttempt: 0,
            reason: "pass_threshold"
          }
        },
        {
          char: "好",
          isGood: true,
          accuracyPercent: 78,
          handwritingImage: "img2"
        }
      ]
    }
  });

  const boot = await api(baseUrl, "/api/bootstrap", { token });
  assert.equal(boot.flags.recognitionV2Enabled, true);

  const rows = Array.isArray(boot.submissions) ? boot.submissions : [];
  const legacy = rows.find((x) => x && x.target === "你");
  const v2 = rows.find((x) => x && x.target === "你好");

  assert.ok(legacy);
  assert.equal(legacy.judgeDetail, null);

  assert.ok(v2);
  assert.equal(v2.judgeDetail.decision, "pass");
  assert.equal(v2.wordCharResults[0].judgeDetail.decision, "pass");
});

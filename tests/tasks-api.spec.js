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
    const onExit = (code) => done(new Error(`server exited early with code ${code}`));
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

test("task APIs support create, pause, resume, and complete flow", { timeout: 30000 }, async (t) => {
  const port = 36000 + Math.floor(Math.random() * 4000);
  const dbPath = path.join(os.tmpdir(), `hsk_task_test_${Date.now()}_${Math.random().toString(36).slice(2)}.sqlite`);
  const cwd = path.resolve(__dirname, "..");
  const proc = spawn(process.execPath, ["server.js"], {
    cwd,
    env: {
      ...process.env,
      PORT: String(port),
      DB_PATH: dbPath
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
      username: "childtask",
      password: "abcdef",
      role: "child",
      linkedParentUsername: "parenttask"
    }
  }).catch(() => null);

  await api(baseUrl, "/api/register", {
    method: "POST",
    body: {
      username: "parenttask",
      password: "abcdef",
      role: "parent"
    }
  });

  await api(baseUrl, "/api/register", {
    method: "POST",
    body: {
      username: "childtask",
      password: "abcdef",
      role: "child",
      linkedParentUsername: "parenttask"
    }
  });

  const login = await api(baseUrl, "/api/login", {
    method: "POST",
    body: {
      username: "childtask",
      password: "abcdef"
    }
  });
  const token = login.token;

  const created = await api(baseUrl, "/api/tasks", {
    method: "POST",
    token,
    body: {
      templateType: "HSK_LEVEL_CHARS",
      selectedLevels: [1, 2],
      practiceCount: 6
    }
  });

  assert.equal(created.task.selectedLevels.join(","), "1,2");
  assert.equal(created.task.items.length, 6);
  const taskId = created.task.id;

  const started = await api(baseUrl, `/api/tasks/${taskId}/start`, {
    method: "POST",
    token
  });
  assert.equal(started.task.status, "in_progress");
  assert.ok(started.task.progress.sessionId);

  const firstItems = started.task.items.slice(0, 3).map((item, index) => ({
    seq: item.seq,
    itemId: item.itemId,
    text: item.text,
    isCorrect: index !== 1,
    accuracyPercent: index !== 1 ? 95 : 43
  }));

  const paused = await api(baseUrl, `/api/tasks/${taskId}/progress`, {
    method: "POST",
    token,
    body: {
      status: "paused",
      sessionId: started.task.progress.sessionId,
      checkpointId: "cp_pause_1",
      currentIndex: 3,
      completedItems: firstItems
    }
  });

  assert.equal(paused.task.status, "paused");
  assert.equal(paused.task.progress.currentIndex, 3);
  assert.equal(paused.task.summary.correctCount, 2);
  assert.equal(paused.task.summary.wrongCount, 1);

  const resumed = await api(baseUrl, `/api/tasks/${taskId}/resume`, {
    method: "POST",
    token
  });
  assert.equal(resumed.task.status, "in_progress");
  assert.equal(resumed.currentIndex, 3);

  const completedItems = [
    ...paused.task.progress.completedItems,
    ...resumed.task.items.slice(3).map((item) => ({
      seq: item.seq,
      itemId: item.itemId,
      text: item.text,
      isCorrect: true,
      accuracyPercent: 98
    }))
  ];

  const completed = await api(baseUrl, `/api/tasks/${taskId}/complete`, {
    method: "POST",
    token,
    body: {
      sessionId: resumed.task.progress.sessionId,
      checkpointId: "cp_complete_1",
      currentIndex: resumed.task.items.length,
      completedItems
    }
  });

  assert.equal(completed.task.status, "completed");
  assert.equal(completed.summary.totalCount, 6);
  assert.equal(completed.summary.completedCount, 6);
  assert.equal(completed.summary.correctCount, 5);
  assert.equal(completed.summary.accuracyPercent, 83);

  const listed = await api(baseUrl, "/api/tasks", { token });
  assert.equal(Array.isArray(listed.tasks), true);
  assert.equal(listed.tasks.some((task) => task.id === taskId && task.status === "completed"), true);
});

test("task APIs reject creating a new task while another task is unfinished", { timeout: 30000 }, async (t) => {
  const port = 39000 + Math.floor(Math.random() * 1000);
  const dbPath = path.join(os.tmpdir(), `hsk_task_guard_${Date.now()}_${Math.random().toString(36).slice(2)}.sqlite`);
  const cwd = path.resolve(__dirname, "..");
  const proc = spawn(process.execPath, ["server.js"], {
    cwd,
    env: {
      ...process.env,
      PORT: String(port),
      DB_PATH: dbPath
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
    body: { username: "parentone", password: "abcdef", role: "parent" }
  });
  await api(baseUrl, "/api/register", {
    method: "POST",
    body: { username: "childone", password: "abcdef", role: "child", linkedParentUsername: "parentone" }
  });
  const login = await api(baseUrl, "/api/login", {
    method: "POST",
    body: { username: "childone", password: "abcdef" }
  });

  await api(baseUrl, "/api/tasks", {
    method: "POST",
    token: login.token,
    body: {
      templateType: "HSK_LEVEL_CHARS",
      selectedLevels: [1],
      practiceCount: 5
    }
  });

  await assert.rejects(
    api(baseUrl, "/api/tasks", {
      method: "POST",
      token: login.token,
      body: {
        templateType: "HSK_LEVEL_CHARS",
        selectedLevels: [2],
        practiceCount: 5
      }
    }),
    /409/
  );
});

test("parent can view linked child tasks and stop the current task", { timeout: 30000 }, async (t) => {
  const port = 40000 + Math.floor(Math.random() * 1000);
  const dbPath = path.join(os.tmpdir(), `hsk_parent_task_${Date.now()}_${Math.random().toString(36).slice(2)}.sqlite`);
  const cwd = path.resolve(__dirname, "..");
  const proc = spawn(process.execPath, ["server.js"], {
    cwd,
    env: {
      ...process.env,
      PORT: String(port),
      DB_PATH: dbPath
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
    body: { username: "parentview", password: "abcdef", role: "parent" }
  });
  await api(baseUrl, "/api/register", {
    method: "POST",
    body: { username: "childview", password: "abcdef", role: "child", linkedParentUsername: "parentview" }
  });

  const parentLogin = await api(baseUrl, "/api/login", {
    method: "POST",
    body: { username: "parentview", password: "abcdef" }
  });

  const created = await api(baseUrl, "/api/tasks", {
    method: "POST",
    token: parentLogin.token,
    body: {
      templateType: "HSK_LEVEL_CHARS",
      selectedLevels: [1],
      practiceCount: 5,
      assigneeId: "childview"
    }
  });

  const listed = await api(baseUrl, "/api/tasks", {
    token: parentLogin.token
  });
  assert.equal(listed.tasks.some((task) => task.id === created.task.id && task.assigneeId === "childview"), true);

  const stopped = await api(baseUrl, `/api/tasks/${created.task.id}/stop`, {
    method: "POST",
    token: parentLogin.token
  });
  assert.equal(stopped.task.status, "archived");
});

test("child cannot stop task", { timeout: 30000 }, async (t) => {
  const port = 41050 + Math.floor(Math.random() * 500);
  const dbPath = path.join(os.tmpdir(), `hsk_child_stop_${Date.now()}_${Math.random().toString(36).slice(2)}.sqlite`);
  const cwd = path.resolve(__dirname, "..");
  const proc = spawn(process.execPath, ["server.js"], {
    cwd,
    env: {
      ...process.env,
      PORT: String(port),
      DB_PATH: dbPath
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
    body: { username: "parentstop", password: "abcdef", role: "parent" }
  });
  await api(baseUrl, "/api/register", {
    method: "POST",
    body: { username: "childstop", password: "abcdef", role: "child", linkedParentUsername: "parentstop" }
  });

  const childLogin = await api(baseUrl, "/api/login", {
    method: "POST",
    body: { username: "childstop", password: "abcdef" }
  });

  const created = await api(baseUrl, "/api/tasks", {
    method: "POST",
    token: childLogin.token,
    body: {
      templateType: "HSK_LEVEL_CHARS",
      selectedLevels: [1],
      practiceCount: 5
    }
  });

  await assert.rejects(
    api(baseUrl, `/api/tasks/${created.task.id}/stop`, {
      method: "POST",
      token: childLogin.token
    }),
    /403/
  );
});

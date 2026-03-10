const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { test, expect } = require("@playwright/test");

const HOST = "127.0.0.1";
const PORT = 4173;
const BASE_URL = `http://${HOST}:${PORT}`;

let serverProcess;
let tempDir;

async function waitForServer(url, timeoutMs = 15000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`server did not start within ${timeoutMs}ms`);
}

async function createUser(payload) {
  const response = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  if (!response.ok || body.ok === false) {
    throw new Error(body.message || `register failed: ${response.status}`);
  }
}

test.beforeAll(async () => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "hsk-e2e-"));
  serverProcess = spawn("node", ["server.js"], {
    cwd: path.resolve(__dirname, "..", ".."),
    env: {
      ...process.env,
      HOST,
      PORT: String(PORT),
      DB_PATH: path.join(tempDir, "server.sqlite")
    },
    stdio: "inherit"
  });
  await waitForServer(`${BASE_URL}/`);
});

test.afterAll(async () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill("SIGTERM");
  }
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("loads lexicon via json and completes admin login flow", async ({ page }) => {
  const appJs = await fetch(`${BASE_URL}/app.js`).then((response) => response.text());
  expect(appJs.length).toBeLessThan(300000);

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await expect(page.locator("#auth-screen")).toBeVisible();

  const loadedResources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => {
      try {
        return new URL(entry.name).pathname;
      } catch {
        return entry.name;
      }
    })
  );
  expect(loadedResources).toContain("/data/hsk_chars_1_6.json");
  expect(loadedResources).toContain("/data/hsk_words_1_6.json");
  expect(loadedResources).not.toContain("/data/hsk_chars_1_6.js");
  expect(loadedResources).not.toContain("/data/hsk_words_1_6.js");

  await page.fill("#auth-username", "admin");
  await page.fill("#auth-password", "admin123");
  await page.click("#auth-login");

  await expect(page.locator("#app-shell")).toBeVisible();
  await expect(page.locator("#user-badge")).toContainText("admin");
  await expect(page.locator("#learn-list-summary")).toContainText("共");
  await expect(page.locator("#learn-char-list tr")).toHaveCount(50);
  await expect(page.locator('.tab[data-tab="learn"]')).toHaveClass(/hidden/);
  await expect(page.locator("#admin-tab")).toHaveClass(/hidden/);
  await expect(page.locator("#admin-users-tab")).not.toHaveClass(/hidden/);
  await expect(page.locator("#admin-users-panel")).toHaveClass(/is-active/);
});

test("child user can navigate learn, write and review flows", async ({ page }) => {
  const parentUsername = `parent_${Date.now()}`;
  const childUsername = `child_${Date.now()}`;
  const password = "study123";

  await createUser({ username: parentUsername, password, role: "parent", linkedParentUsername: "" });
  await createUser({ username: childUsername, password, role: "child", linkedParentUsername: parentUsername });

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.fill("#auth-username", childUsername);
  await page.fill("#auth-password", password);
  await page.click("#auth-login");

  await expect(page.locator("#app-shell")).toBeVisible();
  await expect(page.locator("#user-badge")).toContainText(childUsername);
  await expect(page.locator('.tab[data-tab="learn"]')).not.toHaveClass(/hidden/);
  await expect(page.locator('.tab[data-tab="write"]')).not.toHaveClass(/hidden/);
  await expect(page.locator('.tab[data-tab="review"]')).not.toHaveClass(/hidden/);
  await expect(page.locator("#learn-panel")).toHaveClass(/is-active/);

  await page.locator('#learn-char-list input[data-action="select-item"]').first().check();
  await expect(page.locator("#learn-list-summary")).toContainText("已选 1");

  await page.click('.tab[data-tab="write"]');
  await expect(page.locator("#write-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#target-char")).not.toHaveText("");

  await page.click('.tab[data-tab="learn"]');
  await expect(page.locator("#learn-panel")).toHaveClass(/is-active/);
  await page.click("#learn-dictate-selected");
  await expect(page.locator("#review-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#review-card")).toBeVisible();
  await expect(page.locator("#review-start")).toBeVisible();
});

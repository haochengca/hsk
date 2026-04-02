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

async function loginUser(username, password) {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const body = await response.json();
  if (!response.ok || body.ok === false || !body.token) {
    throw new Error(body.message || `login failed: ${response.status}`);
  }
  return body;
}

async function saveUserData(token, payload) {
  const response = await fetch(`${BASE_URL}/api/user-data`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  if (!response.ok || body.ok === false) {
    throw new Error(body.message || `save user-data failed: ${response.status}`);
  }
}

async function drawScribble(page, selector) {
  const canvas = page.locator(selector).first();
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  if (!box) throw new Error(`canvas not visible for ${selector}`);
  const startX = box.x + box.width * 0.25;
  const startY = box.y + box.height * 0.25;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.28, { steps: 12 });
  await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.55, { steps: 12 });
  await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * 0.78, { steps: 12 });
  await page.mouse.move(box.x + box.width * 0.28, box.y + box.height * 0.82, { steps: 12 });
  await page.mouse.up();
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

  const selectedText = await page.locator("#learn-char-list tr td:nth-child(2)").first().textContent();
  const submissionResponses = [];
  page.on("response", (response) => {
    if (response.url().includes("/api/submissions") && response.request().method() === "POST") {
      submissionResponses.push(response);
    }
  });

  for (let attempt = 0; attempt < 3 && submissionResponses.length === 0; attempt += 1) {
    await drawScribble(page, "#dictation-writer canvas");
    await page.click("#review-start");
    await page.waitForTimeout(300);
    const summaryVisible = await page.locator("#review-summary-card").isVisible();
    if (!summaryVisible) {
      expect(submissionResponses.length).toBe(0);
    }
    await page.waitForTimeout(900);
    const feedback = await page.locator("#review-feedback").textContent();
    if (submissionResponses.length > 0) break;
    if (String(feedback || "").includes("请先写完字")) continue;
    if (!String(feedback || "").includes("接近正确")) break;
  }

  await expect(page.locator("#review-summary-card")).toBeVisible();
  await expect.poll(() => submissionResponses.length).toBeGreaterThan(0);
  expect(submissionResponses[0].ok()).toBeTruthy();

  await page.click("#records-tab");
  await expect(page.locator("#records-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#records-count")).toContainText(`${childUsername} 的判定记录：1 条（近7天）`);
  await expect(page.locator("#records-list")).toContainText(String(selectedText || "").trim());

  await page.click("#user-menu-toggle");
  await page.click("#logout-btn");
  await expect(page.locator("#auth-screen")).toBeVisible();

  await page.fill("#auth-username", parentUsername);
  await page.fill("#auth-password", password);
  await page.click("#auth-login");

  await expect(page.locator("#records-tab")).not.toHaveClass(/hidden/);
  await page.click("#records-tab");
  await expect(page.locator("#records-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#records-target-select")).toHaveValue(childUsername);
  await expect(page.locator("#records-report")).toContainText("报告对象");
  await expect(page.locator("#records-report")).toContainText("HSK 各级掌握度");
  await expect(page.locator("#records-count")).toContainText(`${childUsername} 的判定记录：1 条（近7天）`);
});

test("wrong-book single practice is saved into records and parent review audit", async ({ page }) => {
  const parentUsername = `parent_${Date.now()}`;
  const childUsername = `child_${Date.now()}`;
  const password = "study123";

  await createUser({ username: parentUsername, password, role: "parent", linkedParentUsername: "" });
  await createUser({ username: childUsername, password, role: "child", linkedParentUsername: parentUsername });

  const login = await loginUser(childUsername, password);
  const firstChar = await fetch(`${BASE_URL}/data/hsk_chars_1_6.json`).then((response) => response.json()).then((rows) => rows[0]);
  const charText = String(firstChar && (firstChar.text || firstChar.char) || "");
  await saveUserData(login.token, {
    wrongBook: [{ key: `char:${charText}` }],
    reviewPrefs: {
      reviewType: "char",
      reviewCount: "1",
      reviewPreviewMode: "0"
    }
  });

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.fill("#auth-username", childUsername);
  await page.fill("#auth-password", password);
  await page.click("#auth-login");

  await expect(page.locator("#app-shell")).toBeVisible();
  await page.click('.tab[data-tab="wrong"]');
  await expect(page.locator("#wrong-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#wrong-list")).toContainText(charText);

  const submissionResponses = [];
  page.on("response", (response) => {
    if (response.url().includes("/api/submissions") && response.request().method() === "POST") {
      submissionResponses.push(response);
    }
  });

  await page.locator(`#wrong-list button[data-key="char:${charText}"]`).click();
  await expect(page.locator("#review-panel")).toHaveClass(/is-active/);
  await page.waitForTimeout(300);

  for (let attempt = 0; attempt < 3 && submissionResponses.length === 0; attempt += 1) {
    await drawScribble(page, "#dictation-writer canvas");
    await page.waitForTimeout(150);
    await page.click("#review-start");
    await page.waitForTimeout(1200);
    if (submissionResponses.length > 0) break;
    const feedback = await page.locator("#review-feedback").textContent();
    if (String(feedback || "").includes("请先写完字")) continue;
    if (!String(feedback || "").includes("接近正确")) break;
  }

  expect(submissionResponses.length).toBeGreaterThan(0);
  expect(submissionResponses[0].ok()).toBeTruthy();
  await expect(page.locator("#review-summary-card")).toBeVisible();

  await page.click("#records-tab");
  await expect(page.locator("#records-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#records-count")).toContainText(`${childUsername} 的判定记录：1 条（近7天）`);
  await expect(page.locator("#records-list")).toContainText(charText);

  await page.click("#user-menu-toggle");
  await page.click("#logout-btn");
  await expect(page.locator("#auth-screen")).toBeVisible();

  await page.fill("#auth-username", parentUsername);
  await page.fill("#auth-password", password);
  await page.click("#auth-login");

  await expect(page.locator("#admin-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#admin-count")).toContainText("记录：");
  await expect(page.locator("#admin-list")).toContainText(childUsername);
  await expect(page.locator("#admin-list")).toContainText(charText);
});

test("child review session recovers after page reload", async ({ page }) => {
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
  await page.click('.tab[data-tab="review"]');
  await expect(page.locator("#review-panel")).toHaveClass(/is-active/);
  await page.click("#review-begin");
  await page.waitForTimeout(900);

  await expect.poll(async () => {
    return page.evaluate(() => Boolean(localStorage.getItem("hsk_review_recovery_v1")));
  }).toBeTruthy();

  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("#review-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#review-restore-banner")).toContainText("已恢复上次未完成的默写");
  await expect(page.locator("#review-card")).toBeVisible();
  await expect(page.locator("#review-start")).toBeVisible();
});

test("child can continue reviewed item after page reload", async ({ page }) => {
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
  await page.locator('#learn-char-list input[data-action="select-item"]').nth(0).check();
  await page.locator('#learn-char-list input[data-action="select-item"]').nth(1).check();
  await page.click("#learn-dictate-selected");
  await expect(page.locator("#review-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#review-start")).toBeVisible();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await drawScribble(page, "#dictation-writer canvas");
    await page.click("#review-start");
    await page.waitForTimeout(1200);
    const nextVisible = await page.locator("#review-next").isVisible();
    if (nextVisible) break;
    const feedback = await page.locator("#review-feedback").textContent();
    if (!String(feedback || "").includes("接近正确")) break;
  }

  await expect(page.locator("#review-next")).toBeVisible();
  await expect(page.locator("#review-next")).toBeEnabled();

  await page.reload({ waitUntil: "networkidle" });

  await expect(page.locator("#review-panel")).toHaveClass(/is-active/);
  await expect(page.locator("#review-restore-banner")).toContainText("已恢复上次未完成的默写");
  await expect(page.locator("#review-next")).toBeVisible();
  await expect(page.locator("#review-next")).toBeEnabled();
  await expect(page.locator("#review-start")).toBeDisabled();
  await expect(page.locator("#review-reset")).toBeDisabled();

  await page.click("#review-next");
  await expect(page.locator("#review-start")).toBeEnabled();
  await expect(page.locator("#review-reset")).toBeEnabled();
});

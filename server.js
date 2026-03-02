const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8787);
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, "data", "server_db.json");
const SESSION_EXPIRE_MS = 30 * 24 * 60 * 60 * 1000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function now() {
  return Date.now();
}

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, packed) {
  if (!packed || !packed.includes(":")) return false;
  const [salt, saved] = packed.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(saved, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

function getWeekKey(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay() || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day + 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function defaultRewards() {
  return {
    totalPoints: 0,
    weeklyPoints: 0,
    weeklyCorrect: 0,
    currentWeekKey: getWeekKey(),
    lastUpdatedAt: now()
  };
}

function defaultReviewPrefs() {
  return {
    reviewType: "char",
    reviewLevel: "all",
    reviewCount: "10",
    reviewWrongMixRatio: "30"
  };
}

function defaultUserData() {
  return {
    progress: {},
    wrongBook: [],
    rewards: defaultRewards(),
    reviewPrefs: defaultReviewPrefs()
  };
}

function ensureDbFile() {
  if (!fs.existsSync(path.dirname(DB_PATH))) fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (fs.existsSync(DB_PATH)) return;
  const db = {
    users: [
      {
        username: "admin",
        passwordHash: createPasswordHash("admin123"),
        role: "admin",
        createdAt: now()
      }
    ],
    userData: {},
    submissions: [],
    sessions: []
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function loadDb() {
  ensureDbFile();
  try {
    const parsed = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    parsed.users = Array.isArray(parsed.users) ? parsed.users : [];
    parsed.userData = parsed.userData && typeof parsed.userData === "object" ? parsed.userData : {};
    parsed.submissions = Array.isArray(parsed.submissions) ? parsed.submissions : [];
    parsed.sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
    return parsed;
  } catch {
    return { users: [], userData: {}, submissions: [], sessions: [] };
  }
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function ensureUserData(db, username) {
  if (!db.userData[username]) db.userData[username] = defaultUserData();
  const data = db.userData[username];
  if (!data.progress || typeof data.progress !== "object") data.progress = {};
  if (!Array.isArray(data.wrongBook)) data.wrongBook = [];
  if (!data.rewards || typeof data.rewards !== "object") data.rewards = defaultRewards();
  if (!data.reviewPrefs || typeof data.reviewPrefs !== "object") data.reviewPrefs = defaultReviewPrefs();
  return data;
}

function normalizeUserData(input) {
  const data = defaultUserData();
  if (input && typeof input === "object") {
    if (input.progress && typeof input.progress === "object") data.progress = input.progress;
    if (Array.isArray(input.wrongBook)) data.wrongBook = input.wrongBook;
    if (input.rewards && typeof input.rewards === "object") data.rewards = { ...data.rewards, ...input.rewards };
    if (input.reviewPrefs && typeof input.reviewPrefs === "object") {
      data.reviewPrefs = { ...data.reviewPrefs, ...input.reviewPrefs };
    }
  }
  return data;
}

function cleanExpiredSessions(db) {
  const t = now();
  db.sessions = db.sessions.filter((x) => x && x.expiresAt > t);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (chunks.length === 0) return resolve({});
      const text = Buffer.concat(chunks).toString("utf8");
      try {
        resolve(JSON.parse(text || "{}"));
      } catch {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS"
  });
  res.end(body);
}

function getAuthContext(req, db) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;
  cleanExpiredSessions(db);
  const session = db.sessions.find((x) => x.token === token);
  if (!session) return null;
  return { token, username: session.username, role: session.role };
}

function newToken() {
  return crypto.randomBytes(24).toString("hex");
}

function validUsername(username) {
  return typeof username === "string" && /^[A-Za-z0-9_]{3,32}$/.test(username);
}

function validPassword(password) {
  return typeof password === "string" && password.length >= 6 && password.length <= 64;
}

function ensureWeeklyRewards(rewards) {
  const key = getWeekKey();
  if (rewards.currentWeekKey === key) return;
  rewards.currentWeekKey = key;
  rewards.weeklyPoints = 0;
  rewards.weeklyCorrect = 0;
  rewards.lastUpdatedAt = now();
}

function normalizeAccuracyPercent(value) {
  if (typeof value === "string") {
    const cleaned = value.replace("%", "").trim();
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) value = parsed;
  }
  if (!Number.isFinite(value)) return 0;
  let num = Number(value);
  if (num >= 0 && num <= 1) num *= 100;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function addPointsForUser(db, username, pointsDelta, correctDelta) {
  const data = ensureUserData(db, username);
  const rewards = data.rewards;
  ensureWeeklyRewards(rewards);
  rewards.totalPoints = Math.max(0, Number(rewards.totalPoints || 0) + pointsDelta);
  rewards.weeklyPoints = Math.max(0, Number(rewards.weeklyPoints || 0) + pointsDelta);
  rewards.weeklyCorrect = Math.max(0, Number(rewards.weeklyCorrect || 0) + correctDelta);
  rewards.lastUpdatedAt = now();
}

function updateWrongBookForUser(db, username, submission, isCorrect) {
  const data = ensureUserData(db, username);
  const upsertWrong = (type, text) => {
    const key = `${type}:${text}`;
    const idx = data.wrongBook.findIndex((x) => x && x.key === key);
    if (idx === -1) data.wrongBook.push({ key, type, text });
  };
  const removeWrong = (type, text) => {
    const key = `${type}:${text}`;
    const idx = data.wrongBook.findIndex((x) => x && x.key === key);
    if (idx !== -1) data.wrongBook.splice(idx, 1);
  };

  if (submission.type === "word") {
    if (isCorrect) removeWrong("word", submission.target);
    else upsertWrong("word", submission.target);

    if (Array.isArray(submission.wordCharResults) && submission.wordCharResults.length > 0) {
      submission.wordCharResults.forEach((x) => {
        const ch = String((x && x.char) || "");
        if (!ch) return;
        if (Boolean(x.isGood)) removeWrong("char", ch);
        else upsertWrong("char", ch);
      });
    }
    return;
  }

  if (isCorrect) removeWrong(submission.type, submission.target);
  else upsertWrong(submission.type, submission.target);
}

async function handleApi(req, res, pathname) {
  const db = loadDb();

  if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });

  if (req.method === "GET" && pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, now: now() });
  }

  if (req.method === "POST" && pathname === "/api/register") {
    const body = await parseBody(req);
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    if (!validUsername(username)) {
      return sendJson(res, 400, { ok: false, message: "用户名需为3-32位字母/数字/下划线" });
    }
    if (!validPassword(password)) {
      return sendJson(res, 400, { ok: false, message: "密码长度需为6-64位" });
    }
    if (db.users.some((x) => x.username === username)) {
      return sendJson(res, 409, { ok: false, message: "用户名已存在" });
    }
    db.users.push({
      username,
      passwordHash: createPasswordHash(password),
      role: "user",
      createdAt: now()
    });
    ensureUserData(db, username);
    saveDb(db);
    return sendJson(res, 201, { ok: true, message: "注册成功，请登录" });
  }

  if (req.method === "POST" && pathname === "/api/login") {
    const body = await parseBody(req);
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const user = db.users.find((x) => x.username === username);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return sendJson(res, 401, { ok: false, message: "用户名或密码错误" });
    }
    const token = newToken();
    cleanExpiredSessions(db);
    db.sessions.push({
      token,
      username: user.username,
      role: user.role,
      createdAt: now(),
      expiresAt: now() + SESSION_EXPIRE_MS
    });
    saveDb(db);
    return sendJson(res, 200, { ok: true, token, user: { username: user.username, role: user.role } });
  }

  const auth = getAuthContext(req, db);
  if (!auth) return sendJson(res, 401, { ok: false, message: "未登录或会话已过期" });

  if (req.method === "POST" && pathname === "/api/logout") {
    db.sessions = db.sessions.filter((x) => x.token !== auth.token);
    saveDb(db);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && pathname === "/api/bootstrap") {
    const data = ensureUserData(db, auth.username);
    const submissions =
      auth.role === "admin"
        ? db.submissions.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        : db.submissions.filter((x) => x.username === auth.username).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return sendJson(res, 200, {
      ok: true,
      user: { username: auth.username, role: auth.role },
      data,
      submissions
    });
  }

  if (req.method === "PUT" && pathname === "/api/user-data") {
    const body = await parseBody(req);
    db.userData[auth.username] = normalizeUserData(body);
    saveDb(db);
    return sendJson(res, 200, { ok: true, savedAt: now() });
  }

  if (req.method === "POST" && pathname === "/api/submissions") {
    if (auth.role !== "user") return sendJson(res, 403, { ok: false, message: "仅普通用户可提交默写记录" });
    const body = await parseBody(req);
    const wordCharResults = Array.isArray(body.wordCharResults)
      ? body.wordCharResults.map((x) => ({
          char: String((x && x.char) || ""),
          isGood: Boolean(x && x.isGood),
          accuracyPercent: normalizeAccuracyPercent(x && x.accuracyPercent),
          handwritingImage: String((x && x.handwritingImage) || "")
        }))
      : [];
    const row = {
      id: `${now()}_${crypto.randomBytes(4).toString("hex")}`,
      username: auth.username,
      type: body.type === "word" ? "word" : "char",
      target: String(body.target || ""),
      pinyin: String(body.pinyin || ""),
      userAnswer: String(body.userAnswer || ""),
      handwritingImage: String(body.handwritingImage || ""),
      accuracyPercent: normalizeAccuracyPercent(body.accuracyPercent),
      systemResult: Boolean(body.systemResult),
      finalResult: Boolean(body.finalResult),
      pointsAwarded: Number(body.pointsAwarded) || 0,
      wordCharResults,
      reviewedBy: String(body.reviewedBy || ""),
      reviewedAt: Number(body.reviewedAt) || 0,
      createdAt: Number(body.createdAt) || now()
    };
    db.submissions.push(row);
    saveDb(db);
    return sendJson(res, 201, { ok: true, submission: row });
  }

  if (req.method === "PUT" && pathname.startsWith("/api/submissions/") && pathname.endsWith("/review")) {
    if (auth.role !== "admin") return sendJson(res, 403, { ok: false, message: "仅管理员可复判" });
    const id = pathname.split("/")[3];
    const body = await parseBody(req);
    const submission = db.submissions.find((x) => x.id === id);
    if (!submission) return sendJson(res, 404, { ok: false, message: "记录不存在" });
    const before = Boolean(submission.finalResult);
    const reviewedWordCharResults = Array.isArray(body.wordCharResults)
      ? body.wordCharResults.map((x) => ({
          char: String((x && x.char) || ""),
          isGood: Boolean(x && x.isGood),
          accuracyPercent: normalizeAccuracyPercent(x && x.accuracyPercent),
          handwritingImage: String((x && x.handwritingImage) || "")
        }))
      : null;
    if (submission.type === "word" && reviewedWordCharResults) submission.wordCharResults = reviewedWordCharResults;
    const after =
      submission.type === "word" && Array.isArray(submission.wordCharResults) && submission.wordCharResults.length > 0
        ? submission.wordCharResults.every((x) => x && x.isGood)
        : Boolean(body.finalResult);
    submission.finalResult = after;
    submission.reviewedBy = auth.username;
    submission.reviewedAt = now();
    // 词汇逐字复判时，即使整词结果不变，也要刷新错题本中的逐字状态。
    if (submission.type === "word" && reviewedWordCharResults) {
      updateWrongBookForUser(db, submission.username, submission, after);
    }
    if (before !== after) {
      const points = Number(submission.pointsAwarded || 0);
      addPointsForUser(db, submission.username, after ? points : -points, after ? 1 : -1);
      if (!(submission.type === "word" && reviewedWordCharResults)) {
        updateWrongBookForUser(db, submission.username, submission, after);
      }
    }
    saveDb(db);
    return sendJson(res, 200, { ok: true, submission });
  }

  if (req.method === "GET" && pathname.startsWith("/api/admin/users/") && pathname.endsWith("/wrong-book")) {
    if (auth.role !== "admin") return sendJson(res, 403, { ok: false, message: "仅管理员可查看" });
    const parts = pathname.split("/");
    const username = decodeURIComponent(parts[4] || "").trim();
    if (!username) return sendJson(res, 400, { ok: false, message: "用户名不能为空" });
    const user = db.users.find((x) => x && x.username === username);
    if (!user) return sendJson(res, 404, { ok: false, message: "用户不存在" });
    if (user.role !== "user") return sendJson(res, 400, { ok: false, message: "仅可查看普通用户错题本" });
    const data = ensureUserData(db, username);
    return sendJson(res, 200, { ok: true, wrongBook: Array.isArray(data.wrongBook) ? data.wrongBook : [] });
  }

  if (req.method === "PUT" && pathname.startsWith("/api/admin/users/") && pathname.endsWith("/wrong-book")) {
    if (auth.role !== "admin") return sendJson(res, 403, { ok: false, message: "仅管理员可操作" });
    const parts = pathname.split("/");
    const username = decodeURIComponent(parts[4] || "").trim();
    if (!username) return sendJson(res, 400, { ok: false, message: "用户名不能为空" });
    const user = db.users.find((x) => x && x.username === username);
    if (!user) return sendJson(res, 404, { ok: false, message: "用户不存在" });
    if (user.role !== "user") return sendJson(res, 400, { ok: false, message: "仅可操作普通用户错题本" });

    const body = await parseBody(req);
    const action = String(body.action || "").trim();
    const type = body.type === "word" ? "word" : "char";
    const text = String(body.text || "").trim();
    if (!["add", "remove"].includes(action)) {
      return sendJson(res, 400, { ok: false, message: "action 必须为 add 或 remove" });
    }
    if (!text) return sendJson(res, 400, { ok: false, message: "错题内容不能为空" });

    const data = ensureUserData(db, username);
    const key = `${type}:${text}`;
    const idx = data.wrongBook.findIndex((x) => x && x.key === key);
    if (action === "add") {
      if (idx === -1) data.wrongBook.push({ key, type, text });
    } else if (idx !== -1) {
      data.wrongBook.splice(idx, 1);
    }

    saveDb(db);
    return sendJson(res, 200, { ok: true, wrongBook: data.wrongBook });
  }

  return sendJson(res, 404, { ok: false, message: "API不存在" });
}

function safePathFromUrl(pathname) {
  const decoded = decodeURIComponent(pathname);
  const target = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const abs = path.resolve(ROOT, target);
  if (!(abs === ROOT || abs.startsWith(`${ROOT}${path.sep}`))) return null;
  return abs;
}

function serveStatic(req, res, pathname) {
  const abs = safePathFromUrl(pathname);
  if (!abs) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(abs, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }
    const ext = path.extname(abs).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Access-Control-Allow-Origin": "*"
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }
    serveStatic(req, res, url.pathname);
  } catch (err) {
    sendJson(res, 500, { ok: false, message: err && err.message ? err.message : "internal error" });
  }
});

server.listen(PORT, HOST, () => {
  ensureDbFile();
  console.log(`HSK server running on http://${HOST}:${PORT}`);
});

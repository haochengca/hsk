const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");
const { Pool } = require("pg");
const { URL } = require("url");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8787);
const ROOT = __dirname;
const DB_PATH = process.env.DB_PATH
  ? path.resolve(String(process.env.DB_PATH))
  : path.join(ROOT, "data", "server_db.sqlite");
const DATABASE_URL = String(process.env.DATABASE_URL || "").trim();
const USE_POSTGRES = Boolean(DATABASE_URL);
const RECOGNITION_V2_ENABLED = !["0", "false", "off"].includes(String(process.env.RECOGNITION_V2_ENABLED || "1").trim().toLowerCase());
const OCR_SERVICE_URL = String(process.env.OCR_SERVICE_URL || "http://192.168.1.33:8788").trim().replace(/\/+$/, "");
const OCR_SERVICE_TIMEOUT_MS = Math.max(1000, Number(process.env.OCR_SERVICE_TIMEOUT_MS || 30000) || 30000);
const LEGACY_JSON_DB_PATH = path.join(ROOT, "data", "server_db.json");
const LEGACY_SQLITE_DB_PATH = path.join(ROOT, "data", "server_db.sqlite");
const DB_STATE_KEY = "state";
const SESSION_EXPIRE_MS = 30 * 24 * 60 * 60 * 1000;
const SUBMISSION_SAVE_RETRY_LIMIT = Math.max(1, Number(process.env.SUBMISSION_SAVE_RETRY_LIMIT || 3) || 3);
const SUBMISSION_SAVE_RETRY_DELAY_MS = Math.max(50, Number(process.env.SUBMISSION_SAVE_RETRY_DELAY_MS || 300) || 300);
let sqliteDb = null;
let pgPool = null;

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

function getDbHealthInfo() {
  if (USE_POSTGRES) {
    let host = "";
    let database = "";
    try {
      const parsed = new URL(DATABASE_URL);
      host = String(parsed.hostname || "");
      database = String(parsed.pathname || "").replace(/^\/+/, "");
    } catch {}
    return {
      type: "postgres",
      host,
      database
    };
  }
  return {
    type: "sqlite",
    path: DB_PATH
  };
}

function now() {
  return Date.now();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function normalizeRole(role) {
  if (role === "admin" || role === "parent" || role === "child") return role;
  if (role === "user") return "child";
  return "child";
}

function isLearnerRole(role) {
  return role === "parent" || role === "child";
}

function isManagerRole(role) {
  return role === "admin" || role === "parent";
}

function normalizeUserRecord(input) {
  const user = input && typeof input === "object" ? { ...input } : {};
  user.username = String(user.username || "").trim();
  user.role = normalizeRole(user.role);
  user.passwordHash = String(user.passwordHash || "");
  user.createdAt = Number(user.createdAt) || now();
  user.linkedParentUsername = String(user.linkedParentUsername || "").trim();
  user.linkedChildren = Array.isArray(user.linkedChildren)
    ? [...new Set(user.linkedChildren.map((x) => String(x || "").trim()).filter(Boolean))]
    : [];
  if (user.role !== "child") user.linkedParentUsername = "";
  if (user.role !== "parent") user.linkedChildren = [];
  return user;
}

function ensureFamilyLinks(db) {
  const userMap = new Map();
  db.users.forEach((user) => userMap.set(user.username, user));
  db.users.forEach((user) => {
    if (user.role !== "child" || !user.linkedParentUsername) return;
    const parent = userMap.get(user.linkedParentUsername);
    if (!parent || parent.role !== "parent") {
      user.linkedParentUsername = "";
      return;
    }
    if (!Array.isArray(parent.linkedChildren)) parent.linkedChildren = [];
    if (!parent.linkedChildren.includes(user.username)) parent.linkedChildren.push(user.username);
  });
  db.users.forEach((user) => {
    if (user.role !== "parent") return;
    user.linkedChildren = [...new Set((user.linkedChildren || []).filter((name) => {
      const child = userMap.get(name);
      return child && child.role === "child";
    }))];
  });
}

function defaultDbState() {
  return {
    users: [
      {
        username: "admin",
        passwordHash: createPasswordHash("admin123"),
        role: "admin",
        createdAt: now()
      }
    ],
    userData: {},
    lexiconOverrides: {},
    submissions: [],
    sessions: []
  };
}

function normalizeSubmissionRecord(input) {
  const row = input && typeof input === "object" ? { ...input } : {};
  row.id = String(row.id || "").trim();
  row.username = String(row.username || "").trim();
  row.type = row.type === "word" ? "word" : "char";
  row.target = String(row.target || "");
  row.pinyin = String(row.pinyin || "");
  row.userAnswer = String(row.userAnswer || "");
  row.handwritingImage = String(row.handwritingImage || "");
  row.accuracyPercent = normalizeAccuracyPercent(row.accuracyPercent);
  row.systemResult = Boolean(row.systemResult);
  row.finalResult = Boolean(row.finalResult);
  row.judgeDetail = normalizeJudgeDetail(row.judgeDetail);
  row.pointsAwarded = Number(row.pointsAwarded) || 0;
  row.wordCharResults = Array.isArray(row.wordCharResults)
    ? row.wordCharResults.map((x) => ({
        char: String((x && x.char) || ""),
        isGood: Boolean(x && x.isGood),
        accuracyPercent: normalizeAccuracyPercent(x && x.accuracyPercent),
        handwritingImage: String((x && x.handwritingImage) || ""),
        judgeDetail: normalizeJudgeDetail(x && x.judgeDetail)
      }))
    : [];
  row.reviewedBy = String(row.reviewedBy || "");
  row.reviewedAt = Number(row.reviewedAt) || 0;
  row.createdAt = Number(row.createdAt) || now();
  return row;
}

function normalizeDbState(input) {
  const parsed = input && typeof input === "object" ? { ...input } : {};
  parsed.users = Array.isArray(parsed.users) ? parsed.users.map(normalizeUserRecord).filter((x) => x.username) : [];
  ensureFamilyLinks(parsed);
  parsed.userData = parsed.userData && typeof parsed.userData === "object" ? parsed.userData : {};
  parsed.lexiconOverrides = parsed.lexiconOverrides && typeof parsed.lexiconOverrides === "object" ? parsed.lexiconOverrides : {};
  parsed.submissions = Array.isArray(parsed.submissions) ? parsed.submissions : [];
  parsed.sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
  if (!parsed.users.some((x) => x && x.username === "admin")) {
    parsed.users.unshift(
      normalizeUserRecord({
        username: "admin",
        passwordHash: createPasswordHash("admin123"),
        role: "admin",
        createdAt: now()
      })
    );
  }
  return parsed;
}

function getCoreDbState(dbState) {
  const normalized = normalizeDbState(dbState);
  return {
    ...normalized,
    submissions: []
  };
}

function getSqliteDb() {
  if (sqliteDb) return sqliteDb;
  if (!fs.existsSync(path.dirname(DB_PATH))) fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  sqliteDb = new DatabaseSync(DB_PATH);
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      reviewed_by TEXT NOT NULL DEFAULT '',
      created_at INTEGER NOT NULL,
      payload TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_submissions_username_created_at ON submissions(username, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_submissions_reviewed_by ON submissions(reviewed_by);
  `);
  return sqliteDb;
}

function getPgPool() {
  if (!USE_POSTGRES) return null;
  if (pgPool) return pgPool;
  const disableSsl = String(process.env.PGSSL || "").toLowerCase() === "disable";
  pgPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: disableSsl ? false : { rejectUnauthorized: false }
  });
  return pgPool;
}

function readLegacyJsonDb() {
  if (!fs.existsSync(LEGACY_JSON_DB_PATH)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(LEGACY_JSON_DB_PATH, "utf8"));
    return normalizeDbState(parsed);
  } catch {
    return null;
  }
}

function readSqliteStateFromFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) return null;
  let tempDb = null;
  try {
    tempDb = new DatabaseSync(abs);
    tempDb.exec(`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    const row = tempDb.prepare("SELECT value FROM kv_store WHERE key = ?").get(DB_STATE_KEY);
    if (!row || !row.value) return null;
    return normalizeDbState(JSON.parse(String(row.value)));
  } catch {
    return null;
  } finally {
    try {
      if (tempDb && typeof tempDb.close === "function") tempDb.close();
    } catch {}
  }
}

async function ensurePostgresStore() {
  const pool = getPgPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      reviewed_by TEXT NOT NULL DEFAULT '',
      created_at BIGINT NOT NULL,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query("CREATE INDEX IF NOT EXISTS idx_submissions_username_created_at ON submissions(username, created_at DESC)");
  await pool.query("CREATE INDEX IF NOT EXISTS idx_submissions_reviewed_by ON submissions(reviewed_by)");
}

async function readPostgresState() {
  const pool = getPgPool();
  const result = await pool.query("SELECT value FROM kv_store WHERE key = $1 LIMIT 1", [DB_STATE_KEY]);
  if (!result.rows[0] || !result.rows[0].value) return null;
  return normalizeDbState(JSON.parse(String(result.rows[0].value)));
}

async function writePostgresState(dbState) {
  const pool = getPgPool();
  const normalized = getCoreDbState(dbState);
  await pool.query(
    `
      INSERT INTO kv_store(key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT(key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `,
    [DB_STATE_KEY, JSON.stringify(normalized)]
  );
}

async function listPostgresSubmissions() {
  const pool = getPgPool();
  const result = await pool.query("SELECT payload FROM submissions ORDER BY created_at DESC, id DESC");
  return result.rows.map((row) => normalizeSubmissionRecord(row.payload));
}

async function countPostgresSubmissions() {
  const pool = getPgPool();
  const result = await pool.query("SELECT COUNT(*)::int AS count FROM submissions");
  return Number(result.rows[0] && result.rows[0].count) || 0;
}

async function upsertPostgresSubmission(row) {
  const pool = getPgPool();
  const normalized = normalizeSubmissionRecord(row);
  await pool.query(
    `
      INSERT INTO submissions(id, username, reviewed_by, created_at, payload, updated_at)
      VALUES ($1, $2, $3, $4, $5::jsonb, NOW())
      ON CONFLICT(id)
      DO UPDATE SET
        username = EXCLUDED.username,
        reviewed_by = EXCLUDED.reviewed_by,
        created_at = EXCLUDED.created_at,
        payload = EXCLUDED.payload,
        updated_at = NOW()
    `,
    [
      normalized.id,
      normalized.username,
      normalized.reviewedBy,
      normalized.createdAt,
      JSON.stringify(normalized)
    ]
  );
}

async function deletePostgresSubmissionsByUsername(username) {
  const pool = getPgPool();
  const result = await pool.query("DELETE FROM submissions WHERE username = $1", [username]);
  return Number(result.rowCount) || 0;
}

async function deletePostgresSubmissionsByUsernameOrReviewer(username) {
  const pool = getPgPool();
  const result = await pool.query("DELETE FROM submissions WHERE username = $1 OR reviewed_by = $1", [username]);
  return Number(result.rowCount) || 0;
}

function listSqliteSubmissions() {
  const db = getSqliteDb();
  const rows = db.prepare("SELECT payload FROM submissions ORDER BY created_at DESC, id DESC").all();
  return rows.map((row) => {
    const payload = row && row.payload ? JSON.parse(String(row.payload)) : {};
    return normalizeSubmissionRecord(payload);
  });
}

function countSqliteSubmissions() {
  const db = getSqliteDb();
  const row = db.prepare("SELECT COUNT(*) AS count FROM submissions").get();
  return Number(row && row.count) || 0;
}

function upsertSqliteSubmission(row) {
  const db = getSqliteDb();
  const normalized = normalizeSubmissionRecord(row);
  db.prepare(`
    INSERT INTO submissions(id, username, reviewed_by, created_at, payload)
    VALUES(?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      username = excluded.username,
      reviewed_by = excluded.reviewed_by,
      created_at = excluded.created_at,
      payload = excluded.payload
  `).run(
    normalized.id,
    normalized.username,
    normalized.reviewedBy,
    normalized.createdAt,
    JSON.stringify(normalized)
  );
}

function deleteSqliteSubmissionsByUsername(username) {
  const db = getSqliteDb();
  const result = db.prepare("DELETE FROM submissions WHERE username = ?").run(username);
  return Number(result && result.changes) || 0;
}

function deleteSqliteSubmissionsByUsernameOrReviewer(username) {
  const db = getSqliteDb();
  const result = db.prepare("DELETE FROM submissions WHERE username = ? OR reviewed_by = ?").run(username, username);
  return Number(result && result.changes) || 0;
}

async function listStoredSubmissions() {
  if (USE_POSTGRES) return listPostgresSubmissions();
  return listSqliteSubmissions();
}

async function countStoredSubmissions() {
  if (USE_POSTGRES) return countPostgresSubmissions();
  return countSqliteSubmissions();
}

async function saveSubmissionRow(row) {
  if (USE_POSTGRES) {
    await upsertPostgresSubmission(row);
    return;
  }
  upsertSqliteSubmission(row);
}

async function deleteSubmissionRowsByUsername(username) {
  if (USE_POSTGRES) return deletePostgresSubmissionsByUsername(username);
  return deleteSqliteSubmissionsByUsername(username);
}

async function deleteSubmissionRowsByUsernameOrReviewer(username) {
  if (USE_POSTGRES) return deletePostgresSubmissionsByUsernameOrReviewer(username);
  return deleteSqliteSubmissionsByUsernameOrReviewer(username);
}

async function migrateLegacySubmissions(dbState) {
  const legacyRows = Array.isArray(dbState && dbState.submissions) ? dbState.submissions : [];
  if (!legacyRows.length) return 0;
  const existingCount = await countStoredSubmissions();
  if (existingCount > 0) return 0;
  let migrated = 0;
  for (const row of legacyRows) {
    const normalized = normalizeSubmissionRecord(row);
    if (!normalized.id || !normalized.username) continue;
    await saveSubmissionRow(normalized);
    migrated += 1;
  }
  if (migrated > 0) {
    console.log(`[submissions] migrated ${migrated} legacy rows to dedicated store`);
  }
  return migrated;
}

async function ensureDbFile() {
  if (USE_POSTGRES) {
    await ensurePostgresStore();
    const existing = await readPostgresState();
    if (existing) {
      await migrateLegacySubmissions(existing);
      await writePostgresState(existing);
      return;
    }
    const initial =
      readSqliteStateFromFile(DB_PATH) ||
      readSqliteStateFromFile(LEGACY_SQLITE_DB_PATH) ||
      readLegacyJsonDb() ||
      defaultDbState();
    await migrateLegacySubmissions(initial);
    await writePostgresState(initial);
    return;
  }

  const db = getSqliteDb();
  const row = db.prepare("SELECT value FROM kv_store WHERE key = ?").get(DB_STATE_KEY);
  if (row && row.value) {
    try {
      const existing = normalizeDbState(JSON.parse(String(row.value)));
      await migrateLegacySubmissions(existing);
      db.prepare("INSERT OR REPLACE INTO kv_store(key, value) VALUES(?, ?)").run(DB_STATE_KEY, JSON.stringify(getCoreDbState(existing)));
    } catch {}
    return;
  }

  const initial = readLegacyJsonDb() || defaultDbState();
  await migrateLegacySubmissions(initial);
  const normalized = getCoreDbState(initial);
  db.prepare("INSERT OR REPLACE INTO kv_store(key, value) VALUES(?, ?)").run(DB_STATE_KEY, JSON.stringify(normalized));
}

async function loadDb() {
  await ensureDbFile();
  if (USE_POSTGRES) {
    try {
      const state = await readPostgresState();
      const dbState = state || normalizeDbState(defaultDbState());
      dbState.submissions = await listStoredSubmissions();
      return dbState;
    } catch {
      const fallback = normalizeDbState(defaultDbState());
      fallback.submissions = [];
      return fallback;
    }
  }
  const db = getSqliteDb();
  try {
    const row = db.prepare("SELECT value FROM kv_store WHERE key = ?").get(DB_STATE_KEY);
    if (!row || !row.value) {
      const fallback = normalizeDbState(defaultDbState());
      fallback.submissions = listSqliteSubmissions();
      return fallback;
    }
    const parsed = JSON.parse(String(row.value));
    const state = normalizeDbState(parsed);
    state.submissions = listSqliteSubmissions();
    return state;
  } catch {
    const fallback = normalizeDbState(defaultDbState());
    fallback.submissions = [];
    return fallback;
  }
}

async function saveDb(db) {
  let lastError = null;
  for (let attempt = 1; attempt <= SUBMISSION_SAVE_RETRY_LIMIT; attempt += 1) {
    try {
      if (USE_POSTGRES) {
        await writePostgresState(db);
        return;
      }
      const conn = getSqliteDb();
      const normalized = getCoreDbState(db);
      conn.prepare("INSERT OR REPLACE INTO kv_store(key, value) VALUES(?, ?)").run(DB_STATE_KEY, JSON.stringify(normalized));
      return;
    } catch (err) {
      lastError = err;
      console.error(
        `[db] save failed (attempt ${attempt}/${SUBMISSION_SAVE_RETRY_LIMIT}):`,
        err && err.stack ? err.stack : err
      );
      if (attempt < SUBMISSION_SAVE_RETRY_LIMIT) {
        await sleep(SUBMISSION_SAVE_RETRY_DELAY_MS * attempt);
      }
    }
  }
  throw lastError;
}

async function saveSubmissionWithRetry(row) {
  let lastError = null;
  for (let attempt = 1; attempt <= SUBMISSION_SAVE_RETRY_LIMIT; attempt += 1) {
    try {
      await saveSubmissionRow(row);
      return { attempts: attempt };
    } catch (err) {
      lastError = err;
      console.error(
        `[submissions] save failed (attempt ${attempt}/${SUBMISSION_SAVE_RETRY_LIMIT}) for ${row && row.id ? row.id : "unknown"}:`,
        err && err.stack ? err.stack : err
      );
      if (attempt < SUBMISSION_SAVE_RETRY_LIMIT) {
        await sleep(SUBMISSION_SAVE_RETRY_DELAY_MS * attempt);
      }
    }
  }
  throw lastError;
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
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  });
  res.end(body);
}

async function readJsonResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, message: text };
  }
}

async function fetchOcrService(pathname, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OCR_SERVICE_TIMEOUT_MS);
  try {
    const response = await fetch(`${OCR_SERVICE_URL}${pathname}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });
    const payload = await readJsonResponse(response);
    return { status: response.status, ok: response.ok, payload };
  } finally {
    clearTimeout(timeout);
  }
}

function getAuthContext(req, db) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return null;
  cleanExpiredSessions(db);
  const session = db.sessions.find((x) => x.token === token);
  if (!session) return null;
  const user = db.users.find((x) => x && x.username === session.username);
  if (!user) return null;
  return {
    token,
    username: user.username,
    role: normalizeRole(user.role),
    linkedParentUsername: String(user.linkedParentUsername || ""),
    linkedChildren: Array.isArray(user.linkedChildren) ? user.linkedChildren : []
  };
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

function normalizeUnitScore(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, Number(value)));
}

function normalizeJudgeDetail(detail) {
  if (!detail || typeof detail !== "object") return null;
  const thresholds = detail.thresholds && typeof detail.thresholds === "object"
    ? {
        pass: normalizeUnitScore(Number(detail.thresholds.pass)),
        retryLow: normalizeUnitScore(Number(detail.thresholds.retryLow))
      }
    : null;
  const engines = detail.engines && typeof detail.engines === "object"
    ? {
        overlap: normalizeUnitScore(Number(detail.engines.overlap)),
        projection: normalizeUnitScore(Number(detail.engines.projection)),
        grid: normalizeUnitScore(Number(detail.engines.grid))
      }
    : null;
  return {
    version: String(detail.version || "v2"),
    decision: ["pass", "fail", "retry"].includes(String(detail.decision)) ? String(detail.decision) : "fail",
    decisionScore: normalizeUnitScore(Number(detail.decisionScore)),
    baseScore: normalizeUnitScore(Number(detail.baseScore)),
    mlScore: Number.isFinite(detail.mlScore) ? normalizeUnitScore(Number(detail.mlScore)) : null,
    blendedScore: normalizeUnitScore(Number(detail.blendedScore)),
    tier: ["simple", "medium", "complex"].includes(String(detail.tier)) ? String(detail.tier) : "medium",
    thresholds,
    engines,
    retryAttempt: Math.max(0, Number(detail.retryAttempt) || 0),
    reason: String(detail.reason || "unknown")
  };
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

function normalizeLexiconOverride(input, fallbackType = "char", fallbackText = "") {
  const type = input && input.type === "word" ? "word" : fallbackType === "word" ? "word" : "char";
  const text = String((input && input.text) || fallbackText || "").trim();
  const pinyin = String((input && input.pinyin) || "").trim();
  const prompt1 = String((input && input.prompt1) || "").trim();
  const prompt2 = String((input && input.prompt2) || "").trim();
  return { type, text, pinyin, prompt1, prompt2 };
}

function removeUserDeep(db, username) {
  const target = String(username || "").trim();
  if (!target) return;
  const user = db.users.find((x) => x && x.username === target);
  if (!user) return;
  const role = normalizeRole(user.role);

  if (role === "parent") {
    db.users.forEach((u) => {
      if (u && normalizeRole(u.role) === "child" && u.linkedParentUsername === target) u.linkedParentUsername = "";
    });
  }
  if (role === "child" && user.linkedParentUsername) {
    const parent = db.users.find((x) => x && x.username === user.linkedParentUsername);
    if (parent && Array.isArray(parent.linkedChildren)) {
      parent.linkedChildren = parent.linkedChildren.filter((x) => x !== target);
    }
  }

  db.users = db.users.filter((x) => x && x.username !== target);
  delete db.userData[target];
  db.submissions = (db.submissions || []).filter((x) => x && x.username !== target && x.reviewedBy !== target);
  db.sessions = (db.sessions || []).filter((x) => x && x.username !== target);
}

function resetUserDataDeep(db, username) {
  const target = String(username || "").trim();
  if (!target) return { submissionsCleared: 0, sessionsCleared: 0 };
  const beforeSubmissions = Array.isArray(db.submissions) ? db.submissions.length : 0;
  const beforeSessions = Array.isArray(db.sessions) ? db.sessions.length : 0;
  db.userData[target] = defaultUserData();
  db.submissions = (db.submissions || []).filter((x) => x && x.username !== target);
  db.sessions = (db.sessions || []).filter((x) => x && x.username !== target);
  return {
    submissionsCleared: Math.max(0, beforeSubmissions - db.submissions.length),
    sessionsCleared: Math.max(0, beforeSessions - db.sessions.length)
  };
}

async function handleApi(req, res, pathname) {
  const db = await loadDb();

  if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });

  if (req.method === "GET" && pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, now: now(), db: getDbHealthInfo() });
  }

  if (req.method === "GET" && pathname === "/api/ocr/health") {
    try {
      const upstream = await fetchOcrService("/health");
      return sendJson(res, upstream.status, upstream.payload);
    } catch (err) {
      return sendJson(res, 502, {
        ok: false,
        message: err && err.name === "AbortError" ? "OCR 服务请求超时" : "OCR 服务不可用"
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/ocr/recognize") {
    const body = await parseBody(req);
    if (!body || typeof body.image !== "string" || !body.image.trim()) {
      return sendJson(res, 400, { ok: false, message: "image 不能为空" });
    }
    try {
      const upstream = await fetchOcrService("/ocr/recognize", {
        method: "POST",
        body: {
          image: String(body.image || ""),
          target: String(body.target || ""),
          candidates: Array.isArray(body.candidates) ? body.candidates : [],
          variantLimit: Number(body.variantLimit) || undefined
        }
      });
      return sendJson(res, upstream.status, upstream.payload);
    } catch (err) {
      return sendJson(res, 502, {
        ok: false,
        message: err && err.name === "AbortError" ? "OCR 服务请求超时" : "OCR 服务不可用"
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/ocr/judge") {
    const body = await parseBody(req);
    if (!body || typeof body.image !== "string" || !body.image.trim()) {
      return sendJson(res, 400, { ok: false, message: "image 不能为空" });
    }
    if (typeof body.target !== "string" || !body.target.trim()) {
      return sendJson(res, 400, { ok: false, message: "target 不能为空" });
    }
    try {
      const upstream = await fetchOcrService("/ocr/judge", {
        method: "POST",
        body: {
          image: String(body.image || ""),
          target: String(body.target || ""),
          type: body.type === "word" ? "word" : "char",
          candidates: Array.isArray(body.candidates) ? body.candidates : []
        }
      });
      return sendJson(res, upstream.status, upstream.payload);
    } catch (err) {
      return sendJson(res, 502, {
        ok: false,
        message: err && err.name === "AbortError" ? "OCR 服务请求超时" : "OCR 服务不可用"
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/register") {
    const body = await parseBody(req);
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const role = normalizeRole(body.role);
    const linkedParentUsername = String(body.linkedParentUsername || "").trim();
    if (!validUsername(username)) {
      return sendJson(res, 400, { ok: false, message: "用户名需为3-32位字母/数字/下划线" });
    }
    if (!validPassword(password)) {
      return sendJson(res, 400, { ok: false, message: "密码长度需为6-64位" });
    }
    if (role === "admin") {
      return sendJson(res, 400, { ok: false, message: "不支持注册管理员账号" });
    }
    if (db.users.some((x) => x.username === username)) {
      return sendJson(res, 409, { ok: false, message: "用户名已存在" });
    }
    let parent = null;
    if (role === "child") {
      if (!validUsername(linkedParentUsername)) {
        return sendJson(res, 400, { ok: false, message: "孩子账号需填写已存在的父母账号用户名" });
      }
      parent = db.users.find((x) => x.username === linkedParentUsername);
      if (!parent || normalizeRole(parent.role) !== "parent") {
        return sendJson(res, 400, { ok: false, message: "关联父母账号不存在或角色不正确" });
      }
    }
    db.users.push({
      username,
      passwordHash: createPasswordHash(password),
      role,
      linkedParentUsername: role === "child" ? linkedParentUsername : "",
      linkedChildren: [],
      createdAt: now()
    });
    if (role === "child" && parent) {
      if (!Array.isArray(parent.linkedChildren)) parent.linkedChildren = [];
      if (!parent.linkedChildren.includes(username)) parent.linkedChildren.push(username);
    }
    ensureUserData(db, username);
    await saveDb(db);
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
      role: normalizeRole(user.role),
      createdAt: now(),
      expiresAt: now() + SESSION_EXPIRE_MS
    });
    await saveDb(db);
    return sendJson(res, 200, {
      ok: true,
      token,
      user: {
        username: user.username,
        role: normalizeRole(user.role),
        linkedParentUsername: String(user.linkedParentUsername || ""),
        linkedChildren: Array.isArray(user.linkedChildren) ? user.linkedChildren : []
      }
    });
  }

  const auth = getAuthContext(req, db);
  if (!auth) return sendJson(res, 401, { ok: false, message: "未登录或会话已过期" });

  if (req.method === "POST" && pathname === "/api/change-password") {
    const body = await parseBody(req);
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");
    if (!currentPassword || !newPassword) {
      return sendJson(res, 400, { ok: false, message: "请填写当前密码和新密码" });
    }
    if (!validPassword(newPassword)) {
      return sendJson(res, 400, { ok: false, message: "新密码长度需为6-64位" });
    }
    const user = db.users.find((x) => x && x.username === auth.username);
    if (!user) return sendJson(res, 404, { ok: false, message: "用户不存在" });
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return sendJson(res, 401, { ok: false, message: "当前密码错误" });
    }
    if (verifyPassword(newPassword, user.passwordHash)) {
      return sendJson(res, 400, { ok: false, message: "新密码不能与当前密码相同" });
    }
    user.passwordHash = createPasswordHash(newPassword);
    // 修改密码后，仅保留当前会话，避免历史会话继续可用。
    db.sessions = (db.sessions || []).filter((x) => x && (x.username !== auth.username || x.token === auth.token));
    await saveDb(db);
    return sendJson(res, 200, { ok: true, message: "密码修改成功" });
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    db.sessions = db.sessions.filter((x) => x.token !== auth.token);
    await saveDb(db);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && pathname === "/api/bootstrap") {
    const data = ensureUserData(db, auth.username);
    const submissions =
      isManagerRole(auth.role)
        ? db.submissions.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        : db.submissions.filter((x) => x.username === auth.username).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return sendJson(res, 200, {
      ok: true,
      user: {
        username: auth.username,
        role: auth.role,
        linkedParentUsername: String(auth.linkedParentUsername || ""),
        linkedChildren: Array.isArray(auth.linkedChildren) ? auth.linkedChildren : []
      },
      data,
      flags: {
        recognitionV2Enabled: RECOGNITION_V2_ENABLED
      },
      lexiconOverrides: db.lexiconOverrides || {},
      submissions
    });
  }

  if (pathname === "/api/tasks" || pathname.startsWith("/api/tasks/")) {
    return sendJson(res, 404, { ok: false, message: "任务功能已下线" });
  }

  if (req.method === "PUT" && pathname === "/api/user-data") {
    const body = await parseBody(req);
    db.userData[auth.username] = normalizeUserData(body);
    await saveDb(db);
    return sendJson(res, 200, { ok: true, savedAt: now() });
  }

  if (req.method === "GET" && pathname === "/api/admin/users") {
    if (auth.role !== "admin") return sendJson(res, 403, { ok: false, message: "仅管理员可查看" });
    const users = (db.users || [])
      .map((u) => ({
        username: u.username,
        role: normalizeRole(u.role),
        linkedParentUsername: String(u.linkedParentUsername || ""),
        linkedChildren: Array.isArray(u.linkedChildren) ? u.linkedChildren : [],
        createdAt: Number(u.createdAt) || 0
      }))
      .sort((a, b) => {
        if (a.role !== b.role) return a.role.localeCompare(b.role);
        return a.username.localeCompare(b.username);
      });
    return sendJson(res, 200, { ok: true, users });
  }

  if (req.method === "POST" && pathname.startsWith("/api/admin/users/") && pathname.endsWith("/reset-data")) {
    if (auth.role !== "admin") return sendJson(res, 403, { ok: false, message: "仅管理员可操作" });
    const parts = pathname.split("/");
    const username = decodeURIComponent(parts[4] || "").trim();
    if (!username) return sendJson(res, 400, { ok: false, message: "用户名不能为空" });
    const user = db.users.find((x) => x && x.username === username);
    if (!user) return sendJson(res, 404, { ok: false, message: "用户不存在" });
    if (normalizeRole(user.role) === "admin") return sendJson(res, 400, { ok: false, message: "不允许清空管理员账号数据" });
    const result = resetUserDataDeep(db, username);
    await deleteSubmissionRowsByUsername(username);
    await saveDb(db);
    return sendJson(res, 200, {
      ok: true,
      username,
      ...result
    });
  }

  if (req.method === "DELETE" && pathname.startsWith("/api/admin/users/")) {
    if (auth.role !== "admin") return sendJson(res, 403, { ok: false, message: "仅管理员可操作" });
    const parts = pathname.split("/");
    const username = decodeURIComponent(parts[4] || "").trim();
    if (!username) return sendJson(res, 400, { ok: false, message: "用户名不能为空" });
    const user = db.users.find((x) => x && x.username === username);
    if (!user) return sendJson(res, 404, { ok: false, message: "用户不存在" });
    if (normalizeRole(user.role) === "admin") return sendJson(res, 400, { ok: false, message: "不允许删除管理员账号" });
    if (username === auth.username) return sendJson(res, 400, { ok: false, message: "不允许删除当前登录账号" });
    removeUserDeep(db, username);
    await deleteSubmissionRowsByUsernameOrReviewer(username);
    ensureFamilyLinks(db);
    await saveDb(db);
    return sendJson(res, 200, { ok: true, deleted: username });
  }

  if (req.method === "POST" && pathname === "/api/submissions") {
    if (!isLearnerRole(auth.role)) return sendJson(res, 403, { ok: false, message: "仅父母或孩子账号可提交默写记录" });
    const body = await parseBody(req);
    const wordCharResults = Array.isArray(body.wordCharResults)
      ? body.wordCharResults.map((x) => ({
          char: String((x && x.char) || ""),
          isGood: Boolean(x && x.isGood),
          accuracyPercent: normalizeAccuracyPercent(x && x.accuracyPercent),
          handwritingImage: String((x && x.handwritingImage) || ""),
          judgeDetail: normalizeJudgeDetail(x && x.judgeDetail)
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
      judgeDetail: normalizeJudgeDetail(body.judgeDetail),
      pointsAwarded: Number(body.pointsAwarded) || 0,
      wordCharResults,
      reviewedBy: String(body.reviewedBy || ""),
      reviewedAt: Number(body.reviewedAt) || 0,
      createdAt: Number(body.createdAt) || now()
    };
    console.log("[submissions] writing row:", JSON.stringify(row, null, 2));
    const saveResult = await saveSubmissionWithRetry(row);
    db.submissions.unshift(row);
    console.log("[submissions] saved row:", row.id, `attempt=${saveResult.attempts}`);
    return sendJson(res, 201, { ok: true, submission: row, saveAttempts: saveResult.attempts });
  }

  if (req.method === "PUT" && pathname.startsWith("/api/submissions/") && pathname.endsWith("/review")) {
    if (auth.role !== "parent") return sendJson(res, 403, { ok: false, message: "仅父母可复判" });
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
          handwritingImage: String((x && x.handwritingImage) || ""),
          judgeDetail: normalizeJudgeDetail(x && x.judgeDetail)
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
    await saveSubmissionWithRetry(submission);
    await saveDb(db);
    return sendJson(res, 200, { ok: true, submission });
  }

  if (req.method === "GET" && pathname.startsWith("/api/admin/users/") && pathname.endsWith("/wrong-book")) {
    if (!isManagerRole(auth.role)) return sendJson(res, 403, { ok: false, message: "仅管理员或父母可查看" });
    const parts = pathname.split("/");
    const username = decodeURIComponent(parts[4] || "").trim();
    if (!username) return sendJson(res, 400, { ok: false, message: "用户名不能为空" });
    const user = db.users.find((x) => x && x.username === username);
    if (!user) return sendJson(res, 404, { ok: false, message: "用户不存在" });
    if (!isLearnerRole(normalizeRole(user.role))) return sendJson(res, 400, { ok: false, message: "仅可查看父母/孩子账号错题本" });
    const data = ensureUserData(db, username);
    return sendJson(res, 200, { ok: true, wrongBook: Array.isArray(data.wrongBook) ? data.wrongBook : [] });
  }

  if (req.method === "PUT" && pathname.startsWith("/api/admin/users/") && pathname.endsWith("/wrong-book")) {
    if (!isManagerRole(auth.role)) return sendJson(res, 403, { ok: false, message: "仅管理员或父母可操作" });
    const parts = pathname.split("/");
    const username = decodeURIComponent(parts[4] || "").trim();
    if (!username) return sendJson(res, 400, { ok: false, message: "用户名不能为空" });
    const user = db.users.find((x) => x && x.username === username);
    if (!user) return sendJson(res, 404, { ok: false, message: "用户不存在" });
    if (!isLearnerRole(normalizeRole(user.role))) return sendJson(res, 400, { ok: false, message: "仅可操作父母/孩子账号错题本" });

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

    await saveDb(db);
    return sendJson(res, 200, { ok: true, wrongBook: data.wrongBook });
  }

  if (req.method === "PUT" && pathname === "/api/admin/learning-item-override") {
    if (auth.role !== "admin") return sendJson(res, 403, { ok: false, message: "仅管理员可操作" });
    const body = await parseBody(req);
    const type = body.type === "word" ? "word" : "char";
    const text = String(body.text || "").trim();
    if (!text) return sendJson(res, 400, { ok: false, message: "学习项内容不能为空" });
    const normalized = normalizeLexiconOverride(body, type, text);
    const key = `${normalized.type}:${normalized.text}`;
    const allEmpty = !normalized.pinyin && !normalized.prompt1 && !normalized.prompt2;
    if (!db.lexiconOverrides || typeof db.lexiconOverrides !== "object") db.lexiconOverrides = {};
    if (allEmpty) {
      delete db.lexiconOverrides[key];
    } else {
      db.lexiconOverrides[key] = {
        ...normalized,
        updatedAt: now(),
        updatedBy: auth.username
      };
    }
    await saveDb(db);
    return sendJson(res, 200, {
      ok: true,
      key,
      override: db.lexiconOverrides[key] || null,
      lexiconOverrides: db.lexiconOverrides
    });
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
    const isDataJson = ext === ".json" && abs.includes(`${path.sep}data${path.sep}`);
    const cacheControl = isDataJson
      ? "public, max-age=31536000, immutable"
      : [".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".ico"].includes(ext)
        ? "public, max-age=3600"
        : "no-cache";
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": cacheControl
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
    console.error(`[http] request failed for ${req.method || "GET"} ${req.url || ""}:`, err && err.stack ? err.stack : err);
    sendJson(res, 500, { ok: false, message: err && err.message ? err.message : "internal error" });
  }
});

server.listen(PORT, HOST, () => {
  ensureDbFile()
    .then(() => {
      console.log(`HSK server running on http://${HOST}:${PORT}`);
    })
    .catch((err) => {
      console.error("failed to initialize db:", err && err.message ? err.message : err);
      process.exit(1);
    });
});

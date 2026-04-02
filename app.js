let HSK_CHARS = Array.isArray(window.HSK_CHARS) ? window.HSK_CHARS : [];
let SOURCE_WORDS = Array.isArray(window.HSK_WORDS) ? window.HSK_WORDS : [];
let CHAR_ITEMS = [];
let WORD_ITEMS = [];
let CHAR_MAP = new Map();
let WORD_MAP = new Map();
let CHAR_PHRASE_MAP = new Map();
let BASE_ITEM_SNAPSHOT = new Map();

async function loadLexiconData() {
  if (HSK_CHARS.length && SOURCE_WORDS.length) return;
  const [charsResp, wordsResp] = await Promise.all([
    fetch('data/hsk_chars_1_6.json', { cache: 'force-cache' }),
    fetch('data/hsk_words_1_6.json', { cache: 'force-cache' })
  ]);
  if (!charsResp.ok || !wordsResp.ok) {
    throw new Error('词库数据加载失败');
  }
  const [chars, words] = await Promise.all([charsResp.json(), wordsResp.json()]);
  HSK_CHARS = Array.isArray(chars) ? chars : [];
  SOURCE_WORDS = Array.isArray(words) ? words : [];
}

function rebuildLexiconCaches() {
  CHAR_ITEMS = buildCharItems();
  WORD_ITEMS = SOURCE_WORDS.map((it) => ({
    type: 'word',
    text: it.word,
    pinyin: it.pinyin,
    meaning: it.meaning,
    level: it.level,
    phrase: it.phrase || it.word,
    prompt1: it.prompt1 || "",
    prompt2: it.prompt2 || "",
    sentence: it.sentence || `我正在学习“${it.word}”。`
  }));
  CHAR_MAP = new Map(CHAR_ITEMS.map((it) => [it.text, it]));
  WORD_MAP = new Map(WORD_ITEMS.map((it) => [it.text, it]));
  CHAR_PHRASE_MAP = buildCharPhraseMap();
  BASE_ITEM_SNAPSHOT = new Map();
  CHAR_ITEMS.forEach((it) => {
    BASE_ITEM_SNAPSHOT.set(`char:${it.text}`, { pinyin: it.pinyin || '', prompt1: it.prompt1 || '', prompt2: it.prompt2 || '' });
  });
  WORD_ITEMS.forEach((it) => {
    BASE_ITEM_SNAPSHOT.set(`word:${it.text}`, { pinyin: it.pinyin || '', prompt1: it.prompt1 || '', prompt2: it.prompt2 || '' });
  });
}

const SESSION_KEY = "hsk_session_v1";
const API_BASE = "";


function buildCharItems() {
  const accentedToPlain = {
    ā: "a",
    á: "a",
    ǎ: "a",
    à: "a",
    ē: "e",
    é: "e",
    ě: "e",
    è: "e",
    ī: "i",
    í: "i",
    ǐ: "i",
    ì: "i",
    ō: "o",
    ó: "o",
    ǒ: "o",
    ò: "o",
    ū: "u",
    ú: "u",
    ǔ: "u",
    ù: "u",
    ǖ: "v",
    ǘ: "v",
    ǚ: "v",
    ǜ: "v",
    ü: "v",
    ń: "n",
    ň: "n",
    ǹ: "n",
    ḿ: "m"
  };

  const normalizePinyinToken = (value, stripTone = false) => {
    const source = String(value || "").toLowerCase();
    let out = "";
    for (const ch of source) {
      if (/[a-z]/.test(ch)) out += ch;
      else if (ch === "'") continue;
      else if (stripTone && accentedToPlain[ch]) out += accentedToPlain[ch];
      else if (!stripTone && (accentedToPlain[ch] || ch === "ü")) out += ch;
      else if (stripTone && ch === "ü") out += "v";
    }
    return out;
  };

  const splitRawTokens = (pinyin) => String(pinyin || "").trim().split(/\s+/).filter(Boolean);
  const knownPlainByChar = new Map();
  HSK_CHARS.forEach((it) => {
    if (!it || !it.char || !it.pinyin) return;
    const plain = normalizePinyinToken(it.pinyin, true);
    if (!plain) return;
    if (!knownPlainByChar.has(it.char)) knownPlainByChar.set(it.char, plain);
  });

  const validSyllables = new Set();
  knownPlainByChar.forEach((plain) => {
    if (plain) validSyllables.add(plain);
  });

  function splitCompactPinyin(chars, pinyin) {
    const rawCompact = normalizePinyinToken(pinyin, false);
    const plainCompact = normalizePinyinToken(pinyin, true);
    if (!rawCompact || !plainCompact || rawCompact.length !== plainCompact.length) return null;
    const n = chars.length;
    const memo = new Map();

    const solve = (idxChar, idxPos) => {
      const key = `${idxChar}:${idxPos}`;
      if (memo.has(key)) return memo.get(key);
      if (idxChar === n && idxPos === plainCompact.length) return { score: 0, lens: [] };
      if (idxChar >= n || idxPos >= plainCompact.length) return null;
      const remainChars = n - idxChar;
      const remainLen = plainCompact.length - idxPos;
      if (remainLen < remainChars || remainLen > remainChars * 7) return null;

      let best = null;
      const minLen = 1;
      const maxLen = Math.min(7, remainLen - (remainChars - 1));
      for (let len = minLen; len <= maxLen; len += 1) {
        const seg = plainCompact.slice(idxPos, idxPos + len);
        const char = chars[idxChar];
        const known = knownPlainByChar.get(char);
        const next = solve(idxChar + 1, idxPos + len);
        if (!next) continue;

        let score = next.score;
        if (validSyllables.has(seg)) score += 8;
        else if (len >= 2 && len <= 6) score += 2;
        else score -= 2;
        if (known) {
          if (seg === known) score += 12;
          else score -= 6;
        }
        // 优先把轻声常见后缀（de/ma/ne/ba/le）切成独立音节。
        if (["de", "ma", "ne", "ba", "le", "zi", "men"].includes(seg)) score += 1;

        const candidate = { score, lens: [len, ...next.lens] };
        if (!best || candidate.score > best.score) best = candidate;
      }
      memo.set(key, best);
      return best;
    };

    const best = solve(0, 0);
    if (!best || !best.lens || best.lens.length !== n) return null;
    const result = [];
    let pos = 0;
    for (const len of best.lens) {
      result.push(rawCompact.slice(pos, pos + len));
      pos += len;
    }
    return result.length === n ? result : null;
  }

  function splitWordPinyin(word, pinyin) {
    const chars = [...String(word || "")];
    if (!chars.length) return null;
    const rawTokens = splitRawTokens(pinyin);
    if (rawTokens.length === chars.length) return rawTokens.map((t) => normalizePinyinToken(t, false));
    return splitCompactPinyin(chars, pinyin);
  }

  const charPinyinHints = new Map();
  SOURCE_WORDS.forEach((w) => {
    const text = String((w && w.word) || "");
    const chars = [...text];
    const pyParts = splitWordPinyin(text, w && w.pinyin);
    if (!chars.length || !pyParts || pyParts.length !== chars.length) return;
    chars.forEach((ch, idx) => {
      if (!ch) return;
      if (!charPinyinHints.has(ch)) charPinyinHints.set(ch, pyParts[idx]);
    });
  });

  const map = new Map();
  HSK_CHARS.forEach((it) => {
    if (!it || !it.char) return;
    if (!map.has(it.char)) {
      map.set(it.char, {
        type: "char",
        text: it.char,
        pinyin: it.pinyin || "-",
        meaning: it.meaning || "-",
        level: Number(it.level) || 1,
        phrase: it.phrase || it.char,
        prompt1: it.prompt1 || "",
        prompt2: it.prompt2 || "",
        sentence: it.sentence || `这是“${it.char}”字。`
      });
      return;
    }
    const current = map.get(it.char);
    if (current && (!current.pinyin || current.pinyin === "-")) {
      current.pinyin = it.pinyin || charPinyinHints.get(it.char) || "-";
    }
  });

  // 将词汇拆分为单字并去重，统一并入汉字集合。
  SOURCE_WORDS.forEach((w) => {
    const level = Number(w && w.level) || 1;
    const word = String((w && w.word) || "");
    const chars = [...new Set([...word])];
    chars.forEach((ch) => {
      if (map.has(ch)) return;
      map.set(ch, {
        type: "char",
        text: ch,
        pinyin: charPinyinHints.get(ch) || "-",
        meaning: w && w.meaning ? `来自词汇：${w.meaning}` : "来自词汇",
        level,
        phrase: ch,
        prompt1: "",
        prompt2: "",
        sentence: `这是“${ch}”字。`
      });
    });
  });

  return [...map.values()].sort((a, b) => a.level - b.level || a.text.localeCompare(b.text, "zh-Hans-CN"));
}

function buildCharPhraseMap() {
  const map = new Map();
  const candidateMap = new Map();
  const words = WORD_ITEMS.filter((w) => [...String(w.text || "")].length >= 2);
  for (const c of CHAR_ITEMS) {
    map.set(c.text, []);
    candidateMap.set(c.text, []);
  }

  const resolveCharPosition = (ch, wordText) => {
    const chars = [...wordText];
    const idx = chars.indexOf(ch);
    if (idx < 0) return "none";
    if (idx === 0) return "start";
    if (idx === chars.length - 1) return "end";
    return "middle";
  };

  const scorePromptCandidate = (ch, word) => {
    const text = String(word && word.text ? word.text : "");
    const chars = [...text];
    const len = chars.length;
    if (!len) return -999;
    const level = Math.max(1, Number(word && word.level) || 6);
    const uniqueCount = new Set(chars).size;
    const repeats = len - uniqueCount;
    let score = 0;
    score += Math.max(0, 8 - level) * 20;
    if (len === 2) score += 40;
    else if (len === 3) score += 26;
    else if (len === 4) score += 12;
    else score -= (len - 4) * 6;
    const pos = resolveCharPosition(ch, text);
    if (pos === "start") score += 14;
    else if (pos === "end") score += 10;
    else if (pos === "middle") score += 8;
    if (uniqueCount === len) score += 6;
    if (uniqueCount === 1) score -= 30;
    score -= repeats * 6;
    if (chars[0] === chars[len - 1]) score -= 4;
    return score;
  };

  const scorePromptDiversity = (ch, firstText, candidateText) => {
    if (!firstText || !candidateText) return 0;
    const first = String(firstText);
    const candidate = String(candidateText);
    if (first === candidate) return -999;
    const firstChars = [...first];
    const candidateChars = [...candidate];
    const overlap = candidateChars.reduce((sum, c) => (firstChars.includes(c) ? sum + 1 : sum), 0);
    let score = -overlap * 3;
    if (firstChars.length !== candidateChars.length) score += 2;
    const posA = resolveCharPosition(ch, first);
    const posB = resolveCharPosition(ch, candidate);
    if (posA !== "none" && posB !== "none" && posA !== posB) score += 8;
    return score;
  };

  const fallbackPromptMap = {
    一: ["一个", "一起"],
    二: ["二月", "二十"],
    三: ["三个", "三天"],
    四: ["四个", "四季"],
    五: ["五个", "五月"],
    六: ["六个", "六月"],
    七: ["七天", "七个"],
    八: ["八个", "八月"],
    九: ["九个", "九月"],
    十: ["十个", "十天"],
    吗: ["是吗", "好吗"],
    呢: ["你呢", "在哪儿呢"],
    吧: ["好吧", "走吧"],
    啊: ["好啊", "啊？"],
    呀: ["对呀", "是呀"],
    嘛: ["干嘛", "好嘛"],
    了: ["好了", "来了"],
    的: ["我的", "你的"],
    地: ["地方", "地铁"],
    得: ["记得", "得到"],
    些: ["一些", "这些"],
    这: ["这里", "这个"],
    那: ["那里", "那个"],
    哪: ["哪里", "哪个"],
    每: ["每天", "每次"],
    很: ["很好", "很多"],
    太: ["太好了", "太大了"],
    不: ["不是", "不对"],
    有: ["有的", "有人"],
    在: ["在家", "在学校"],
    和: ["我和你", "你和他"],
    给: ["给你", "送给"],
    从: ["从前", "从来"],
    向: ["向前", "向上"]
  };

  const getDefaultFallbackPrompts = (ch) => {
    const pair = fallbackPromptMap[ch];
    if (Array.isArray(pair) && pair.length >= 2) return [pair[0], pair[1]];
    return [`${ch}字`, `写${ch}字`];
  };

  words.forEach((w) => {
    const chars = [...new Set([...String(w.text || "")])];
    for (const ch of chars) {
      if (!candidateMap.has(ch)) continue;
      candidateMap.get(ch).push(w);
    }
  });

  for (const [ch, list] of candidateMap.entries()) {
    const seen = new Set();
    const candidates = [];
    list.forEach((w) => {
      const text = String(w && w.text ? w.text : "").trim();
      if (!text || seen.has(text)) return;
      seen.add(text);
      candidates.push(w);
    });
    const ranked = candidates
      .map((w) => ({
        text: w.text,
        level: Number(w.level) || 0,
        len: [...w.text].length,
        score: scorePromptCandidate(ch, w)
      }))
      .sort((a, b) => b.score - a.score || a.level - b.level || a.len - b.len || a.text.localeCompare(b.text, "zh-Hans-CN"));

    const selected = [];
    const first = ranked[0];
    if (first && first.text) selected.push(first.text);

    if (ranked.length > 1) {
      let bestSecond = null;
      ranked.slice(1).forEach((item) => {
        const bonus = scorePromptDiversity(ch, selected[0], item.text);
        const mergedScore = item.score + bonus;
        if (!bestSecond || mergedScore > bestSecond.mergedScore) {
          bestSecond = { text: item.text, mergedScore, level: item.level, len: item.len };
        }
      });
      if (bestSecond && bestSecond.text && !selected.includes(bestSecond.text)) selected.push(bestSecond.text);
    }

    const [fallbackA, fallbackB] = getDefaultFallbackPrompts(ch);
    if (selected.length < 1 && fallbackA && !selected.includes(fallbackA)) selected.push(fallbackA);
    if (selected.length < 2 && fallbackB && !selected.includes(fallbackB)) selected.push(fallbackB);
    if (selected.length < 2) {
      const fallback = (CHAR_MAP.get(ch) && CHAR_MAP.get(ch).phrase) || `${ch}字`;
      if (!selected.includes(fallback)) selected.push(fallback);
    }
    map.set(ch, selected.slice(0, 2));
  }
  return map;
}

const state = {
  auth: { loggedIn: false, role: "", username: "", token: "", linkedParentUsername: "", linkedChildren: [] },
  flags: { recognitionV2Enabled: true },
  lang: "zh",
  lexiconOverrides: {},
  tab: "learn",
  level: "all",
  learnType: "char",
  learnIndex: 0,
  learnCharSearch: "",
  learnCharPage: 1,
  learnCharPageSize: 50,
  learnListLevelFilter: "all",
  learnListTypeFilter: "all",
  learnDictationCountFilter: "all",
  learnAccuracyFilter: "all",
  learnSelectedKeys: [],
  writeListSearch: "",
  writeListPage: 1,
  writeListPageSize: 50,
  writeSelectedChars: [],
  writeBatchPlaying: false,
  writeBatchToken: 0,
  learnRandomMode: false,
  learnAutoSpeak: false,
  reviewType: "char",
  reviewLevel: "all",
  reviewCount: "10",
  reviewWrongMixRatio: "30",
  reviewPreviewMode: "0",
  reviewSessionSource: "normal",
  reviewList: [],
  reviewIndex: 0,
  reviewActive: false,
  reviewFlowState: "idle",
  reviewAwaitingNext: false,
  reviewRetryState: { itemKey: "", attempt: 0, pendingIndexes: [], frozenWordResults: [] },
  reviewLastResult: null,
  reviewLastJudgeDisplay: { feedback: "", answer: "" },
  reviewSessionPointsEarned: 0,
  reviewSessionStartedAt: 0,
  reviewSessionFinishedAt: 0,
  reviewSessionTotal: 0,
  reviewSessionCorrect: 0,
  reviewSessionWrong: 0,
  reviewSessionWrongItems: [],
  reviewSettlementPoints: 0,
  reviewSettlementAnimated: false,
  reviewMessage: "请选择默写类型、等级和字数，然后点击“开始默写”。",
  recordsReportUser: "",
  recordsChartDays: 14,
  recordsJudgedDays: 7,
  recordsPage: 1,
  recordsPageSize: 10,
  progress: {},
  wrongBook: [],
  wrongLevelFilter: "all",
  wrongDictationCount: "10",
  rewards: { totalPoints: 0, weeklyPoints: 0, weeklyCorrect: 0, currentWeekKey: "", lastUpdatedAt: Date.now() },
  submissions: [],
  wrongQueue: [],
  dictationPad: null,
  dictationPads: [],
  writeRetryState: { itemKey: "", attempt: 0 },
  reviewPreviewTimer: null,
  reviewPreviewCountdownTimer: null,
  reviewPreviewToken: 0,
  reviewPreviewRunning: false,
  strokeWriter: null,
  strokeChar: "",
  refreshWriteCanvas: null,
  advanceTimer: null,
  syncTimer: null,
  reviewDraftActive: false,
  reviewSessionSnapshot: null,
  pendingSubmissionPayloads: [],
  adminWordReviewDrafts: {},
  adminOutcomeFilter: "all",
  adminWrongBookQueryUser: "",
  adminWrongBookItems: [],
  adminUsers: [],
  adminItemsTypeFilter: "all",
  adminItemsLevelFilter: "all",
  adminItemsSearch: "",
  adminItemsPage: 1,
  adminItemsPageSize: 50,
  adminItemsDrafts: {},
  adminItemsSaving: false,
  renderedTabs: {},
  learnRenderQueued: false,
  writeListRenderQueued: false,
  adminItemsRenderQueued: false,
  learnMetricsHtml: "",
  learnListHtml: "",
  writeListHtml: "",
  adminItemsListHtml: ""
};

function scheduleBackgroundTask(fn, timeout = 200) {
  if (typeof fn !== "function") return;
  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => fn(), { timeout });
    return;
  }
  window.setTimeout(fn, Math.min(timeout, 300));
}

function queueFrameRender(flagKey, renderFn) {
  if (state[flagKey]) return;
  state[flagKey] = true;
  window.requestAnimationFrame(() => {
    state[flagKey] = false;
    renderFn();
  });
}

function queueLearnCharListRender() {
  queueFrameRender("learnRenderQueued", renderLearnCharList);
}

function queueWriteCharListRender() {
  queueFrameRender("writeListRenderQueued", renderWriteCharList);
}

function queueAdminItemsPanelRender() {
  queueFrameRender("adminItemsRenderQueued", renderAdminItemsPanel);
}

function renderTabContent(tab, options = {}) {
  const currentTab = String(tab || state.tab || "learn");
  const force = Boolean(options.force);
  const wasRendered = Boolean(state.renderedTabs[currentTab]);
  if (wasRendered && !force) return;

  if (currentTab === "write") syncWriteListFromLearnSelection();
  if (currentTab === "write") updateWriteTarget(writeSelect && writeSelect.value ? writeSelect.value : (CHAR_ITEMS[0] && CHAR_ITEMS[0].text));
  if (currentTab === "admin") renderAdminPanel();
  if (currentTab === "admin-users") {
    renderAdminUsersPanel();
    if ((force || !wasRendered) && isSuperAdmin(state.auth.role)) fetchAdminUsers();
  }
  if (currentTab === "admin-wrong") renderAdminWrongBookPanel();
  if (currentTab === "admin-items") renderAdminItemsPanel();
  if (currentTab === "records") renderUserRecords();

  state.renderedTabs[currentTab] = true;
}

function warmHiddenTabs() {
  const queue = [];
  if (state.auth.role === "admin") queue.push("admin-users", "admin-wrong", "admin-items");
  else if (state.auth.role === "parent") queue.push("admin", "admin-wrong", "records");
  else if (state.auth.loggedIn) queue.push("write", "records");
  queue
    .filter((tab) => tab !== state.tab)
    .forEach((tab, index) => {
      scheduleBackgroundTask(() => renderTabContent(tab), 500 + index * 120);
    });
}

const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = {
  learn: document.getElementById("learn-panel"),
  write: document.getElementById("write-panel"),
  review: document.getElementById("review-panel"),
  wrong: document.getElementById("wrong-panel"),
  admin: document.getElementById("admin-panel"),
  "admin-users": document.getElementById("admin-users-panel"),
  "admin-wrong": document.getElementById("admin-wrong-panel"),
  "admin-items": document.getElementById("admin-items-panel"),
  records: document.getElementById("records-panel")
};
const authScreen = document.getElementById("auth-screen");
const appShell = document.getElementById("app-shell");
const authTabLogin = document.getElementById("auth-tab-login");
const authTabRegister = document.getElementById("auth-tab-register");
const authUsername = document.getElementById("auth-username");
const authPassword = document.getElementById("auth-password");
const authPasswordConfirmRow = document.getElementById("auth-password-confirm-row");
const authPasswordConfirm = document.getElementById("auth-password-confirm");
const authRoleRow = document.getElementById("auth-role-row");
const authRoleSelect = document.getElementById("auth-role-select");
const authParentUsernameRow = document.getElementById("auth-parent-username-row");
const authParentUsername = document.getElementById("auth-parent-username");
const authTogglePassword = document.getElementById("auth-toggle-password");
const authLogin = document.getElementById("auth-login");
const authRegister = document.getElementById("auth-register");
const authMsg = document.getElementById("auth-msg");
const userMenu = document.getElementById("user-menu");
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenuList = document.getElementById("user-menu-list");
const changePasswordBtn = document.getElementById("change-password-btn");
const logoutBtn = document.getElementById("logout-btn");
const userBadge = document.getElementById("user-badge");
const adminTab = document.getElementById("admin-tab");
const adminUsersTab = document.getElementById("admin-users-tab");
const adminWrongTab = document.getElementById("admin-wrong-tab");
const adminItemsTab = document.getElementById("admin-items-tab");
const recordsTab = document.getElementById("records-tab");
const adminCount = document.getElementById("admin-count");
const adminList = document.getElementById("admin-list");
const adminUserFilter = document.getElementById("admin-user-filter");
const adminTimeFilter = document.getElementById("admin-time-filter");
const adminOutcomeFilter = document.getElementById("admin-outcome-filter");
const adminFilterApply = document.getElementById("admin-filter-apply");
const adminWrongSearchUser = document.getElementById("admin-wrong-search-user");
const adminWrongSearch = document.getElementById("admin-wrong-search");
const adminWrongCount = document.getElementById("admin-wrong-count");
const adminWrongList = document.getElementById("admin-wrong-list");
const adminWrongMsg = document.getElementById("admin-wrong-msg");
const adminUsersCount = document.getElementById("admin-users-count");
const adminUsersRefresh = document.getElementById("admin-users-refresh");
const adminUsersMsg = document.getElementById("admin-users-msg");
const adminUsersList = document.getElementById("admin-users-list");
const adminItemsCount = document.getElementById("admin-items-count");
const adminItemsTypeFilter = document.getElementById("admin-items-type-filter");
const adminItemsLevelFilter = document.getElementById("admin-items-level-filter");
const adminItemsSearch = document.getElementById("admin-items-search");
const adminItemsPageSize = document.getElementById("admin-items-page-size");
const adminItemsSaveAll = document.getElementById("admin-items-save-all");
const adminItemsPrev = document.getElementById("admin-items-prev");
const adminItemsNext = document.getElementById("admin-items-next");
const adminItemsPageInfo = document.getElementById("admin-items-page-info");
const adminItemsMsg = document.getElementById("admin-items-msg");
const adminItemsList = document.getElementById("admin-items-list");
const recordsTargetRow = document.getElementById("records-target-row");
const recordsTargetSelect = document.getElementById("records-target-select");
const recordsJudgedDays = document.getElementById("records-judged-days");
const recordsReport = document.getElementById("records-report");
const recordsCount = document.getElementById("records-count");
const recordsList = document.getElementById("records-list");
const recordsStats = document.getElementById("records-stats");
const recordsDailyChart = document.getElementById("records-daily-chart");
const recordsPrev = document.getElementById("records-prev");
const recordsNext = document.getElementById("records-next");
const recordsPageInfo = document.getElementById("records-page-info");

const learnTabBtn = document.querySelector('.tab[data-tab="learn"]');
const writeTabBtn = document.querySelector('.tab[data-tab="write"]');
const reviewTabBtn = document.querySelector('.tab[data-tab="review"]');
const wrongTabBtn = document.querySelector('.tab[data-tab="wrong"]');

const levelFilter = document.getElementById("level-filter");
const learnTypeFilter = document.getElementById("learn-type-filter");
const learnChar = document.getElementById("learn-char");
const learnPinyin = document.getElementById("learn-pinyin");
const learnMeaning = document.getElementById("learn-meaning");
const learnProgress = document.getElementById("learn-progress");
const learnCharSearch = document.getElementById("learn-char-search");
const learnListLevelFilter = document.getElementById("learn-list-level-filter");
const learnListTypeFilter = document.getElementById("learn-list-type-filter");
const learnDictationCountFilter = document.getElementById("learn-dictation-count-filter");
const learnAccuracyFilter = document.getElementById("learn-accuracy-filter");
const learnResetFilters = document.getElementById("learn-reset-filters");
const learnCharList = document.getElementById("learn-char-list");
const learnListSummary = document.getElementById("learn-list-summary");
const learnMetricStrip = document.getElementById("learn-metric-strip");
const learnCharPageSize = document.getElementById("learn-char-page-size");
const learnCharPrev = document.getElementById("learn-char-prev");
const learnCharNext = document.getElementById("learn-char-next");
const learnCharPageInfo = document.getElementById("learn-char-page-info");
const learnSelectPage = document.getElementById("learn-select-page");
const learnClearSelected = document.getElementById("learn-clear-selected");
const learnDemoSelected = document.getElementById("learn-demo-selected");
const learnDictateSelected = document.getElementById("learn-dictate-selected");
const learnCard = document.getElementById("learn-card");

const writeSelect = document.getElementById("write-char-select");
const writePrevChar = document.getElementById("write-prev-char");
const writeNextChar = document.getElementById("write-next-char");
const targetChar = document.getElementById("target-char");
const targetMeta = document.getElementById("target-meta");
const targetPrompts = document.getElementById("target-prompts");
const writeFeedback = document.getElementById("write-feedback");
const strokeDemoPlay = document.getElementById("stroke-demo-play");
const strokeDemoReplay = document.getElementById("stroke-demo-replay");
const strokeDemo = document.getElementById("stroke-demo");
const strokeDemoMsg = document.getElementById("stroke-demo-msg");
const writeListSearch = document.getElementById("write-list-search");
const writeListPageSize = document.getElementById("write-list-page-size");
const writeListPrev = document.getElementById("write-list-prev");
const writeListNext = document.getElementById("write-list-next");
const writeListPageInfo = document.getElementById("write-list-page-info");
const writeListSummary = document.getElementById("write-list-summary");
const writeListSelectPage = document.getElementById("write-list-select-page");
const writeListClearSelected = document.getElementById("write-list-clear-selected");
const writeListPlaySelected = document.getElementById("write-list-play-selected");
const writeListStopPlay = document.getElementById("write-list-stop-play");
const writeCharList = document.getElementById("write-char-list");

const dueCount = document.getElementById("due-count");
const reviewTypeFilter = document.getElementById("review-type-filter");
const reviewLevelFilter = document.getElementById("review-level-filter");
const reviewCountFilter = document.getElementById("review-count-filter");
const reviewWrongMixFilter = document.getElementById("review-wrong-mix-filter");
const reviewPreviewFilter = document.getElementById("review-preview-filter");
const reviewBegin = document.getElementById("review-begin");
const reviewRestart = document.getElementById("review-restart");
const reviewPinyin = document.getElementById("review-pinyin");
const reviewMeaning = document.getElementById("review-meaning");
const reviewPreview = document.getElementById("review-preview");
const reviewPreviewTimer = document.getElementById("review-preview-timer");
const reviewPreviewTimeText = document.getElementById("review-preview-time-text");
const reviewPreviewProgressBar = document.getElementById("review-preview-progress-bar");
const reviewStageShell = document.getElementById("review-stage-shell");
const dictationWriterHost = document.getElementById("dictation-writer");
const reviewFeedback = document.getElementById("review-feedback");
const reviewAnswer = document.getElementById("review-answer");
const reviewStartBtn = document.getElementById("review-start");
const reviewResetBtn = document.getElementById("review-reset");
const reviewNextBtn = document.getElementById("review-next");
const reviewStopBtn = document.getElementById("review-stop");
const reviewSummaryCard = document.getElementById("review-summary-card");
const reviewSummaryText = document.getElementById("review-summary-text");
const reviewSummaryActions = document.getElementById("review-summary-actions");
const reviewSettleBtn = document.getElementById("review-settle-btn");
const reviewCard = document.getElementById("review-card");
const wordAnswerRow = document.getElementById("word-answer-row");
const wordReviewInput = document.getElementById("word-review-input");
const wordReviewSubmit = document.getElementById("word-review-submit");

const wrongCount = document.getElementById("wrong-count");
const wrongList = document.getElementById("wrong-list");
const wrongLevelFilters = document.getElementById("wrong-level-filters");
const wrongDictationCount = document.getElementById("wrong-dictation-count");
const clearWrongBtn = document.getElementById("clear-wrong");
const startWrongDictation = document.getElementById("start-wrong-dictation");

const statsText = document.getElementById("stats-text");
const rewardText = document.getElementById("reward-text");
const rewardPanel = rewardText && typeof rewardText.closest === "function" ? rewardText.closest(".top-reward") : null;
const pointsGainFx = document.getElementById("points-gain-fx");
const pointsFireworks = document.getElementById("points-fireworks");
const reviewStateModule = window.ReviewState || null;
const recognitionCore = window.RecognitionCore || null;

const SUPPORTED_LANGS = ["zh"];
const I18N = {
  zh: {
    "app.title": "HSK 汉字学习与书写复习",
    "lang.label": "语言",
    "auth.welcome": "欢迎使用",
    "auth.subtitle": "登录后开始汉字学习、书写练习与默写复习。",
    "auth.loginTab": "登录",
    "auth.registerTab": "注册",
    "auth.username": "用户名",
    "auth.password": "密码",
    "auth.confirmPassword": "确认密码",
    "auth.role": "账号角色",
    "auth.roleParent": "父母",
    "auth.roleChild": "孩子",
    "auth.parentUsername": "关联父母账号",
    "auth.usernamePlaceholder": "请输入用户名",
    "auth.passwordPlaceholder": "请输入密码",
    "auth.confirmPasswordPlaceholder": "请再次输入密码",
    "auth.parentUsernamePlaceholder": "请输入已注册父母账号用户名",
    "auth.showPassword": "显示密码",
    "auth.hidePassword": "隐藏密码",
    "auth.login": "登录",
    "auth.register": "注册账号",
    "auth.loggingIn": "登录中...",
    "auth.registering": "注册中...",
    "auth.enterUsernamePassword": "请输入用户名和密码。",
    "auth.fillAllFields": "请完整填写注册信息。",
    "auth.passwordNotMatch": "两次密码不一致。",
    "auth.needParentUsername": "孩子账号必须填写关联父母账号用户名。",
    "auth.registerSuccess": "注册成功，请点击“登录”进入系统。",
    "auth.loginFailed": "登录失败",
    "auth.registerFailed": "注册失败",
    "auth.loggedOut": "已退出登录。",
    "auth.needLogin": "请先登录后使用。",
    "top.changePassword": "修改密码",
    "top.logout": "退出登录",
    "top.roleAdmin": "管理员",
    "top.roleParent": "父母",
    "top.roleChild": "孩子",
    "top.linkedParent": "关联父母：{username}",
    "top.linkedChildrenCount": "关联孩子：{count} 个",
    "top.currentUser": "当前用户：{username}（{role}）",
    "top.notLoggedIn": "未登录",
    "nav.learn": "学习",
    "nav.write": "写字",
    "nav.review": "默写测验",
    "nav.wrong": "错题本",
    "review.stop": "停止默写",
    "review.stopConfirm": "停止后将取消本轮默写且数据不保存，是否继续？",
    "nav.records": "我的记录",
    "nav.adminReview": "默写判定审核",
    "nav.adminWrong": "错题本管理",
    "adminWrong.title": "错题本管理",
    "adminWrong.username": "用户名",
    "adminWrong.usernamePlaceholder": "输入用户名后查询",
    "adminWrong.search": "查询错题本",
    "adminWrong.count": "错题：{count} 条",
    "adminWrong.onlyAdmin": "仅管理员或父母可查看。",
    "adminWrong.promptQuery": "请输入用户名并点击“查询错题本”。",
    "adminWrong.empty": "该用户当前没有错题。",
    "adminWrong.delete": "删除",
    "adminWrong.enterUsername": "请输入用户名。",
    "adminWrong.queryOk": "已查询用户 {username} 的错题本。",
    "adminWrong.queryFailed": "查询失败",
    "adminWrong.deleted": "已删除：{text}",
    "adminWrong.deleteFailed": "删除失败",
    "adminWrong.confirmDelete": "确认从 {username} 的错题本删除「{text}」吗？"
  },
  en: {
    "app.title": "HSK Chinese Characters Study & Writing Review",
    "lang.label": "Language",
    "auth.welcome": "Welcome",
    "auth.subtitle": "Sign in to start learning characters, handwriting practice, and dictation review.",
    "auth.loginTab": "Login",
    "auth.registerTab": "Register",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.role": "Account Role",
    "auth.roleParent": "Parent",
    "auth.roleChild": "Child",
    "auth.parentUsername": "Linked Parent Account",
    "auth.usernamePlaceholder": "Enter username",
    "auth.passwordPlaceholder": "Enter password",
    "auth.confirmPasswordPlaceholder": "Enter password again",
    "auth.parentUsernamePlaceholder": "Enter an existing parent username",
    "auth.showPassword": "Show Password",
    "auth.hidePassword": "Hide Password",
    "auth.login": "Login",
    "auth.register": "Create Account",
    "auth.loggingIn": "Signing in...",
    "auth.registering": "Registering...",
    "auth.enterUsernamePassword": "Please enter username and password.",
    "auth.fillAllFields": "Please complete all registration fields.",
    "auth.passwordNotMatch": "Passwords do not match.",
    "auth.needParentUsername": "Child account must provide a linked parent username.",
    "auth.registerSuccess": "Registration successful. Please click Login to continue.",
    "auth.loginFailed": "Login failed",
    "auth.registerFailed": "Registration failed",
    "auth.loggedOut": "Logged out.",
    "auth.needLogin": "Please log in first.",
    "top.changePassword": "Change Password",
    "top.logout": "Log out",
    "top.roleAdmin": "Admin",
    "top.roleParent": "Parent",
    "top.roleChild": "Child",
    "top.linkedParent": "Linked parent: {username}",
    "top.linkedChildrenCount": "Linked children: {count}",
    "top.currentUser": "Current user: {username} ({role})",
    "top.notLoggedIn": "Not logged in",
    "nav.learn": "Learn",
    "nav.write": "Write",
    "nav.review": "Dictation",
    "nav.wrong": "Wrong Book",
    "review.stop": "Stop Dictation",
    "review.stopConfirm": "Stopping will cancel this dictation session and discard unsaved data. Continue?",
    "nav.records": "My Records",
    "nav.adminReview": "Dictation Review",
    "nav.adminWrong": "Wrong-Book Admin",
    "adminWrong.title": "Wrong-Book Management",
    "adminWrong.username": "Username",
    "adminWrong.usernamePlaceholder": "Enter username and query",
    "adminWrong.search": "Query Wrong Book",
    "adminWrong.count": "Wrong items: {count}",
    "adminWrong.onlyAdmin": "Admin or parent access only.",
    "adminWrong.promptQuery": "Enter a username and click Query Wrong Book.",
    "adminWrong.empty": "This user has no wrong items.",
    "adminWrong.delete": "Delete",
    "adminWrong.enterUsername": "Please enter a username.",
    "adminWrong.queryOk": "Loaded wrong-book items for {username}.",
    "adminWrong.queryFailed": "Query failed",
    "adminWrong.deleted": "Deleted: {text}",
    "adminWrong.deleteFailed": "Delete failed",
    "adminWrong.confirmDelete": "Remove \"{text}\" from {username}'s wrong book?"
  },
  fr: {
    "app.title": "HSK Étude des caractères chinois et révision d'écriture",
    "lang.label": "Langue",
    "auth.welcome": "Bienvenue",
    "auth.subtitle": "Connectez-vous pour apprendre les caractères, pratiquer l'écriture et faire des dictées.",
    "auth.loginTab": "Connexion",
    "auth.registerTab": "Inscription",
    "auth.username": "Nom d'utilisateur",
    "auth.password": "Mot de passe",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.role": "Rôle du compte",
    "auth.roleParent": "Parent",
    "auth.roleChild": "Enfant",
    "auth.parentUsername": "Compte parent lié",
    "auth.usernamePlaceholder": "Entrez le nom d'utilisateur",
    "auth.passwordPlaceholder": "Entrez le mot de passe",
    "auth.confirmPasswordPlaceholder": "Entrez encore le mot de passe",
    "auth.parentUsernamePlaceholder": "Entrez un nom d'utilisateur parent existant",
    "auth.showPassword": "Afficher",
    "auth.hidePassword": "Masquer",
    "auth.login": "Se connecter",
    "auth.register": "Créer un compte",
    "auth.loggingIn": "Connexion...",
    "auth.registering": "Inscription...",
    "auth.enterUsernamePassword": "Veuillez entrer le nom d'utilisateur et le mot de passe.",
    "auth.fillAllFields": "Veuillez remplir tous les champs d'inscription.",
    "auth.passwordNotMatch": "Les mots de passe ne correspondent pas.",
    "auth.needParentUsername": "Le compte enfant doit renseigner un compte parent lié.",
    "auth.registerSuccess": "Inscription réussie. Cliquez sur Connexion pour continuer.",
    "auth.loginFailed": "Échec de la connexion",
    "auth.registerFailed": "Échec de l'inscription",
    "auth.loggedOut": "Déconnecté.",
    "auth.needLogin": "Veuillez vous connecter d'abord.",
    "top.changePassword": "Changer le mot de passe",
    "top.logout": "Déconnexion",
    "top.roleAdmin": "Administrateur",
    "top.roleParent": "Parent",
    "top.roleChild": "Enfant",
    "top.linkedParent": "Parent lié : {username}",
    "top.linkedChildrenCount": "Enfants liés : {count}",
    "top.currentUser": "Utilisateur actuel : {username} ({role})",
    "top.notLoggedIn": "Non connecté",
    "nav.learn": "Apprendre",
    "nav.write": "Écrire",
    "nav.review": "Dictée",
    "nav.wrong": "Cahier d'erreurs",
    "review.stop": "Arrêter la dictée",
    "review.stopConfirm": "Arrêter annulera cette session de dictée et les données non enregistrées seront perdues. Continuer ?",
    "nav.records": "Mes records",
    "nav.adminReview": "Revue de dictée",
    "nav.adminWrong": "Gestion du cahier",
    "adminWrong.title": "Gestion du cahier d'erreurs",
    "adminWrong.username": "Nom d'utilisateur",
    "adminWrong.usernamePlaceholder": "Entrez le nom et lancez la recherche",
    "adminWrong.search": "Rechercher",
    "adminWrong.count": "Erreurs : {count}",
    "adminWrong.onlyAdmin": "Accès administrateur ou parent uniquement.",
    "adminWrong.promptQuery": "Entrez un nom d'utilisateur puis cliquez sur Rechercher.",
    "adminWrong.empty": "Cet utilisateur n'a aucune erreur.",
    "adminWrong.delete": "Supprimer",
    "adminWrong.enterUsername": "Veuillez entrer un nom d'utilisateur.",
    "adminWrong.queryOk": "Cahier d'erreurs chargé pour {username}.",
    "adminWrong.queryFailed": "Échec de la recherche",
    "adminWrong.deleted": "Supprimé : {text}",
    "adminWrong.deleteFailed": "Échec de la suppression",
    "adminWrong.confirmDelete": "Supprimer « {text} » du cahier d'erreurs de {username} ?"
  },
  es: {
    "app.title": "HSK Estudio de caracteres chinos y repaso de escritura",
    "lang.label": "Idioma",
    "auth.welcome": "Bienvenido",
    "auth.subtitle": "Inicia sesión para aprender caracteres, practicar escritura y repasar dictado.",
    "auth.loginTab": "Iniciar sesión",
    "auth.registerTab": "Registrarse",
    "auth.username": "Usuario",
    "auth.password": "Contraseña",
    "auth.confirmPassword": "Confirmar contraseña",
    "auth.role": "Rol de cuenta",
    "auth.roleParent": "Padre/Madre",
    "auth.roleChild": "Hijo/a",
    "auth.parentUsername": "Cuenta de padre/madre vinculada",
    "auth.usernamePlaceholder": "Ingresa usuario",
    "auth.passwordPlaceholder": "Ingresa contraseña",
    "auth.confirmPasswordPlaceholder": "Ingresa la contraseña de nuevo",
    "auth.parentUsernamePlaceholder": "Ingresa un usuario de padre/madre existente",
    "auth.showPassword": "Mostrar",
    "auth.hidePassword": "Ocultar",
    "auth.login": "Entrar",
    "auth.register": "Crear cuenta",
    "auth.loggingIn": "Iniciando...",
    "auth.registering": "Registrando...",
    "auth.enterUsernamePassword": "Ingresa usuario y contraseña.",
    "auth.fillAllFields": "Completa todos los campos de registro.",
    "auth.passwordNotMatch": "Las contraseñas no coinciden.",
    "auth.needParentUsername": "La cuenta infantil debe indicar un usuario de padre/madre vinculado.",
    "auth.registerSuccess": "Registro exitoso. Haz clic en Iniciar sesión para continuar.",
    "auth.loginFailed": "Error de inicio de sesión",
    "auth.registerFailed": "Error de registro",
    "auth.loggedOut": "Sesión cerrada.",
    "auth.needLogin": "Inicia sesión primero.",
    "top.changePassword": "Cambiar contraseña",
    "top.logout": "Cerrar sesión",
    "top.roleAdmin": "Administrador",
    "top.roleParent": "Padre/Madre",
    "top.roleChild": "Hijo/a",
    "top.linkedParent": "Padre/madre vinculado: {username}",
    "top.linkedChildrenCount": "Hijos vinculados: {count}",
    "top.currentUser": "Usuario actual: {username} ({role})",
    "top.notLoggedIn": "Sin iniciar sesión",
    "nav.learn": "Aprender",
    "nav.write": "Escribir",
    "nav.review": "Dictado",
    "nav.wrong": "Cuaderno de errores",
    "review.stop": "Detener dictado",
    "review.stopConfirm": "Detener cancelará esta sesión de dictado y no se guardarán los datos. ¿Continuar?",
    "nav.records": "Mis registros",
    "nav.adminReview": "Revisión de dictado",
    "nav.adminWrong": "Gestión de errores",
    "adminWrong.title": "Gestión del cuaderno de errores",
    "adminWrong.username": "Usuario",
    "adminWrong.usernamePlaceholder": "Ingresa usuario y consulta",
    "adminWrong.search": "Consultar",
    "adminWrong.count": "Errores: {count}",
    "adminWrong.onlyAdmin": "Solo administradores o padres/madres.",
    "adminWrong.promptQuery": "Ingresa un usuario y pulsa Consultar.",
    "adminWrong.empty": "Este usuario no tiene errores.",
    "adminWrong.delete": "Eliminar",
    "adminWrong.enterUsername": "Ingresa un usuario.",
    "adminWrong.queryOk": "Cuaderno de errores cargado para {username}.",
    "adminWrong.queryFailed": "Error de consulta",
    "adminWrong.deleted": "Eliminado: {text}",
    "adminWrong.deleteFailed": "Error al eliminar",
    "adminWrong.confirmDelete": "¿Eliminar \"{text}\" del cuaderno de errores de {username}?"
  }
};

function normalizeLang(lang) {
  return SUPPORTED_LANGS.includes(lang) ? lang : "zh";
}

function isLearnerRole(role) {
  return role === "parent" || role === "child" || role === "user";
}

function isManagerRole(role) {
  return role === "admin" || role === "parent";
}

function isSuperAdmin(role) {
  return role === "admin";
}

function canAccessReviewAudit(role) {
  return role === "parent";
}

function t(key, vars = {}) {
  const langPack = I18N[state.lang] || I18N.zh;
  const fallback = I18N.zh[key] || key;
  const template = langPack[key] || fallback;
  return String(template).replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? "" : String(vars[k])));
}

function updateAuthTogglePasswordLabel() {
  if (!authTogglePassword) return;
  authTogglePassword.textContent = authPassword.type === "password" ? t("auth.showPassword") : t("auth.hidePassword");
}

function translateStaticText() {
  document.title = t("app.title");
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : state.lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    el.setAttribute("placeholder", t(key));
  });
  updateAuthTogglePasswordLabel();
}

function refreshUserBadgeText() {
  if (!userBadge) return;
  if (!state.auth.loggedIn || !state.auth.username) {
    userBadge.textContent = t("top.notLoggedIn");
    return;
  }
  const roleLabel = getRoleLabel(state.auth.role);
  const extras = [];
  if (state.auth.role === "child" && state.auth.linkedParentUsername) {
    extras.push(t("top.linkedParent", { username: state.auth.linkedParentUsername }));
  }
  if (state.auth.role === "parent" && Array.isArray(state.auth.linkedChildren) && state.auth.linkedChildren.length > 0) {
    extras.push(t("top.linkedChildrenCount", { count: state.auth.linkedChildren.length }));
  }
  const suffix = extras.length ? ` · ${extras.join(" · ")}` : "";
  userBadge.textContent = `${t("top.currentUser", { username: state.auth.username, role: roleLabel })}${suffix}`;
}

function setUserMenuOpen(open) {
  const isOpen = Boolean(open);
  if (userMenuList) userMenuList.classList.toggle("hidden", !isOpen);
  if (userMenuToggle) userMenuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function toggleUserMenu() {
  if (!state.auth.loggedIn) return;
  const open = userMenuList ? userMenuList.classList.contains("hidden") : false;
  setUserMenuOpen(open);
}

function getRoleLabel(role) {
  if (role === "admin") return t("top.roleAdmin");
  if (role === "parent") return t("top.roleParent");
  return t("top.roleChild");
}

function setLanguage(lang, persist = true) {
  state.lang = normalizeLang(lang);
  translateStaticText();
  refreshUserBadgeText();
  renderAdminWrongBookPanel();
  renderAdminUsersPanel();
}

function loadProgress(username = state.auth.username) {
  return state.progress || {};
}

function loadWrongBook(username = state.auth.username) {
  return Array.isArray(state.wrongBook) ? state.wrongBook : [];
}

function loadRewards(username = state.auth.username) {
  return state.rewards || {
    totalPoints: 0,
    weeklyPoints: 0,
    weeklyCorrect: 0,
    currentWeekKey: "",
    lastUpdatedAt: Date.now()
  };
}

function loadReviewPrefs(username = state.auth.username) {
  const allowedMixRatios = new Set(["0", "10", "20", "30", "40", "50", "70", "100"]);
  const normalizeMixRatio = (value) => (allowedMixRatios.has(String(value)) ? String(value) : "30");
  const allowedPreview = new Set(["0", "all"]);
  const normalizePreview = (value) => (allowedPreview.has(String(value)) ? String(value) : "0");
  const allowedReviewCounts = new Set(["5", "10", "20", "50", "all"]);
  const normalizeReviewCount = (value) => (allowedReviewCounts.has(String(value)) ? String(value) : "10");
  return {
    reviewType: state.reviewType === "word" ? "word" : "char",
    reviewLevel: state.reviewLevel === "all" ? "all" : String(state.reviewLevel || "all"),
    reviewCount: normalizeReviewCount(state.reviewCount),
    reviewWrongMixRatio: normalizeMixRatio(state.reviewWrongMixRatio),
    reviewPreviewMode: normalizePreview(state.reviewPreviewMode)
  };
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

function normalizeReviewCount(value) {
  const allowedReviewCounts = new Set(["5", "10", "20", "50", "all"]);
  return allowedReviewCounts.has(String(value)) ? String(value) : "10";
}

function normalizeJudgeDetail(detail) {
  if (!detail || typeof detail !== "object") return null;
  const thresholds = detail.thresholds && typeof detail.thresholds === "object"
    ? {
        ...detail.thresholds,
        ...(Number.isFinite(Number(detail.thresholds.pass))
          ? { pass: Math.max(0, Math.min(1, Number(detail.thresholds.pass) || 0)) }
          : {}),
        ...(Number.isFinite(Number(detail.thresholds.retryLow))
          ? { retryLow: Math.max(0, Math.min(1, Number(detail.thresholds.retryLow) || 0)) }
          : {})
      }
    : null;
  const engines = detail.engines && typeof detail.engines === "object"
    ? {
        ...detail.engines,
        ...(Number.isFinite(Number(detail.engines.overlap))
          ? { overlap: Math.max(0, Math.min(1, Number(detail.engines.overlap) || 0)) }
          : {}),
        ...(Number.isFinite(Number(detail.engines.projection))
          ? { projection: Math.max(0, Math.min(1, Number(detail.engines.projection) || 0)) }
          : {}),
        ...(Number.isFinite(Number(detail.engines.grid))
          ? { grid: Math.max(0, Math.min(1, Number(detail.engines.grid) || 0)) }
          : {})
      }
    : null;
  return {
    ...detail,
    version: String(detail.version || "v2"),
    decision: ["pass", "fail", "retry"].includes(String(detail.decision)) ? String(detail.decision) : "fail",
    decisionScore: Math.max(0, Math.min(1, Number(detail.decisionScore) || 0)),
    baseScore: Math.max(0, Math.min(1, Number(detail.baseScore) || 0)),
    mlScore: Number.isFinite(detail.mlScore) ? Math.max(0, Math.min(1, Number(detail.mlScore))) : null,
    blendedScore: Math.max(0, Math.min(1, Number(detail.blendedScore) || 0)),
    tier: ["simple", "medium", "complex"].includes(String(detail.tier)) ? String(detail.tier) : "medium",
    thresholds,
    engines,
    retryAttempt: Math.max(0, Number(detail.retryAttempt) || 0),
    reason: String(detail.reason || "unknown")
  };
}

function normalizeSubmissionRow(row) {
  if (!row || typeof row !== "object") return row;
  return {
    ...row,
    accuracyPercent: normalizeAccuracyPercent(row.accuracyPercent),
    judgeDetail: normalizeJudgeDetail(row.judgeDetail),
    wordCharResults: Array.isArray(row.wordCharResults)
      ? row.wordCharResults.map((x) => ({
          ...x,
          accuracyPercent: normalizeAccuracyPercent(x && x.accuracyPercent),
          judgeDetail: normalizeJudgeDetail(x && x.judgeDetail)
        }))
      : row.wordCharResults
  };
}

function saveProgress() {
  if (state.reviewDraftActive) return;
  queueUserDataSync();
}

function saveWrongBook() {
  if (state.reviewDraftActive) return;
  queueUserDataSync();
}

function saveRewards() {
  if (state.reviewDraftActive) return;
  queueUserDataSync();
}

function saveReviewPrefs() {
  queueUserDataSync();
}

function saveSubmissions() {
  return;
}

function loadSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!parsed || !parsed.username || !parsed.role || !parsed.token) return null;
    parsed.linkedParentUsername = String(parsed.linkedParentUsername || "");
    parsed.linkedChildren = Array.isArray(parsed.linkedChildren) ? parsed.linkedChildren : [];
    return parsed;
  } catch {
    return null;
  }
}

function saveSession() {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      username: state.auth.username,
      role: state.auth.role,
      token: state.auth.token,
      loggedIn: state.auth.loggedIn,
      linkedParentUsername: state.auth.linkedParentUsername,
      linkedChildren: state.auth.linkedChildren
    })
  );
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.auth.token) headers.Authorization = `Bearer ${state.auth.token}`;
  const resp = await fetch(`${API_BASE}${path}`, { ...options, headers });
  let body = {};
  try {
    body = await resp.json();
  } catch {
    body = {};
  }
  if (!resp.ok || body.ok === false) {
    throw new Error(body.message || `请求失败(${resp.status})`);
  }
  return body;
}

function isOcrJudgeDetail(detail) {
  return !!(detail && (detail.ocrFirst === true || /paddleocr/i.test(String(detail.version || "")) || detail.engine));
}

function getJudgeSourceLabel(detail) {
  return isOcrJudgeDetail(detail) ? "OCR判定" : "本地判定";
}

function logOcrDebug(scope, payload) {
  try {
    console.debug(`[OCR] ${scope}`, payload);
  } catch {}
}

function setJudgeLoading(feedbackEl, buttonEl, text) {
  if (feedbackEl) {
    feedbackEl.textContent = text || "正在判定";
    feedbackEl.classList.add("is-loading");
  }
  if (buttonEl) {
    buttonEl.disabled = true;
    buttonEl.classList.add("is-loading");
    buttonEl.dataset.loadingText = buttonEl.dataset.loadingText || buttonEl.textContent || "";
  }
}

function clearJudgeLoading(feedbackEl, buttonEl) {
  if (feedbackEl) feedbackEl.classList.remove("is-loading");
  if (buttonEl) {
    buttonEl.disabled = false;
    buttonEl.classList.remove("is-loading");
  }
}

async function requestOcrJudge(payload) {
  const response = await apiRequest("/api/ocr/judge", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  logOcrDebug(`${payload.type === "word" ? "word" : "char"} ${payload.target}`, response);
  if (response && response.judgeDetail) response.judgeDetail = normalizeJudgeDetail(response.judgeDetail);
  return response;
}

function queueUserDataSync() {
  if (!state.auth.loggedIn || !state.auth.username || !isLearnerRole(state.auth.role)) return;
  if (state.syncTimer) clearTimeout(state.syncTimer);
  state.syncTimer = setTimeout(() => {
    state.syncTimer = null;
    syncUserDataToServer();
  }, 300);
}

function beginReviewDraftSession() {
  state.reviewDraftActive = true;
  state.reviewSessionSnapshot = {
    progress: JSON.parse(JSON.stringify(state.progress || {})),
    wrongBook: JSON.parse(JSON.stringify(state.wrongBook || [])),
    rewards: JSON.parse(JSON.stringify(state.rewards || {}))
  };
  state.pendingSubmissionPayloads = [];
}

function rollbackReviewDraftSession() {
  if (!state.reviewDraftActive || !state.reviewSessionSnapshot) return;
  state.progress = JSON.parse(JSON.stringify(state.reviewSessionSnapshot.progress || {}));
  state.wrongBook = JSON.parse(JSON.stringify(state.reviewSessionSnapshot.wrongBook || []));
  state.rewards = JSON.parse(JSON.stringify(state.reviewSessionSnapshot.rewards || {}));
  state.reviewDraftActive = false;
  state.reviewSessionSnapshot = null;
  state.pendingSubmissionPayloads = [];
  rebuildWrongQueue();
  refreshStats();
  refreshRewards();
  renderAdminPanel();
  renderUserRecords();
}

function endReviewDraftSession() {
  state.reviewDraftActive = false;
  state.reviewSessionSnapshot = null;
  state.pendingSubmissionPayloads = [];
}

function refreshReviewDraftSnapshotToCurrent() {
  if (!state.reviewDraftActive) return;
  state.reviewSessionSnapshot = {
    progress: JSON.parse(JSON.stringify(state.progress || {})),
    wrongBook: JSON.parse(JSON.stringify(state.wrongBook || [])),
    rewards: JSON.parse(JSON.stringify(state.rewards || {}))
  };
}

async function postSubmissionPayload(payload) {
  const resp = await apiRequest("/api/submissions", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  if (resp && resp.submission) state.submissions.unshift(normalizeSubmissionRow(resp.submission));
  renderLearnCharList();
}

function queueSubmissionPayload(payload) {
  if (!state.reviewDraftActive) beginReviewDraftSession();
  console.log("pending submission payload", payload);
  state.pendingSubmissionPayloads.push(payload);
  return Promise.resolve({ ok: true, queued: true });
}

async function commitReviewDraftSession(options = {}) {
  if (!state.reviewDraftActive) return;
  const shouldSyncUserData = options.syncUserData !== false;
  const pendingPayloads = Array.isArray(state.pendingSubmissionPayloads) ? [...state.pendingSubmissionPayloads] : [];
  let submittedCount = 0;
  for (const payload of pendingPayloads) {
    try {
      await postSubmissionPayload(payload);
      submittedCount += 1;
    } catch (err) {
      state.pendingSubmissionPayloads = pendingPayloads.slice(submittedCount);
      throw err;
    }
  }
  endReviewDraftSession();
  if (shouldSyncUserData) await syncUserDataToServer();
  renderAdminPanel();
  renderUserRecords();
  renderLearnCharList();
}

async function syncUserDataToServer() {
  if (!state.auth.loggedIn || !state.auth.username || !isLearnerRole(state.auth.role)) return;
  try {
    await apiRequest("/api/user-data", {
      method: "PUT",
      body: JSON.stringify({
        progress: state.progress,
        wrongBook: state.wrongBook,
        rewards: state.rewards,
        reviewPrefs: {
          reviewType: state.reviewType,
          reviewLevel: state.reviewLevel,
          reviewCount: state.reviewCount,
          reviewWrongMixRatio: state.reviewWrongMixRatio,
          reviewPreviewMode: state.reviewPreviewMode
        }
      })
    });
  } catch (err) {
    console.warn("sync user data failed:", err && err.message ? err.message : err);
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

function getWeekRangeLabel(weekKey) {
  if (!weekKey) return "-";
  const start = new Date(`${weekKey}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (x) => `${x.getMonth() + 1}/${x.getDate()}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

function ensureWeeklyRewards() {
  const nowWeekKey = getWeekKey();
  if (state.rewards.currentWeekKey === nowWeekKey) return;
  state.rewards.currentWeekKey = nowWeekKey;
  state.rewards.weeklyPoints = 0;
  state.rewards.weeklyCorrect = 0;
  state.rewards.lastUpdatedAt = Date.now();
  saveRewards();
}

let fireworksRaf = 0;
let fireworksToken = 0;
let fireworksParticles = [];

function isIpadLandscape() {
  const ua = String(navigator.userAgent || "");
  const platform = String(navigator.platform || "");
  const touchPoints = Number(navigator.maxTouchPoints || 0);
  const isiPad = /iPad/i.test(ua) || (platform === "MacIntel" && touchPoints > 1);
  return isiPad && window.matchMedia("(orientation: landscape)").matches;
}

function syncIpadLandscapeReviewScale() {
  if (!reviewStageShell || !document.body) return;
  const enabled = isIpadLandscape();
  document.body.classList.toggle("ipad-landscape-review-scale", enabled);
  if (!enabled) {
    reviewStageShell.style.setProperty("--review-stage-scale-offset", "0px");
    return;
  }
  window.requestAnimationFrame(() => {
    const naturalHeight = reviewStageShell.offsetHeight || 0;
    const visualHeight = reviewStageShell.getBoundingClientRect().height || 0;
    const offset = Math.min(0, Math.round(visualHeight - naturalHeight));
    reviewStageShell.style.setProperty("--review-stage-scale-offset", `${offset}px`);
  });
}

function scrollReviewCardToTopIfNeeded() {
  if (!reviewCard || !isIpadLandscape()) return;
  const prefersReducedMotion =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = prefersReducedMotion ? "auto" : "smooth";
  const scrollToCard = () => {
    const top = Math.max(0, window.scrollY + reviewCard.getBoundingClientRect().top);
    window.scrollTo({ top, behavior });
  };
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(scrollToCard);
  });
  window.setTimeout(scrollToCard, 120);
}

function stopPointsFireworks() {
  fireworksToken += 1;
  if (fireworksRaf) {
    cancelAnimationFrame(fireworksRaf);
    fireworksRaf = 0;
  }
  fireworksParticles = [];
  if (!pointsFireworks) return;
  const ctx = pointsFireworks.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, pointsFireworks.width, pointsFireworks.height);
  pointsFireworks.classList.remove("is-show");
}

function resizeFireworksCanvas() {
  if (!pointsFireworks) return { width: 0, height: 0 };
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = Math.max(1, Math.floor(window.innerWidth));
  const height = Math.max(1, Math.floor(window.innerHeight));
  pointsFireworks.width = Math.floor(width * dpr);
  pointsFireworks.height = Math.floor(height * dpr);
  pointsFireworks.style.width = `${width}px`;
  pointsFireworks.style.height = `${height}px`;
  const ctx = pointsFireworks.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function spawnCenterBurst(centerX, centerY, nowMs, strength = 1) {
  const colors = ["#8fd2ff", "#4aa3ff", "#c8e7ff", "#5be7ff", "#7cf7d4", "#ffd98a", "#ffffff"];
  const count = Math.round(42 + 22 * strength);
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.26;
    const speed = (1.45 + Math.random() * 3.1) * (0.66 + strength * 0.58);
    const life = 680 + Math.random() * 720;
    fireworksParticles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      prevX: centerX,
      prevY: centerY,
      life,
      bornAt: nowMs,
      size: 1 + Math.random() * 2.5,
      drag: 0.984 + Math.random() * 0.01,
      gravity: 0.05 + Math.random() * 0.05,
      twinkle: 0.7 + Math.random() * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function resolveEffectCenter(anchorEl, fallbackX, fallbackY) {
  if (!anchorEl || typeof anchorEl.getBoundingClientRect !== "function") {
    return { x: fallbackX, y: fallbackY };
  }
  const rect = anchorEl.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) return { x: fallbackX, y: fallbackY };
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

function runPointsFireworks(durationMs, anchorEl = null) {
  if (!pointsFireworks) return;
  stopPointsFireworks();
  pointsFireworks.classList.add("is-show");
  const { width, height } = resizeFireworksCanvas();
  if (!width || !height) return;
  const ctx = pointsFireworks.getContext("2d");
  if (!ctx) return;
  const startAt = performance.now();
  const token = ++fireworksToken;
  const center = resolveEffectCenter(anchorEl, width / 2, height / 2);
  const centerX = center.x;
  const centerY = center.y;
  const ringRadius = Math.max(32, Math.min(74, Math.min(width, height) * 0.06));
  const launchPlan = [
    { t: 10, s: 0.9, a: 0 },
    { t: 210, s: 1.05, a: 1.5 },
    { t: 460, s: 1.2, a: 3.1 },
    { t: 760, s: 1.3, a: 4.8 },
    { t: 1080, s: 1.08, a: 0.8 },
    { t: 1440, s: 0.92, a: 2.4 }
  ];
  let launchIdx = 0;
  let lastMs = startAt;

  const frame = (nowMs) => {
    if (token !== fireworksToken) return;
    const elapsed = nowMs - startAt;
    const dt = Math.max(0.008, Math.min(0.033, (nowMs - lastMs) / 1000));
    lastMs = nowMs;

    while (launchIdx < launchPlan.length && elapsed >= launchPlan[launchIdx].t) {
      const plan = launchPlan[launchIdx];
      const ox = Math.cos(plan.a) * ringRadius;
      const oy = Math.sin(plan.a) * (ringRadius * 0.7);
      spawnCenterBurst(centerX + ox, centerY + oy, nowMs, plan.s);
      launchIdx += 1;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    fireworksParticles = fireworksParticles.filter((p) => {
      const age = nowMs - p.bornAt;
      const k = 1 - age / p.life;
      if (k <= 0) return false;
      p.prevX = p.x;
      p.prevY = p.y;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx * 60 * dt;
      p.y += p.vy * 60 * dt;
      const twinkle = 0.82 + 0.18 * Math.sin((age / 120) * p.twinkle);
      const alpha = Math.max(0, Math.min(1, k * twinkle));
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = alpha * 0.2;
      ctx.lineWidth = Math.max(0.8, p.size * 0.52);
      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha * 0.86;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.62 + k * 0.62), 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    if (elapsed < durationMs || fireworksParticles.length > 0) {
      fireworksRaf = requestAnimationFrame(frame);
      return;
    }
    stopPointsFireworks();
  };

  fireworksRaf = requestAnimationFrame(frame);
}

function playPointsGainEffect(amount, title = "本次", anchorEl = null) {
  if (!pointsGainFx || !amount || amount <= 0) return;
  runPointsFireworks(POINTS_FX_MS, anchorEl);
  const center = resolveEffectCenter(anchorEl, window.innerWidth / 2, window.innerHeight / 2);
  pointsGainFx.style.left = `${center.x}px`;
  pointsGainFx.style.top = `${Math.max(24, center.y - 56)}px`;
  pointsGainFx.textContent = `${title} +${amount} 分`;
  pointsGainFx.classList.remove("is-show");
  // Force reflow so repeated gains retrigger animation.
  void pointsGainFx.offsetWidth;
  pointsGainFx.classList.add("is-show");
  setTimeout(() => {
    pointsGainFx.classList.remove("is-show");
  }, POINTS_FX_MS);
}

function addRewardDelta(pointsDelta, correctDelta = 0) {
  if ((!pointsDelta || pointsDelta <= 0) && (!correctDelta || correctDelta <= 0)) return;
  ensureWeeklyRewards();
  state.rewards.totalPoints += Math.max(0, Number(pointsDelta) || 0);
  state.rewards.weeklyPoints += Math.max(0, Number(pointsDelta) || 0);
  state.rewards.weeklyCorrect += Math.max(0, Number(correctDelta) || 0);
  state.rewards.lastUpdatedAt = Date.now();
  saveRewards();
  refreshRewards();
}

function addPoints(amount) {
  if (!amount || amount <= 0) return;
  addRewardDelta(amount, 1);
}

function refreshRewards() {
  ensureWeeklyRewards();
  rewardText.textContent = `本周积分 ${state.rewards.weeklyPoints}｜总积分 ${state.rewards.totalPoints} ｜ 周期 ${getWeekRangeLabel(state.rewards.currentWeekKey)}`;
}

async function loadUserData() {
  const boot = await apiRequest("/api/bootstrap");
  const flags = boot && boot.flags && typeof boot.flags === "object" ? boot.flags : {};
  state.flags.recognitionV2Enabled = flags.recognitionV2Enabled !== false;
  if (boot.user && typeof boot.user === "object") {
    state.auth.role = boot.user.role || state.auth.role;
    state.auth.linkedParentUsername = String(boot.user.linkedParentUsername || "");
    state.auth.linkedChildren = Array.isArray(boot.user.linkedChildren) ? boot.user.linkedChildren : [];
    refreshUserBadgeText();
    saveSession();
  }
  const data = boot.data || {};
  applyLexiconOverrides(boot.lexiconOverrides || {});
  state.adminWordReviewDrafts = {};
  state.submissions = Array.isArray(boot.submissions)
    ? boot.submissions.map((row) => normalizeSubmissionRow(row))
    : [];
  state.progress = data.progress && typeof data.progress === "object" ? data.progress : {};
  state.wrongBook = Array.isArray(data.wrongBook) ? data.wrongBook : [];
  state.rewards =
    data.rewards && typeof data.rewards === "object"
      ? data.rewards
      : { totalPoints: 0, weeklyPoints: 0, weeklyCorrect: 0, currentWeekKey: "", lastUpdatedAt: Date.now() };
  const prefs = data.reviewPrefs && typeof data.reviewPrefs === "object" ? data.reviewPrefs : {};
  state.learnType = "char";
  state.reviewType = prefs.reviewType === "word" ? "word" : "char";
  state.reviewLevel = prefs.reviewLevel === "all" ? "all" : String(prefs.reviewLevel || "all");
  state.reviewCount = normalizeReviewCount(prefs.reviewCount);
  state.reviewWrongMixRatio = String(prefs.reviewWrongMixRatio || "30");
  state.reviewPreviewMode = String(prefs.reviewPreviewMode || "0");
  const recordTargets = getRecordsTargetOptions();
  state.recordsReportUser = recordTargets.length ? recordTargets[0].username : "";
  rebuildWrongQueue();
  refreshStats();
  refreshRewards();
  initWriteSelect();
  initLevelFilter();
  initReviewSettings();
  renderLearnCard();
  renderLearnCharList();
  renderTabContent(state.tab, { force: true });
}

function renderWordCharResultsHtml(it, editable = false) {
  const wordResults = getWordCharResultsForRender(it);
  if (it.type !== "word" || !Array.isArray(wordResults) || wordResults.length === 0) return "";
  const blocks = wordResults
    .map((x, idx) => {
      const status = x.isGood ? "正确" : "错误";
      const source = getJudgeSourceLabel(x && x.judgeDetail);
      const img = x.handwritingImage ? `<img class="admin-img" src="${x.handwritingImage}" alt="词汇第${idx + 1}字手写图" />` : "";
      const toggle = editable
        ? `<div class="admin-char-row">
            <p class="admin-char-title">第${idx + 1}字「${x.char || "-"}」：${status} ｜ ${source}</p>
            <div class="actions">
              <button class="ghost admin-char-toggle ${x.isGood ? "is-good" : ""}" data-action="set-char-status" data-index="${idx}" data-value="true">判为正确</button>
              <button class="ghost admin-char-toggle ${!x.isGood ? "is-bad" : ""}" data-action="set-char-status" data-index="${idx}" data-value="false">判为错误</button>
            </div>
          </div>`
        : `<p>第${idx + 1}字「${x.char || "-"}」：${status} ｜ ${source}</p>`;
      return `<div class="word-char-result">${toggle}${img}</div>`;
    })
    .join("");
  const finalStatus = wordResults.every((x) => x.isGood) ? "正确" : "错误";
  return `<div class="word-char-results"><p class="word-char-summary">本词判定：${finalStatus} ｜ ${getJudgeSourceLabel(it && it.judgeDetail)}</p>${blocks}</div>`;
}

function ensureSubmissionWordCharResults(row) {
  if (!row || row.type !== "word") return;
  if (Array.isArray(row.wordCharResults) && row.wordCharResults.length > 0) return;
  const chars = [...String(row.target || "")];
  const legacyImages = String(row.handwritingImage || "")
    .split("||")
    .map((x) => x.trim())
    .filter(Boolean);
  row.wordCharResults = chars.map((ch, idx) => ({
    char: ch,
    isGood: Boolean(row.finalResult),
    accuracyPercent: 0,
    handwritingImage: legacyImages[idx] || "",
    judgeDetail: null
  }));
}

function getWordCharResultsForRender(row) {
  if (!row || row.type !== "word") return [];
  ensureSubmissionWordCharResults(row);
  const draft = state.adminWordReviewDrafts[row.id];
  if (Array.isArray(draft) && draft.length > 0) return draft;
  return row.wordCharResults || [];
}

function computeReviewOverrideMetrics(rows, nowTs = Date.now()) {
  const windowMs = 14 * 24 * 60 * 60 * 1000;
  const within14d = rows.filter((x) => nowTs - Number(x.createdAt || 0) <= windowMs);
  const reviewed = within14d.filter((x) => x && x.reviewedBy);
  const sample = reviewed.length;
  const flipped = reviewed.filter((x) => Boolean(x.systemResult) !== Boolean(x.finalResult)).length;
  const falseRejectOverride = reviewed.filter((x) => !x.systemResult && x.finalResult).length;
  const falseAcceptOverride = reviewed.filter((x) => x.systemResult && !x.finalResult).length;
  const toRate = (count) => (sample > 0 ? `${Math.round((count / sample) * 100)}%` : "-");
  return {
    sample,
    flipped,
    falseRejectOverride,
    falseAcceptOverride,
    flippedRateText: toRate(flipped),
    falseRejectRateText: toRate(falseRejectOverride),
    falseAcceptRateText: toRate(falseAcceptOverride)
  };
}

function matchesAdminOutcomeFilter(row, filterValue) {
  const system = Boolean(row && row.systemResult);
  const final = Boolean(row && row.finalResult);
  const filter = String(filterValue || "all");
  if (filter === "overturned") return system !== final;
  if (filter === "false-reject") return !system && final;
  if (filter === "false-accept") return system && !final;
  return true;
}

function renderAdminPanel() {
  if (!canAccessReviewAudit(state.auth.role)) {
    adminCount.textContent = "记录：0 条";
    adminList.innerHTML = "<p>仅父母可查看。</p>";
    return;
  }
  const keyword = "";
  const range = adminTimeFilter?.value || "all";
  const outcomeFilter = (adminOutcomeFilter && adminOutcomeFilter.value) || state.adminOutcomeFilter || "all";
  state.adminOutcomeFilter = outcomeFilter;
  if (adminOutcomeFilter) adminOutcomeFilter.value = outcomeFilter;
  const now = Date.now();
  const rangeMs = range === "7" ? 7 * 24 * 60 * 60 * 1000 : range === "30" ? 30 * 24 * 60 * 60 * 1000 : 0;

  const rows = state.submissions
    .filter((x) => x && x.username)
    .filter((x) => (keyword ? String(x.username).toLowerCase().includes(keyword) : true))
    .filter((x) => (rangeMs ? now - Number(x.createdAt || 0) <= rangeMs : true))
    .filter((x) => matchesAdminOutcomeFilter(x, outcomeFilter))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const metrics = computeReviewOverrideMetrics(state.submissions, now);
  const outcomeLabel =
    outcomeFilter === "overturned"
      ? "仅被复判推翻"
      : outcomeFilter === "false-reject"
        ? "仅误拒推翻"
        : outcomeFilter === "false-accept"
          ? "仅误收推翻"
          : "全部";
  adminCount.textContent =
    `记录：${rows.length} 条（${outcomeLabel}）｜ 近14天复判推翻率 ${metrics.flippedRateText}（样本 ${metrics.sample}）`;
  if (rows.length === 0) {
    adminList.innerHTML = "<p>暂无用户默写记录。</p>";
    return;
  }
  const metricsPanel = `<div class="admin-item">
      <p><strong>近14天复判统计</strong></p>
      <p>复判推翻率：${metrics.flippedRateText}（${metrics.flipped}/${metrics.sample || 0}）</p>
      <p>误拒推翻率（系统错判拒绝）：${metrics.falseRejectRateText}（${metrics.falseRejectOverride}/${metrics.sample || 0}）</p>
      <p>误收推翻率（系统错判通过）：${metrics.falseAcceptRateText}（${metrics.falseAcceptOverride}/${metrics.sample || 0}）</p>
    </div>`;
  adminList.innerHTML = metricsPanel + rows
    .map((it) => {
      ensureSubmissionWordCharResults(it);
      const displayWordResults = getWordCharResultsForRender(it);
      const status =
        it.type === "word" && displayWordResults.length > 0
          ? displayWordResults.every((x) => x.isGood)
            ? "正确"
            : "错误"
          : it.finalResult
            ? "正确"
            : "错误";
      const system = it.systemResult ? "正确" : "错误";
      const source = getJudgeSourceLabel(it.judgeDetail);
      const detail = it.type === "word" ? `逐字判定：${it.userAnswer || "-"}` : "";
      const img = it.type === "char" && it.handwritingImage ? `<img class=\"admin-img\" src=\"${it.handwritingImage}\" alt=\"手写图\" />` : "";
      const wordDetails = renderWordCharResultsHtml(it, true);
      const time = new Date(it.createdAt || Date.now()).toLocaleString();
      const actions =
        it.type === "word"
          ? `<button class="good" data-action="apply-char-review">保存本词判定</button>`
          : `<button class="good" data-action="mark-correct">判为正确</button>
             <button class="warn" data-action="mark-wrong">判为错误</button>`;
      return `<div class=\"admin-item\" data-id=\"${it.id}\">
        <p><strong>${it.username}</strong> · ${it.type === "word" ? "词汇" : "汉字"} · 目标：${it.target}</p>
        <p>系统判定：${system} ｜ 最终判定：${status} ｜ 来源：${source}</p>
        <p>时间：${time}</p>
        ${detail ? `<p>${detail}</p>` : ""}
        ${img}
        ${wordDetails}
        <div class=\"actions\">
          ${actions}
        </div>
      </div>`;
    })
    .join("");
}

function renderAdminWrongBookPanel() {
  if (!isManagerRole(state.auth.role)) {
    if (adminWrongCount) adminWrongCount.textContent = t("adminWrong.count", { count: 0 });
    if (adminWrongList) adminWrongList.innerHTML = `<p>${t("adminWrong.onlyAdmin")}</p>`;
    if (adminWrongMsg) adminWrongMsg.textContent = "";
    return;
  }
  const items = Array.isArray(state.adminWrongBookItems) ? state.adminWrongBookItems : [];
  if (adminWrongCount) adminWrongCount.textContent = t("adminWrong.count", { count: items.length });
  if (adminWrongSearchUser) adminWrongSearchUser.value = state.adminWrongBookQueryUser || "";
  if (!adminWrongList) return;
  if (!state.adminWrongBookQueryUser) {
    adminWrongList.innerHTML = `<p>${t("adminWrong.promptQuery")}</p>`;
    return;
  }
  if (!items.length) {
    adminWrongList.innerHTML = `<p>${t("adminWrong.empty")}</p>`;
    return;
  }
  adminWrongList.innerHTML = items
    .map((it) => {
      return `<div class="admin-item">
        <div class="admin-wrong-row">
          <p><strong>${it.text || "-"}</strong></p>
          <button class="warn" data-action="delete-wrong-item" data-type="${it.type || "char"}" data-text="${it.text || ""}">${t("adminWrong.delete")}</button>
        </div>
      </div>`;
    })
    .join("");
}

function getRecordsTargetOptions() {
  if (state.auth.role === "parent") {
    const linkedChildren = Array.isArray(state.auth.linkedChildren) ? state.auth.linkedChildren : [];
    return linkedChildren.map((username) => ({ username, label: username }));
  }
  if (state.auth.username) return [{ username: state.auth.username, label: state.auth.username }];
  return [];
}

function getRecordsTargetUsername() {
  const options = getRecordsTargetOptions();
  if (!options.length) return "";
  if (!options.some((item) => item.username === state.recordsReportUser)) {
    state.recordsReportUser = options[0].username;
  }
  return state.recordsReportUser;
}

function getSubmissionItemMeta(row) {
  if (!row || !row.target) return null;
  if (row.type === "word") return WORD_MAP.get(row.target) || null;
  return CHAR_MAP.get(row.target) || null;
}

function buildRecordAggregateMap(rows) {
  const map = new Map();
  rows.forEach((row) => {
    if (!row || !row.target || !row.type) return;
    const key = `${row.type}:${row.target}`;
    if (!map.has(key)) {
      const meta = getSubmissionItemMeta(row);
      map.set(key, {
        key,
        type: row.type,
        text: row.target,
        level: meta && meta.level ? Number(meta.level) : 1,
        attempts: 0,
        correct: 0,
        wrong: 0,
        accuracy: 0,
        lastResult: null,
        lastAt: 0
      });
    }
    const current = map.get(key);
    current.attempts += 1;
    current.correct += row.finalResult ? 1 : 0;
    current.wrong += row.finalResult ? 0 : 1;
    current.accuracy = current.attempts > 0 ? Math.round((current.correct / current.attempts) * 100) : 0;
    if (!current.lastAt || Number(row.createdAt || 0) > current.lastAt) {
      current.lastAt = Number(row.createdAt || 0);
      current.lastResult = Boolean(row.finalResult);
    }
  });
  return map;
}

function buildLevelMasteryStats(rows) {
  const aggregates = [...buildRecordAggregateMap(rows).values()];
  return [1, 2, 3, 4, 5, 6].map((level) => {
    const totalCount =
      CHAR_ITEMS.filter((item) => Number(item.level) === level).length + WORD_ITEMS.filter((item) => Number(item.level) === level).length;
    const levelItems = aggregates.filter((item) => Number(item.level) === level);
    const masteredCount = levelItems.filter((item) => item.accuracy >= 80 && item.attempts >= 2).length;
    const attemptedCount = levelItems.length;
    const masteryPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
    return { level, totalCount, attemptedCount, masteredCount, masteryPercent };
  });
}

function buildTrendSummary(rows) {
  const nowTs = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const recent = rows.filter((row) => nowTs - Number(row.createdAt || 0) <= 7 * dayMs);
  const previous = rows.filter((row) => {
    const gap = nowTs - Number(row.createdAt || 0);
    return gap > 7 * dayMs && gap <= 14 * dayMs;
  });
  const recentAcc = recent.length ? Math.round((recent.filter((row) => row.finalResult).length / recent.length) * 100) : 0;
  const previousAcc = previous.length ? Math.round((previous.filter((row) => row.finalResult).length / previous.length) * 100) : 0;
  const diff = recentAcc - previousAcc;
  let label = "趋势稳定";
  if (recent.length > 0 && previous.length === 0) label = "刚开始进入稳定练习期";
  else if (diff >= 10) label = "最近明显进步";
  else if (diff <= -10) label = "最近有退步，需要回炉";
  return {
    label,
    recentAcc,
    previousAcc,
    recentCount: recent.length,
    previousCount: previous.length,
    diff
  };
}

function renderRecordsReport(targetUsername, rows) {
  if (!recordsReport) return;
  if (!targetUsername) {
    recordsReport.innerHTML = "<p>当前没有可查看的报告对象。</p>";
    return;
  }
  const aggregates = [...buildRecordAggregateMap(rows).values()];
  const stableChars = aggregates
    .filter((item) => item.type === "char" && item.attempts >= 3 && item.accuracy >= 85 && item.lastResult)
    .sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts || b.lastAt - a.lastAt)
    .slice(0, 10);
  const weakWords = aggregates
    .filter((item) => item.type === "word" && item.wrong >= 2)
    .sort((a, b) => b.wrong - a.wrong || a.accuracy - b.accuracy || b.lastAt - a.lastAt)
    .slice(0, 8);
  const trend = buildTrendSummary(rows);
  const within30d = rows.filter((row) => Date.now() - Number(row.createdAt || 0) <= 30 * 24 * 60 * 60 * 1000);
  const monthlyAcc = within30d.length ? Math.round((within30d.filter((row) => row.finalResult).length / within30d.length) * 100) : 0;
  const levelStats = buildLevelMasteryStats(rows);

  recordsReport.innerHTML = `
    <div class="records-report-head">
      <div class="records-report-highlight">
        <p class="label">报告对象</p>
        <p class="value">${escapeHtmlAttr(targetUsername)}</p>
      </div>
      <div class="records-report-highlight">
        <p class="label">最近7天趋势</p>
        <p class="value">${escapeHtmlAttr(trend.label)}</p>
        <p class="meta">本周 ${trend.recentCount} 次 · ${trend.recentAcc}%${trend.previousCount ? `，较上周 ${trend.diff >= 0 ? "+" : ""}${trend.diff}%` : ""}</p>
      </div>
      <div class="records-report-highlight">
        <p class="label">最近30天</p>
        <p class="value">${within30d.length} 次 · ${monthlyAcc}%</p>
        <p class="meta">看月度节奏是否稳定</p>
      </div>
    </div>
    <div class="records-report-grid">
      <article class="records-report-card">
        <h3>稳定掌握的字</h3>
        <p class="report-subtitle">至少练过 3 次，正确率 85% 以上，最近一次也答对</p>
        <div class="records-chip-list">
          ${stableChars.length ? stableChars.map((item) => `<span class="records-chip">${escapeHtmlAttr(item.text)} · ${item.accuracy}%</span>`).join("") : "<p>还没有足够稳定的汉字，继续积累练习。</p>"}
        </div>
      </article>
      <article class="records-report-card">
        <h3>反复出错的词</h3>
        <p class="report-subtitle">错误至少 2 次，优先安排复习</p>
        <div class="records-chip-list">
          ${weakWords.length ? weakWords.map((item) => `<span class="records-chip is-warn">${escapeHtmlAttr(item.text)} · 错 ${item.wrong} 次</span>`).join("") : "<p>近期没有反复出错的词汇。</p>"}
        </div>
      </article>
    </div>
    <article class="records-report-card">
      <h3>HSK 各级掌握度</h3>
      <p class="report-subtitle">按全部学习项口径统计，已掌握 = 正确率 80% 以上且至少练过 2 次</p>
      <div class="records-level-grid">
        ${levelStats
          .map(
            (item) => `<div class="records-level-row">
              <div class="records-level-head">
                <span>HSK ${item.level}</span>
                <span>${item.masteredCount}/${item.totalCount} 项 · 已尝试 ${item.attemptedCount}</span>
              </div>
              <div class="records-level-track"><div class="records-level-bar" style="width:${item.masteryPercent}%"></div></div>
            </div>`
          )
          .join("")}
      </div>
    </article>
  `;
}

async function fetchAdminUsers() {
  if (!isSuperAdmin(state.auth.role)) return;
  try {
    const resp = await apiRequest("/api/admin/users");
    state.adminUsers = Array.isArray(resp.users) ? resp.users : [];
    if (adminUsersMsg) adminUsersMsg.textContent = "";
    renderAdminUsersPanel();
  } catch (err) {
    state.adminUsers = [];
    if (adminUsersMsg) adminUsersMsg.textContent = err && err.message ? err.message : "加载用户列表失败";
    renderAdminUsersPanel();
  }
}

function renderAdminUsersPanel() {
  if (!adminUsersList || !adminUsersCount) return;
  if (!isSuperAdmin(state.auth.role)) {
    adminUsersCount.textContent = "用户：0 个";
    adminUsersList.innerHTML = "<tr><td colspan=\"5\">仅管理员可查看。</td></tr>";
    if (adminUsersMsg) adminUsersMsg.textContent = "";
    return;
  }
  const users = Array.isArray(state.adminUsers) ? state.adminUsers : [];
  adminUsersCount.textContent = `用户：${users.length} 个`;
  if (!users.length) {
    adminUsersList.innerHTML = "<tr><td colspan=\"5\">暂无用户。</td></tr>";
    return;
  }
  adminUsersList.innerHTML = users
    .map((u) => {
      const role = String(u.role || "");
      const relation =
        role === "child"
          ? u.linkedParentUsername
            ? `父母：${u.linkedParentUsername}`
            : "-"
          : role === "parent"
            ? Array.isArray(u.linkedChildren) && u.linkedChildren.length > 0
              ? `孩子：${u.linkedChildren.join("、")}`
              : "-"
            : "-";
      const time = u.createdAt ? new Date(u.createdAt).toLocaleString() : "-";
      const canDelete = role !== "admin" && u.username !== state.auth.username;
      const canResetData = role !== "admin";
      return `<tr>
        <td>${escapeHtmlAttr(u.username || "-")}</td>
        <td>${escapeHtmlAttr(getRoleLabel(role))}</td>
        <td>${escapeHtmlAttr(relation)}</td>
        <td>${escapeHtmlAttr(time)}</td>
        <td>
          <button class="ghost" data-action="reset-user-data" data-username="${escapeHtmlAttr(u.username || "")}" ${canResetData ? "" : "disabled"}>清空数据</button>
          <button class="${canDelete ? "warn" : "ghost"}" data-action="delete-user" data-username="${escapeHtmlAttr(u.username || "")}" ${canDelete ? "" : "disabled"}>删除</button>
        </td>
      </tr>`;
    })
    .join("");
}

function getAdminEditableItems() {
  const merged = [...CHAR_ITEMS, ...WORD_ITEMS];
  const typeFilter = state.adminItemsTypeFilter || "all";
  const levelFilter = state.adminItemsLevelFilter || "all";
  const keyword = String(state.adminItemsSearch || "").trim().toLowerCase();
  return merged.filter((it) => {
    if (typeFilter !== "all" && it.type !== typeFilter) return false;
    if (levelFilter !== "all" && String(it.level) !== String(levelFilter)) return false;
    if (!keyword) return true;
    const [prompt1, prompt2] = getPromptPhrases(it);
    return (
      String(it.text || "").toLowerCase().includes(keyword) ||
      String(it.pinyin || "").toLowerCase().includes(keyword) ||
      String(it.meaning || "").toLowerCase().includes(keyword) ||
      String(prompt1 || "").toLowerCase().includes(keyword) ||
      String(prompt2 || "").toLowerCase().includes(keyword)
    );
  });
}

function parseAdminItemKey(key) {
  const raw = String(key || "");
  if (!raw.includes(":")) return null;
  const [typeRaw, ...rest] = raw.split(":");
  return {
    key: raw,
    type: typeRaw === "word" ? "word" : "char",
    text: rest.join(":")
  };
}

function getAdminItemByKey(key) {
  const parsed = parseAdminItemKey(key);
  if (!parsed || !parsed.text) return null;
  const item = parsed.type === "word" ? WORD_MAP.get(parsed.text) : CHAR_MAP.get(parsed.text);
  return item && item.type === parsed.type ? item : null;
}

function getAdminDraftValue(key, field, fallback) {
  const draft = state.adminItemsDrafts && state.adminItemsDrafts[key];
  if (draft && Object.prototype.hasOwnProperty.call(draft, field)) return String(draft[field] || "");
  return String(fallback || "");
}

function isAdminItemDirty(key, item) {
  if (!key || !item) return false;
  const [prompt1, prompt2] = getPromptPhrases(item);
  const pinyinValue = getAdminDraftValue(key, "pinyin", item.pinyin || "").trim();
  const prompt1Value = getAdminDraftValue(key, "prompt1", prompt1 || "").trim();
  const prompt2Value = getAdminDraftValue(key, "prompt2", prompt2 || "").trim();
  return pinyinValue !== String(item.pinyin || "").trim() || prompt1Value !== String(prompt1 || "").trim() || prompt2Value !== String(prompt2 || "").trim();
}

function setAdminDraftField(key, field, value) {
  if (!key || !["pinyin", "prompt1", "prompt2"].includes(field)) return;
  const item = getAdminItemByKey(key);
  if (!item) return;
  const nextDraft = { ...(state.adminItemsDrafts[key] || {}) };
  nextDraft[field] = String(value || "");
  state.adminItemsDrafts[key] = nextDraft;
}

function clearAdminDraft(key) {
  if (!key || !state.adminItemsDrafts[key]) return;
  const next = { ...state.adminItemsDrafts };
  delete next[key];
  state.adminItemsDrafts = next;
}

function buildAdminOverridePayload(key) {
  const parsed = parseAdminItemKey(key);
  const item = getAdminItemByKey(key);
  if (!parsed || !item) return null;
  const [prompt1, prompt2] = getPromptPhrases(item);
  return {
    type: parsed.type,
    text: parsed.text,
    pinyin: getAdminDraftValue(key, "pinyin", item.pinyin || "").trim(),
    prompt1: getAdminDraftValue(key, "prompt1", prompt1 || "").trim(),
    prompt2: getAdminDraftValue(key, "prompt2", prompt2 || "").trim()
  };
}

function getDirtyAdminItemKeys() {
  return Object.keys(state.adminItemsDrafts || {}).filter((key) => isAdminItemDirty(key, getAdminItemByKey(key)));
}

function refreshAdminItemsDirtyUi() {
  const dirtyKeys = getDirtyAdminItemKeys();
  const dirtySet = new Set(dirtyKeys);
  const dirtyCount = dirtyKeys.length;
  if (adminItemsSaveAll) {
    adminItemsSaveAll.disabled = state.adminItemsSaving || dirtyCount === 0;
    adminItemsSaveAll.textContent = dirtyCount > 0 ? `批量保存（${dirtyCount}）` : "批量保存";
  }
  if (!adminItemsList) return;
  const rows = adminItemsList.querySelectorAll("tr[data-admin-key]");
  rows.forEach((row) => {
    const key = String(row.getAttribute("data-admin-key") || "");
    const dirty = dirtySet.has(key);
    row.classList.toggle("is-dirty", dirty);
    const rowSaveBtn = row.querySelector("button[data-action='save-admin-item']");
    if (rowSaveBtn) rowSaveBtn.disabled = state.adminItemsSaving || !dirty;
  });
  if (adminItemsMsg && !state.adminItemsSaving) {
    adminItemsMsg.textContent = dirtyCount > 0 ? `当前有 ${dirtyCount} 项未保存修改` : "";
  }
}

async function saveAdminItemOverrideByKey(key) {
  const payload = buildAdminOverridePayload(key);
  if (!payload || !payload.text) throw new Error("无效学习项");
  const resp = await apiRequest("/api/admin/learning-item-override", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  clearAdminDraft(key);
  return resp;
}

function escapeHtmlAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatLocalDateKey(timestamp) {
  const date = new Date(Number(timestamp) || Date.now());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthDayLabel(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-");
  if (!year || !month || !day) return dateKey || "-";
  return `${month}-${day}`;
}

function isSubmissionJudged(row) {
  if (!row || typeof row !== "object") return false;
  if (row.reviewedBy || Number(row.reviewedAt) > 0) return true;
  if (Object.prototype.hasOwnProperty.call(row, "finalResult")) return true;
  if (Object.prototype.hasOwnProperty.call(row, "systemResult")) return true;
  if (row.judgeDetail) return true;
  if (Array.isArray(row.wordCharResults) && row.wordCharResults.length > 0) return true;
  return false;
}

function filterJudgedRowsByDays(rows, days) {
  const safeDays = [1, 3, 7].includes(Number(days)) ? Number(days) : 7;
  const nowTs = Date.now();
  const windowMs = safeDays * 24 * 60 * 60 * 1000;
  return (Array.isArray(rows) ? rows : []).filter(
    (row) => isSubmissionJudged(row) && nowTs - Number(row.createdAt || 0) <= windowMs
  );
}

function buildDailyPracticeSeries(rows, days = 14) {
  const safeDays = Math.max(1, Number(days) || 14);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const judgedRows = Array.isArray(rows) ? rows.filter((row) => isSubmissionJudged(row)) : [];
  const buckets = [];
  const map = new Map();

  for (let index = safeDays - 1; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - index);
    const key = formatLocalDateKey(date.getTime());
    const bucket = { dateKey: key, total: 0, correct: 0, wrong: 0 };
    buckets.push(bucket);
    map.set(key, bucket);
  }

  judgedRows.forEach((row) => {
    const key = formatLocalDateKey(row && row.createdAt);
    const bucket = map.get(key);
    if (!bucket) return;
    bucket.total += 1;
    if (row.finalResult) bucket.correct += 1;
    else bucket.wrong += 1;
  });

  return buckets.map((bucket) => ({
    ...bucket,
    accuracy: bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0
  }));
}

function renderDailyPracticeChart(rows) {
  if (!recordsDailyChart) return;
  const days = [7, 14, 30].includes(Number(state.recordsChartDays)) ? Number(state.recordsChartDays) : 14;
  const series = buildDailyPracticeSeries(rows, days);
  const activeDays = series.filter((item) => item.total > 0).length;
  const totalAttempts = series.reduce((sum, item) => sum + item.total, 0);
  const maxCount = Math.max(1, ...series.map((item) => item.total));
  const dayButtons = [7, 14, 30]
    .map(
      (value) =>
        `<button type="button" class="ghost records-chart-range-btn${value === days ? " is-active" : ""}" data-range="${value}">${value}天</button>`
    )
    .join("");

  if (totalAttempts === 0) {
    recordsDailyChart.innerHTML = `
      <div class="records-chart-head">
        <div>
          <h3>每日练习图表</h3>
          <p>最近 ${days} 天还没有已判定记录。</p>
        </div>
        <div class="records-chart-range" role="group" aria-label="练习图表时间范围">${dayButtons}</div>
      </div>
      <p class="records-chart-empty">完成判定后，这里会按天显示练习次数和正确率。</p>
    `;
    return;
  }

  recordsDailyChart.innerHTML = `
    <div class="records-chart-head">
      <div>
        <h3>每日练习图表</h3>
        <p>最近 ${days} 天已判定 ${totalAttempts} 次，有记录的天数 ${activeDays} 天。</p>
      </div>
      <div class="records-chart-head-side">
        <div class="records-chart-range" role="group" aria-label="练习图表时间范围">${dayButtons}</div>
        <div class="records-chart-legend">
          <span><i class="records-chart-dot is-total"></i>练习次数</span>
          <span><i class="records-chart-dot is-accuracy"></i>正确率</span>
        </div>
      </div>
    </div>
    <div class="records-chart-bars" style="--records-chart-cols:${series.length}">
      ${series
        .map((item) => {
          const height = `${Math.max(item.total > 0 ? 14 : 4, (item.total / maxCount) * 100)}%`;
          const accuracyText = item.total > 0 ? `${item.accuracy}%` : "-";
          const summary = `${item.dateKey}：练习 ${item.total} 次，正确 ${item.correct} 次，错误 ${item.wrong} 次，正确率 ${accuracyText}`;
          return `<div class="records-chart-col" title="${escapeHtmlAttr(summary)}" aria-label="${escapeHtmlAttr(summary)}">
            <p class="records-chart-value">${item.total}</p>
            <div class="records-chart-bar-wrap">
              <div class="records-chart-bar" style="height:${height}"></div>
            </div>
            <p class="records-chart-accuracy">${accuracyText}</p>
            <p class="records-chart-date">${formatMonthDayLabel(item.dateKey)}</p>
          </div>`;
        })
        .join("")}
    </div>
  `;
}

function renderAdminItemsPanel() {
  if (!adminItemsList || !adminItemsCount) return;
  if (state.auth.role !== "admin") {
    adminItemsCount.textContent = "项目：0 条";
    const deniedHtml = "<tr><td colspan=\"7\">仅管理员可查看。</td></tr>";
    if (state.adminItemsListHtml !== deniedHtml) {
      adminItemsList.innerHTML = deniedHtml;
      state.adminItemsListHtml = deniedHtml;
    }
    if (adminItemsMsg) adminItemsMsg.textContent = "";
    return;
  }

  const levels = [...new Set([...CHAR_ITEMS, ...WORD_ITEMS].map((it) => Number(it.level) || 1))].sort((a, b) => a - b);
  if (adminItemsLevelFilter) {
    const levelOptions = [`<option value="all">全部</option>`, ...levels.map((lv) => `<option value="${lv}">HSK ${lv}</option>`)].join("");
    if (adminItemsLevelFilter.innerHTML !== levelOptions) adminItemsLevelFilter.innerHTML = levelOptions;
    adminItemsLevelFilter.value = state.adminItemsLevelFilter || "all";
  }
  if (adminItemsTypeFilter) adminItemsTypeFilter.value = state.adminItemsTypeFilter || "all";
  if (adminItemsSearch) adminItemsSearch.value = state.adminItemsSearch || "";

  const all = getAdminEditableItems();
  const pageSize = Math.max(1, Number(state.adminItemsPageSize) || 50);
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  state.adminItemsPage = Math.max(1, Math.min(state.adminItemsPage, totalPages));
  const start = (state.adminItemsPage - 1) * pageSize;
  const pageItems = all.slice(start, start + pageSize);
  adminItemsCount.textContent = `项目：${all.length} 条`;
  if (adminItemsPageSize) adminItemsPageSize.value = String(pageSize);
  if (adminItemsPageInfo) adminItemsPageInfo.textContent = `第 ${state.adminItemsPage} / ${totalPages} 页`;
  if (adminItemsPrev) adminItemsPrev.disabled = state.adminItemsPage <= 1;
  if (adminItemsNext) adminItemsNext.disabled = state.adminItemsPage >= totalPages;

  if (!pageItems.length) {
    const emptyHtml = "<tr><td colspan=\"7\">没有匹配项目。</td></tr>";
    if (state.adminItemsListHtml !== emptyHtml) {
      adminItemsList.innerHTML = emptyHtml;
      state.adminItemsListHtml = emptyHtml;
    }
    refreshAdminItemsDirtyUi();
    return;
  }

  const listHtml = pageItems
    .map((it) => {
      const [prompt1, prompt2] = getPromptPhrases(it);
      const key = `${it.type}:${it.text}`;
      const dirty = isAdminItemDirty(key, it);
      const pinyinValue = getAdminDraftValue(key, "pinyin", it.pinyin || "");
      const prompt1Value = getAdminDraftValue(key, "prompt1", prompt1 || "");
      const prompt2Value = getAdminDraftValue(key, "prompt2", prompt2 || "");
      return `<tr data-admin-key="${escapeHtmlAttr(key)}" class="${dirty ? "is-dirty" : ""}">
        <td class="${it.type === "char" ? "char-cell" : ""}">${it.text}</td>
        <td>${it.type === "word" ? "词汇" : "汉字"}</td>
        <td>${it.level}</td>
        <td><input data-admin-item="pinyin" data-key="${key}" value="${escapeHtmlAttr(pinyinValue)}" /></td>
        <td><input data-admin-item="prompt1" data-key="${key}" value="${escapeHtmlAttr(prompt1Value)}" /></td>
        <td><input data-admin-item="prompt2" data-key="${key}" value="${escapeHtmlAttr(prompt2Value)}" /></td>
        <td><button class="good" data-action="save-admin-item" data-key="${key}" ${state.adminItemsSaving || !dirty ? "disabled" : ""}>保存</button></td>
      </tr>`;
    })
    .join("");
  if (state.adminItemsListHtml !== listHtml) {
    adminItemsList.innerHTML = listHtml;
    state.adminItemsListHtml = listHtml;
  }
  refreshAdminItemsDirtyUi();
}

async function queryAdminWrongBook(username) {
  const name = String(username || "").trim();
  if (!name) {
    if (adminWrongMsg) adminWrongMsg.textContent = t("adminWrong.enterUsername");
    return;
  }
  try {
    const resp = await apiRequest(`/api/admin/users/${encodeURIComponent(name)}/wrong-book`);
    state.adminWrongBookQueryUser = name;
    state.adminWrongBookItems = Array.isArray(resp.wrongBook) ? resp.wrongBook : [];
    if (adminWrongMsg) adminWrongMsg.textContent = t("adminWrong.queryOk", { username: name });
    renderAdminWrongBookPanel();
  } catch (err) {
    state.adminWrongBookQueryUser = "";
    state.adminWrongBookItems = [];
    if (adminWrongMsg) adminWrongMsg.textContent = err && err.message ? err.message : t("adminWrong.queryFailed");
    renderAdminWrongBookPanel();
  }
}

function renderUserRecords() {
  if (!state.auth.username || !isLearnerRole(state.auth.role)) {
    recordsCount.textContent = "记录：0 条";
    if (recordsTargetRow) recordsTargetRow.classList.add("hidden");
    if (recordsReport) recordsReport.innerHTML = "<p>仅父母或孩子可查看学习报告。</p>";
    recordsStats.innerHTML = "<p>仅父母或孩子可查看自己的统计。</p>";
    if (recordsDailyChart) recordsDailyChart.innerHTML = "<p>仅父母或孩子可查看每日练习图表。</p>";
    recordsList.innerHTML = "<p>仅父母或孩子可查看自己的记录。</p>";
    if (recordsPageInfo) recordsPageInfo.textContent = "第 1 / 1 页";
    if (recordsPrev) recordsPrev.disabled = true;
    if (recordsNext) recordsNext.disabled = true;
    return;
  }
  const options = getRecordsTargetOptions();
  if (recordsTargetRow) recordsTargetRow.classList.toggle("hidden", !(state.auth.role === "parent" && options.length > 0));
  if (recordsTargetSelect && state.auth.role === "parent") {
    const nextOptions = options.map((item) => `<option value="${escapeHtmlAttr(item.username)}">${escapeHtmlAttr(item.label)}</option>`).join("");
    if (recordsTargetSelect.innerHTML !== nextOptions) recordsTargetSelect.innerHTML = nextOptions;
  }
  const targetUsername = getRecordsTargetUsername();
  if (recordsTargetSelect && targetUsername) recordsTargetSelect.value = targetUsername;
  if (state.auth.role === "parent" && !targetUsername) {
    recordsCount.textContent = "记录：0 条";
    if (recordsReport) recordsReport.innerHTML = "<p>当前父母账号还没有关联孩子，暂时无法生成学习报告。</p>";
    recordsStats.innerHTML = "<p>关联孩子后可查看周报/月报。</p>";
    if (recordsDailyChart) recordsDailyChart.innerHTML = "<p>关联孩子后可查看每日练习图表。</p>";
    recordsList.innerHTML = "<p>暂无可展示记录。</p>";
    if (recordsPageInfo) recordsPageInfo.textContent = "第 1 / 1 页";
    if (recordsPrev) recordsPrev.disabled = true;
    if (recordsNext) recordsNext.disabled = true;
    return;
  }
  const rows = state.submissions
    .filter((x) => x && x.username === targetUsername)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  renderRecordsReport(targetUsername, rows);
  renderUserRecordStats(rows);
  renderDailyPracticeChart(rows);
  const judgedDays = [1, 3, 7].includes(Number(state.recordsJudgedDays)) ? Number(state.recordsJudgedDays) : 7;
  const judgedRows = filterJudgedRowsByDays(rows, judgedDays);
  recordsCount.textContent = `${targetUsername} 的判定记录：${judgedRows.length} 条（近${judgedDays}天）`;
  const pageSize = Math.max(1, Number(state.recordsPageSize) || 10);
  const totalPages = Math.max(1, Math.ceil(judgedRows.length / pageSize));
  state.recordsPage = Math.max(1, Math.min(Number(state.recordsPage) || 1, totalPages));
  const start = (state.recordsPage - 1) * pageSize;
  const pageRows = judgedRows.slice(start, start + pageSize);
  if (recordsPageInfo) recordsPageInfo.textContent = `第 ${state.recordsPage} / ${totalPages} 页`;
  if (recordsPrev) recordsPrev.disabled = state.recordsPage <= 1;
  if (recordsNext) recordsNext.disabled = state.recordsPage >= totalPages;
  if (recordsJudgedDays) recordsJudgedDays.value = String(judgedDays);
  if (judgedRows.length === 0) {
    recordsList.innerHTML = `<p>${escapeHtmlAttr(targetUsername)} 近 ${judgedDays} 天还没有判定记录。</p>`;
    return;
  }
  recordsList.innerHTML = pageRows
    .map((it) => {
      ensureSubmissionWordCharResults(it);
      const status = it.finalResult ? "正确" : "错误";
      const system = it.systemResult ? "正确" : "错误";
      const source = getJudgeSourceLabel(it.judgeDetail);
      const reviewed = it.reviewedBy ? `（审核人 ${it.reviewedBy} 已复判）` : "";
      const detail = it.type === "word" ? `逐字判定：${it.userAnswer || "-"}` : "";
      const img = it.type === "char" && it.handwritingImage ? `<img class=\"admin-img\" src=\"${it.handwritingImage}\" alt=\"手写图\" />` : "";
      const wordDetails = renderWordCharResultsHtml(it, false);
      const time = new Date(it.createdAt || Date.now()).toLocaleString();
      return `<div class=\"admin-item\">
        <p>${it.type === "word" ? "词汇" : "汉字"} · 目标：${it.target}</p>
        <p>系统判定：${system} ｜ 最终判定：${status} ｜ 来源：${source}${reviewed}</p>
        <p>时间：${time}</p>
        ${detail ? `<p>${detail}</p>` : ""}
        ${img}
        ${wordDetails}
      </div>`;
    })
    .join("");
}

function renderUserRecordStats(rows) {
  const total = rows.length;
  const correct = rows.filter((x) => x.finalResult).length;
  const wrong = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const charRows = rows.filter((x) => x.type === "char");
  const wordRows = rows.filter((x) => x.type === "word");
  const charCorrect = charRows.filter((x) => x.finalResult).length;
  const wordCorrect = wordRows.filter((x) => x.finalResult).length;
  const charAccuracy = charRows.length > 0 ? Math.round((charCorrect / charRows.length) * 100) : 0;
  const wordAccuracy = wordRows.length > 0 ? Math.round((wordCorrect / wordRows.length) * 100) : 0;

  const nowTs = Date.now();
  const within7d = rows.filter((x) => nowTs - Number(x.createdAt || 0) <= 7 * 24 * 60 * 60 * 1000);
  const within30d = rows.filter((x) => nowTs - Number(x.createdAt || 0) <= 30 * 24 * 60 * 60 * 1000);
  const within7dCorrect = within7d.filter((x) => x.finalResult).length;
  const within30dCorrect = within30d.filter((x) => x.finalResult).length;
  const acc7d = within7d.length > 0 ? Math.round((within7dCorrect / within7d.length) * 100) : 0;
  const acc30d = within30d.length > 0 ? Math.round((within30dCorrect / within30d.length) * 100) : 0;

  const latestTs = rows[0] && rows[0].createdAt ? Number(rows[0].createdAt) : 0;
  const latestText = latestTs ? new Date(latestTs).toLocaleString() : "-";
  recordsStats.innerHTML = [
    { label: "总默写次数", value: `${total}` },
    { label: "总正确率", value: `${accuracy}%` },
    { label: "正确 / 错误", value: `${correct} / ${wrong}` },
    { label: "汉字正确率", value: `${charAccuracy}% (${charCorrect}/${charRows.length})` },
    { label: "词汇正确率", value: `${wordAccuracy}% (${wordCorrect}/${wordRows.length})` },
    { label: "最近7天", value: `${within7d.length} 次 · ${acc7d}%` },
    { label: "最近30天", value: `${within30d.length} 次 · ${acc30d}%` },
    { label: "最近一次默写", value: latestText }
  ]
    .map((it) => `<div class="records-stat"><p class="label">${it.label}</p><p class="value">${it.value}</p></div>`)
    .join("");
}

function updateUserRewardsFromReview(username, pointsDelta, correctDelta) {
  return { username, pointsDelta, correctDelta };
}

function updateUserWrongBookFromReview(username, row, isCorrect) {
  return { username, row, isCorrect };
}

async function setAuthState(username, role, token, profile = {}) {
  state.auth.username = username;
  state.auth.role = role;
  state.auth.token = token;
  state.auth.linkedParentUsername = String(profile.linkedParentUsername || "");
  state.auth.linkedChildren = Array.isArray(profile.linkedChildren) ? profile.linkedChildren : [];
  state.auth.loggedIn = true;
  state.renderedTabs = {};
  saveSession();
  authScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  refreshUserBadgeText();
  const manager = isManagerRole(role);
  const superAdmin = isSuperAdmin(role);
  const reviewAuditor = canAccessReviewAudit(role);
  rewardText.classList.toggle("hidden", manager);
  statsText.classList.toggle("hidden", manager);
  learnTabBtn.classList.toggle("hidden", manager);
  writeTabBtn.classList.toggle("hidden", manager);
  reviewTabBtn.classList.toggle("hidden", manager);
  wrongTabBtn.classList.toggle("hidden", manager);
  recordsTab.classList.toggle("hidden", role === "admin");
  adminTab.classList.toggle("hidden", !reviewAuditor);
  if (adminUsersTab) adminUsersTab.classList.toggle("hidden", !superAdmin);
  if (adminWrongTab) adminWrongTab.classList.toggle("hidden", !manager);
  if (adminItemsTab) adminItemsTab.classList.toggle("hidden", !superAdmin);
  if (!manager && (state.tab === "admin" || state.tab === "admin-users" || state.tab === "admin-wrong" || state.tab === "admin-items")) {
    state.tab = "learn";
  }
  if (!reviewAuditor && state.tab === "admin") {
    state.tab = superAdmin ? "admin-users" : "admin-wrong";
  }
  if (reviewAuditor) switchTab("admin");
  else if (superAdmin) switchTab("admin-users");
  else if (manager) switchTab("admin-wrong");
  else switchTab("learn");
  await loadUserData();
  renderReviewCard();
  warmHiddenTabs();
}

async function handleChangePassword() {
  if (!state.auth.loggedIn) return;
  const currentPassword = window.prompt("请输入当前密码");
  if (currentPassword == null) return;
  const newPassword = window.prompt("请输入新密码（6-64位）");
  if (newPassword == null) return;
  const confirmPassword = window.prompt("请再次输入新密码");
  if (confirmPassword == null) return;
  if (newPassword !== confirmPassword) {
    window.alert("两次输入的新密码不一致");
    return;
  }
  if (newPassword.length < 6 || newPassword.length > 64) {
    window.alert("新密码长度需为6-64位");
    return;
  }
  if (changePasswordBtn) changePasswordBtn.disabled = true;
  try {
    const resp = await apiRequest("/api/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword })
    });
    window.alert((resp && resp.message) || "密码修改成功");
  } catch (err) {
    window.alert(err && err.message ? err.message : "修改密码失败");
  } finally {
    if (changePasswordBtn) changePasswordBtn.disabled = false;
  }
}

async function logout() {
  if (state.reviewActive || state.reviewPreviewRunning) {
    const ok = window.confirm("正在默写中。退出登录将取消本轮默写且数据不保存，是否继续？");
    if (!ok) return;
    cancelReviewSessionWithoutSave();
  }
  try {
    if (state.auth.token) await apiRequest("/api/logout", { method: "POST" });
  } catch (err) {
    console.warn("logout failed:", err && err.message ? err.message : err);
  }
  state.auth = { loggedIn: false, role: "", username: "", token: "", linkedParentUsername: "", linkedChildren: [] };
  state.adminWordReviewDrafts = {};
  state.adminWrongBookQueryUser = "";
  state.adminWrongBookItems = [];
  state.adminUsers = [];
  clearSession();
  statsText.classList.remove("hidden");
  rewardText.classList.remove("hidden");
  appShell.classList.add("hidden");
  authScreen.classList.remove("hidden");
  authMsg.textContent = t("auth.loggedOut");
  setUserMenuOpen(false);
  refreshUserBadgeText();
}

function switchAuthMode(mode) {
  const isLogin = mode === "login";
  authTabLogin.classList.toggle("good", isLogin);
  authTabLogin.classList.toggle("ghost", !isLogin);
  authTabRegister.classList.toggle("good", !isLogin);
  authTabRegister.classList.toggle("ghost", isLogin);
  authPasswordConfirmRow.classList.toggle("hidden", isLogin);
  if (authRoleRow) authRoleRow.classList.toggle("hidden", isLogin);
  authLogin.classList.toggle("hidden", !isLogin);
  authRegister.classList.toggle("hidden", isLogin);
  authPassword.type = "password";
  authPasswordConfirm.type = "password";
  if (authRoleSelect && (!authRoleSelect.value || !["parent", "child"].includes(authRoleSelect.value))) authRoleSelect.value = "child";
  refreshAuthRegisterRoleUi();
  updateAuthTogglePasswordLabel();
  authMsg.textContent = "";
}

function refreshAuthRegisterRoleUi() {
  const isRegister = !authRegister.classList.contains("hidden");
  const role = authRoleSelect ? authRoleSelect.value : "child";
  const showParentRow = isRegister && role === "child";
  if (authParentUsernameRow) authParentUsernameRow.classList.toggle("hidden", !showParentRow);
  if (!showParentRow && authParentUsername) authParentUsername.value = "";
}

function setAuthPending(pending, mode = "login") {
  const isLogin = mode === "login";
  authUsername.disabled = pending;
  authPassword.disabled = pending;
  authPasswordConfirm.disabled = pending;
  if (authRoleSelect) authRoleSelect.disabled = pending;
  if (authParentUsername) authParentUsername.disabled = pending;
  authTabLogin.disabled = pending;
  authTabRegister.disabled = pending;
  authTogglePassword.disabled = pending;
  authLogin.disabled = pending;
  authRegister.disabled = pending;
  authLogin.textContent = pending && isLogin ? t("auth.loggingIn") : t("auth.login");
  authRegister.textContent = pending && !isLogin ? t("auth.registering") : t("auth.register");
}

async function handleLogin() {
  if (authLogin.disabled) return;
  const username = authUsername.value.trim();
  const password = authPassword.value;
  if (!username || !password) {
    authMsg.textContent = t("auth.enterUsernamePassword");
    return;
  }
  setAuthPending(true, "login");
  try {
    const resp = await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    authMsg.textContent = "";
    await setAuthState(resp.user.username, resp.user.role, resp.token, resp.user || {});
  } catch (err) {
    authMsg.textContent = err && err.message ? err.message : t("auth.loginFailed");
  } finally {
    setAuthPending(false, "login");
  }
}

async function handleRegister() {
  if (authRegister.disabled) return;
  const username = authUsername.value.trim();
  const password = authPassword.value;
  const confirm = authPasswordConfirm.value;
  const role = authRoleSelect ? authRoleSelect.value : "child";
  const linkedParentUsername = authParentUsername ? authParentUsername.value.trim() : "";
  if (!username || !password || !confirm) {
    authMsg.textContent = t("auth.fillAllFields");
    return;
  }
  if (!["parent", "child"].includes(role)) {
    authMsg.textContent = t("auth.fillAllFields");
    return;
  }
  if (password !== confirm) {
    authMsg.textContent = t("auth.passwordNotMatch");
    return;
  }
  if (role === "child" && !linkedParentUsername) {
    authMsg.textContent = t("auth.needParentUsername");
    return;
  }
  setAuthPending(true, "register");
  try {
    await apiRequest("/api/register", {
      method: "POST",
      body: JSON.stringify({ username, password, role, linkedParentUsername })
    });
    authMsg.textContent = t("auth.registerSuccess");
    authPassword.value = "";
    authPasswordConfirm.value = "";
    if (authParentUsername) authParentUsername.value = "";
    if (authRoleSelect) authRoleSelect.value = "child";
    switchAuthMode("login");
  } catch (err) {
    authMsg.textContent = err && err.message ? err.message : t("auth.registerFailed");
  } finally {
    setAuthPending(false, "register");
  }
}

function recordSubmission(item, isGood, accuracyPercent, meta = {}) {
  if (!isLearnerRole(state.auth.role) || !state.auth.username) return;
  const points = meta.points ?? (item.type === "word" ? 10 : 8);
  const payload = {
    username: state.auth.username,
    type: item.type,
    target: item.text,
    pinyin: item.pinyin || "",
    userAnswer: meta.userAnswer || "",
    handwritingImage: meta.handwritingImage || "",
    accuracyPercent: normalizeAccuracyPercent(accuracyPercent),
    systemResult: typeof meta.systemResult === "boolean" ? meta.systemResult : Boolean(isGood),
    finalResult: Boolean(isGood),
    pointsAwarded: points,
    judgeDetail: normalizeJudgeDetail(meta.judgeDetail),
    wordCharResults: Array.isArray(meta.wordCharResults)
      ? meta.wordCharResults.map((x) => ({
          ...x,
          accuracyPercent: normalizeAccuracyPercent(x && x.accuracyPercent),
          judgeDetail: normalizeJudgeDetail(x && x.judgeDetail)
        }))
      : []
  };
  queueSubmissionPayload(payload)
    .then(() => {
      refreshReviewDraftSnapshotToCurrent();
      renderUserRecords();
      renderAdminPanel();
    })
    .catch((err) => {
      console.warn("record submission failed:", err && err.message ? err.message : err);
    });
}

function makeItemKey(item) {
  return `${item.type}:${item.text}`;
}

function getProgress(item) {
  const key = makeItemKey(item);
  if (!state.progress[key]) {
    state.progress[key] = {
      streak: 0,
      success: 0,
      attempts: 0,
      nextReviewAt: Date.now(),
      lastAttemptAt: 0,
      lastResult: null,
      intervalDays: 1
    };
  }
  const p = state.progress[key];
  if (typeof p.streak !== "number") p.streak = 0;
  if (typeof p.success !== "number") p.success = 0;
  if (typeof p.attempts !== "number") p.attempts = 0;
  if (typeof p.nextReviewAt !== "number") p.nextReviewAt = Date.now();
  if (typeof p.lastAttemptAt !== "number") p.lastAttemptAt = 0;
  if (typeof p.intervalDays !== "number" || !Number.isFinite(p.intervalDays) || p.intervalDays <= 0) p.intervalDays = 1;
  if (typeof p.lastResult !== "boolean") p.lastResult = null;
  return state.progress[key];
}

function scheduleProgress(item, isGood) {
  const p = getProgress(item);
  const now = Date.now();
  p.attempts += 1;
  p.success += isGood ? 1 : 0;
  p.streak = isGood ? p.streak + 1 : 0;
  p.lastAttemptAt = now;
  p.lastResult = Boolean(isGood);

  // 记忆曲线：答对后逐步拉长复习间隔，答错后缩短到1天。
  if (isGood) {
    const accuracy = p.attempts > 0 ? p.success / p.attempts : 1;
    const growth = 1.7 + Math.min(0.8, p.streak * 0.06) + Math.max(0, (accuracy - 0.6) * 0.6);
    p.intervalDays = Math.min(45, Math.max(1, Math.round(p.intervalDays * growth)));
  } else {
    p.intervalDays = 1;
  }
  p.nextReviewAt = now + p.intervalDays * 24 * 60 * 60 * 1000;
  saveProgress();
}

function getDataset(type) {
  return type === "word" ? WORD_ITEMS : CHAR_ITEMS;
}

function currentLearnList() {
  const source = getDataset(state.learnType);
  if (state.level === "all") return source;
  return source.filter((it) => String(it.level) === state.level);
}

function pickRandomLearnIndex(listLength, currentIndex) {
  if (listLength <= 1) return 0;
  let next = currentIndex;
  let guard = 0;
  while (next === currentIndex && guard < 12) {
    next = Math.floor(Math.random() * listLength);
    guard += 1;
  }
  return next;
}

function moveLearn(step) {
  const list = currentLearnList();
  if (!list.length) return;
  if (state.learnRandomMode) {
    state.learnIndex = pickRandomLearnIndex(list.length, state.learnIndex);
  } else {
    state.learnIndex = Math.max(0, Math.min(list.length - 1, state.learnIndex + step));
  }
  renderLearnCard();
}

let cachedZhVoice = null;
let speechSeqToken = 0;
const POINTS_FX_MS = 2400;

function getChineseVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  if (cachedZhVoice && voices.some((v) => v.voiceURI === cachedZhVoice.voiceURI)) return cachedZhVoice;
  const zhVoices = voices.filter((v) => /^zh\b/i.test(String(v.lang || "")));
  if (!zhVoices.length) return null;
  const preferKeywords = [
    "xiaoxiao",
    "xiaoyi",
    "xiaomo",
    "yunxi",
    "tingting",
    "huihui",
    "kangkang",
    "sin-ji",
    "mei-jia",
    "hanhan"
  ];
  const scoreVoice = (v) => {
    const name = String(v.name || "").toLowerCase();
    const lang = String(v.lang || "").toLowerCase();
    let score = 0;
    if (lang.includes("zh-cn")) score += 45;
    else if (lang.includes("zh-hans")) score += 36;
    else if (lang.includes("zh")) score += 28;
    if (v.localService) score += 12;
    const idx = preferKeywords.findIndex((x) => name.includes(x));
    if (idx !== -1) score += 30 - idx;
    return score;
  };
  cachedZhVoice = zhVoices
    .slice()
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
  return cachedZhVoice || null;
}

function buildChineseUtterance(text, { rate = 0.88, pitch = 1, volume = 1 } = {}) {
  const utter = new SpeechSynthesisUtterance(String(text || ""));
  const voice = getChineseVoice();
  utter.lang = voice && voice.lang ? voice.lang : "zh-CN";
  if (voice) utter.voice = voice;
  utter.rate = rate;
  utter.pitch = pitch;
  utter.volume = volume;
  return utter;
}

function clampNumber(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function humanizeValue(base, jitter, min, max) {
  const rand = (Math.random() * 2 - 1) * Math.max(0, jitter || 0);
  return clampNumber(base + rand, min, max);
}

function splitSpeechText(text) {
  const value = String(text || "").trim();
  if (!value) return [];
  return value
    .split(/[，,、；;。！？!?\s]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function speakChineseSegments(segments, { cancel = true } = {}) {
  if (!("speechSynthesis" in window)) return;
  const rawItems = (Array.isArray(segments) ? segments : [])
    .map((it) => ({
      text: String((it && it.text) || "").trim(),
      rate: Number(it && it.rate),
      pitch: Number(it && it.pitch),
      volume: Number(it && it.volume),
      pauseMs: Number(it && it.pauseMs),
      split: Boolean(it && it.split)
    }))
    .filter((it) => it.text);
  const items = [];
  rawItems.forEach((it) => {
    if (!it.split) {
      items.push(it);
      return;
    }
    const parts = splitSpeechText(it.text);
    if (!parts.length) return;
    parts.forEach((part, idx) => {
      items.push({
        ...it,
        text: part,
        pauseMs: idx < parts.length - 1 ? Math.max(90, Number(it.pauseMs) || 140) : Number(it.pauseMs)
      });
    });
  });
  if (!items.length) return;
  if (cancel) window.speechSynthesis.cancel();
  const token = ++speechSeqToken;
  const speakNext = (idx) => {
    if (token !== speechSeqToken || idx >= items.length) return;
    const cur = items[idx];
    const baseRate = Number.isFinite(cur.rate) ? cur.rate : 0.88;
    const basePitch = Number.isFinite(cur.pitch) ? cur.pitch : 1;
    const baseVolume = Number.isFinite(cur.volume) ? cur.volume : 1;
    const utter = buildChineseUtterance(cur.text, {
      // slight random variation makes TTS sound less mechanical.
      rate: humanizeValue(baseRate, 0.02, 0.72, 1.02),
      pitch: humanizeValue(basePitch, 0.04, 0.86, 1.18),
      volume: humanizeValue(baseVolume, 0.03, 0.85, 1)
    });
    utter.onend = () => {
      if (token !== speechSeqToken) return;
      const delay = Number.isFinite(cur.pauseMs) ? Math.max(0, cur.pauseMs) : 120;
      window.setTimeout(() => speakNext(idx + 1), delay);
    };
    window.speechSynthesis.speak(utter);
  };
  speakNext(0);
}

function initSpeechEngine() {
  if (!("speechSynthesis" in window)) return;
  getChineseVoice();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedZhVoice = null;
    getChineseVoice();
  };
}

function speakLearnItem(item) {
  if (!("speechSynthesis" in window) || !item) return;
  speakChineseSegments(
    [
      {
        text: String(item.text || ""),
        rate: 0.78,
        pitch: 1.04,
        pauseMs: 170,
        split: true
      }
    ],
    { cancel: true }
  );
}

function applyReviewSettings(list) {
  const levelFiltered =
    state.reviewLevel === "all" ? list : list.filter((it) => String(it.level) === state.reviewLevel);
  if (state.reviewCount === "all") return levelFiltered;
  const limit = Number(state.reviewCount) || 10;
  return levelFiltered.slice(0, limit);
}

function shuffleList(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function weightedSampleWithoutReplacement(list, count, getWeight) {
  const pool = [...list];
  const result = [];
  const target = Math.max(0, Math.min(count, pool.length));
  while (result.length < target && pool.length > 0) {
    const weights = pool.map((it) => {
      const value = Number(getWeight(it));
      return Number.isFinite(value) ? Math.max(0.01, value) : 0.01;
    });
    const total = weights.reduce((sum, x) => sum + x, 0);
    if (!Number.isFinite(total) || total <= 0) {
      result.push(...shuffleList(pool).slice(0, target - result.length));
      break;
    }
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < pool.length; idx += 1) {
      r -= weights[idx];
      if (r <= 0) break;
    }
    const pickIdx = Math.min(idx, pool.length - 1);
    result.push(pool[pickIdx]);
    pool.splice(pickIdx, 1);
  }
  return result;
}

function getItemAttemptCount(item) {
  const p = getProgress(item);
  return Math.max(0, Number(p.attempts) || 0);
}

function prioritizeReviewItems(list, count, getWeight) {
  const sorted = [...list].sort((a, b) => {
    const attemptsDiff = getItemAttemptCount(a) - getItemAttemptCount(b);
    if (attemptsDiff !== 0) return attemptsDiff;
    const weightDiff = Number(getWeight(b)) - Number(getWeight(a));
    if (Number.isFinite(weightDiff) && weightDiff !== 0) return weightDiff;
    const lastAttemptDiff = (Number(getProgress(a).lastAttemptAt) || 0) - (Number(getProgress(b).lastAttemptAt) || 0);
    if (lastAttemptDiff !== 0) return lastAttemptDiff;
    const levelDiff = (Number(a.level) || 0) - (Number(b.level) || 0);
    if (levelDiff !== 0) return levelDiff;
    return String(a.text || "").localeCompare(String(b.text || ""), "zh-Hans-CN");
  });
  if (count >= sorted.length) return sorted;
  return sorted.slice(0, Math.max(0, count));
}

function buildMemoryCurveWeight(item, context = {}) {
  const dayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const p = getProgress(item);
  const attempts = Math.max(0, Number(p.attempts) || 0);
  const success = Math.max(0, Number(p.success) || 0);
  const streak = Math.max(0, Number(p.streak) || 0);
  const accuracy = attempts > 0 ? success / attempts : 0;
  const nextReviewAt = Number(p.nextReviewAt) || now;
  const lastAttemptAt = Number(p.lastAttemptAt) || 0;
  const overdueDays = Math.max(0, (now - nextReviewAt) / dayMs);
  const lastSeenGapDays = lastAttemptAt > 0 ? Math.max(0, (now - lastAttemptAt) / dayMs) : 30;

  const newItemBoost = attempts === 0 ? 2.4 : 1;
  const difficultyBoost = 1 + (1 - accuracy) * 2.2;
  const overdueBoost = 1 + Math.min(3.2, overdueDays * 0.4);
  const gapBoost = 0.7 + Math.min(2.3, lastSeenGapDays * 0.08);
  const recentFailBoost = p.lastResult === false ? 1.7 : 1;
  const stablePenalty = 1 / (1 + Math.min(8, streak) * 0.16);
  const wrongBookBoost = context.inWrongBook ? 1.35 : 1;

  const weight =
    newItemBoost * difficultyBoost * overdueBoost * gapBoost * recentFailBoost * stablePenalty * wrongBookBoost;
  return Math.max(0.05, Math.min(60, weight));
}

function buildReviewSessionList(source) {
  const typed = source.filter((it) => it.type === state.reviewType);
  const levelFiltered =
    state.reviewLevel === "all" ? typed : typed.filter((it) => String(it.level) === state.reviewLevel);
  const uniqueByKey = (arr) => {
    const map = new Map();
    arr.forEach((it) => map.set(makeItemKey(it), it));
    return [...map.values()];
  };

  if (state.reviewType !== "char") {
    const weightedPool = uniqueByKey(levelFiltered);
    if (state.reviewCount === "all") {
      return prioritizeReviewItems(weightedPool, weightedPool.length, (it) => buildMemoryCurveWeight(it));
    }
    const limit = Number(state.reviewCount) || 10;
    return prioritizeReviewItems(weightedPool, limit, (it) => buildMemoryCurveWeight(it));
  }

  const wrongChars = uniqueByKey(
    state.wrongBook
      .filter((x) => x.type === "char")
      .map((x) => CHAR_MAP.get(x.text))
      .filter(Boolean)
      .filter((it) => (state.reviewLevel === "all" ? true : String(it.level) === state.reviewLevel))
  );

  const base = uniqueByKey(levelFiltered);
  const exclude = new Set();
  const ratioPercent = Math.max(0, Math.min(100, Number(state.reviewWrongMixRatio) || 0));
  const ratio = ratioPercent / 100;
  const wrongSet = new Set(wrongChars.map((it) => makeItemKey(it)));
  const weighted = (it) => buildMemoryCurveWeight(it, { inWrongBook: wrongSet.has(makeItemKey(it)) });

  if (state.reviewCount === "all") {
    const merged = uniqueByKey([...base, ...wrongChars]);
    return prioritizeReviewItems(merged, merged.length, weighted);
  }

  const limit = Number(state.reviewCount) || 10;
  let wrongQuota = Math.floor(limit * ratio);
  if (ratio > 0 && wrongQuota === 0) wrongQuota = 1;
  wrongQuota = Math.min(limit, wrongChars.length, Math.max(0, wrongQuota));
  const selectedWrong = prioritizeReviewItems(wrongChars, wrongQuota, weighted);
  selectedWrong.forEach((it) => exclude.add(makeItemKey(it)));

  const normalPool = base.filter((it) => !exclude.has(makeItemKey(it)));
  const selectedNormal = prioritizeReviewItems(normalPool, Math.max(0, limit - selectedWrong.length), weighted);
  const merged = uniqueByKey([...selectedNormal, ...selectedWrong]);
  return prioritizeReviewItems(merged, Math.min(limit, merged.length), weighted);
}

function currentReviewItem() {
  return state.reviewList[state.reviewIndex] || null;
}

function clearAdvanceTimer() {
  if (state.advanceTimer) {
    clearTimeout(state.advanceTimer);
    state.advanceTimer = null;
  }
}

function getReviewFlowContext() {
  const fallback = {
    flow: state.reviewFlowState || "idle",
    hasItem: state.reviewActive && Boolean(currentReviewItem()),
    isLastItem: state.reviewActive && state.reviewIndex >= state.reviewList.length - 1,
    canBegin: !state.reviewActive && !state.reviewPreviewRunning,
    canRestart: state.reviewActive,
    canJudge: state.reviewActive && !state.reviewAwaitingNext,
    canReset: state.reviewActive && !state.reviewAwaitingNext,
    canStop: state.reviewActive || state.reviewPreviewRunning,
    canNext: state.reviewActive && state.reviewAwaitingNext && state.reviewIndex < state.reviewList.length - 1,
    showStop: state.reviewActive && state.reviewIndex < state.reviewList.length - 1,
    showNext: state.reviewActive && state.reviewAwaitingNext && state.reviewIndex < state.reviewList.length - 1
  };
  if (!reviewStateModule || typeof reviewStateModule.getReviewFlowContext !== "function") return fallback;
  return reviewStateModule.getReviewFlowContext({
    flow: state.reviewFlowState,
    total: state.reviewList.length,
    index: state.reviewIndex
  });
}

function setReviewFlowState(nextState) {
  if (!reviewStateModule || typeof reviewStateModule.toFlow !== "function") {
    state.reviewFlowState = String(nextState || "idle");
    return;
  }
  state.reviewFlowState = reviewStateModule.toFlow(nextState);
}

function resetReviewSessionStats(initialStats = {}) {
  state.reviewSessionStartedAt = Date.now();
  state.reviewSessionFinishedAt = 0;
  state.reviewSessionTotal = Array.isArray(state.reviewList) ? state.reviewList.length : 0;
  state.reviewSessionCorrect = Math.max(0, Number(initialStats.reviewSessionCorrect) || 0);
  state.reviewSessionWrong = Math.max(0, Number(initialStats.reviewSessionWrong) || 0);
  state.reviewSessionWrongItems = Array.isArray(initialStats.reviewSessionWrongItems) ? [...initialStats.reviewSessionWrongItems] : [];
  state.reviewSettlementPoints = 0;
  state.reviewSettlementAnimated = false;
  state.reviewLastResult = null;
  state.reviewLastJudgeDisplay = { feedback: "", answer: "" };
  state.reviewAwaitingNext = false;
}

function getCurrentSessionSummary() {
  const total = state.reviewSessionCorrect + state.reviewSessionWrong;
  const acc = total > 0 ? Math.round((state.reviewSessionCorrect / total) * 100) : 0;
  const durationMs = Math.max(0, (state.reviewSessionFinishedAt || Date.now()) - (state.reviewSessionStartedAt || Date.now()));
  const durationSec = Math.round(durationMs / 1000);
  const weakItems = (state.reviewSessionWrongItems || []).slice(0, 3).join("、");
  return { total, acc, durationSec, weakItems };
}

function renderReviewSummaryCard() {
  if (!reviewSummaryCard || !reviewSummaryText || !reviewSummaryActions) return;
  if (state.reviewFlowState !== "ended") {
    reviewSummaryCard.classList.add("hidden");
    reviewSummaryText.textContent = "";
    reviewSummaryActions.textContent = "";
    if (reviewSettleBtn) {
      reviewSettleBtn.classList.add("hidden");
      reviewSettleBtn.disabled = true;
      reviewSettleBtn.textContent = "本轮结算";
    }
    return;
  }
  const summary = getCurrentSessionSummary();
  const lastJudge = state.reviewLastJudgeDisplay || { feedback: "", answer: "" };
  const judgeParts = [];
  if (lastJudge.feedback) judgeParts.push(`最后判定：${lastJudge.feedback}`);
  if (lastJudge.answer) judgeParts.push(lastJudge.answer);
  const lastResultText = judgeParts.length > 0
    ? `${judgeParts.join("；")}。`
    : state.reviewLastResult && typeof state.reviewLastResult.isGood === "boolean"
      ? `最后一题：${state.reviewLastResult.isGood ? "正确" : "错误"}。`
      : "";
  reviewSummaryCard.classList.remove("hidden");
  reviewSummaryText.textContent =
    `${lastResultText}共完成 ${summary.total} 题，正确 ${state.reviewSessionCorrect} 题，正确率 ${summary.acc}%，耗时 ${summary.durationSec} 秒。`;
  reviewSummaryActions.textContent = summary.weakItems
    ? `建议下一步：优先复习 ${summary.weakItems}，也可去错题本继续巩固。`
    : "建议下一步：继续挑战更高等级，或返回学习页巩固新字词。";
  if (reviewSettleBtn) {
    const points = Math.max(0, Number(state.reviewSettlementPoints) || 0);
    const canSettle = points > 0 && !state.reviewSettlementAnimated;
    reviewSettleBtn.classList.toggle("hidden", points <= 0);
    reviewSettleBtn.disabled = !canSettle;
    reviewSettleBtn.textContent = canSettle ? `本轮结算（+${points}分）` : "已结算";
  }
}

function renderReviewButtons() {
  const flow = getReviewFlowContext();
  const beginAsStop = state.reviewPreviewRunning || state.reviewActive || state.reviewFlowState === "reviewed";
  reviewBegin.disabled = beginAsStop ? false : !flow.canBegin;
  reviewRestart.disabled = !flow.canRestart;
  if (reviewStartBtn) reviewStartBtn.disabled = !flow.canJudge;
  if (reviewResetBtn) reviewResetBtn.disabled = !flow.canReset;
  if (reviewNextBtn) reviewNextBtn.disabled = !flow.canNext;
  if (reviewStopBtn) reviewStopBtn.disabled = !flow.canStop;

  if (reviewNextBtn) reviewNextBtn.classList.toggle("hidden", !flow.showNext);
  if (reviewStopBtn) reviewStopBtn.classList.toggle("hidden", !flow.showStop);
  reviewRestart.classList.remove("hidden");

  const lockReviewConfig = state.reviewPreviewRunning || state.reviewActive || state.reviewFlowState === "reviewed";
  if (reviewTypeFilter) reviewTypeFilter.disabled = lockReviewConfig;
  if (reviewLevelFilter) reviewLevelFilter.disabled = lockReviewConfig;
  if (reviewCountFilter) reviewCountFilter.disabled = lockReviewConfig;
  if (reviewWrongMixFilter) reviewWrongMixFilter.disabled = lockReviewConfig;
  if (reviewPreviewFilter) reviewPreviewFilter.disabled = lockReviewConfig;

  reviewBegin.textContent = beginAsStop ? t("review.stop") : "开始默写";
  reviewBegin.classList.toggle("warn", beginAsStop);
  reviewBegin.classList.toggle("good", !beginAsStop);
}

function finishReviewSession(isWrongBookSinglePractice) {
  resetReviewRetryState();
  const sessionPoints = Math.max(0, Number(state.reviewSessionPointsEarned) || 0);
  state.reviewSessionPointsEarned = 0;
  state.reviewSessionFinishedAt = Date.now();
  const sessionCorrectForRewards = Math.max(0, Number(state.reviewSessionCorrect) || 0);
  state.reviewSettlementPoints = sessionPoints;
  state.reviewSettlementAnimated = false;

  if (!isWrongBookSinglePractice) {
    if (sessionPoints > 0 || sessionCorrectForRewards > 0) {
      addRewardDelta(sessionPoints, sessionCorrectForRewards);
    }
    commitReviewDraftSession().catch((err) => {
      console.warn("commit review draft failed:", err && err.message ? err.message : err);
    });
  } else {
    commitReviewDraftSession({ syncUserData: false }).catch((err) => {
      console.warn("commit single wrong-book review failed:", err && err.message ? err.message : err);
    });
  }

  state.reviewActive = false;
  state.reviewAwaitingNext = false;
  setReviewFlowState("ended");
  state.reviewSessionSource = "normal";
  state.reviewMessage = `本轮默写已结束，共完成 ${state.reviewSessionCorrect + state.reviewSessionWrong} 个${state.reviewType === "word" ? "词" : "字"}。`;
  state.reviewList = [];
  state.reviewIndex = 0;
  renderReviewCard();
  rebuildWrongQueue();
}

function advanceToNextReviewItem() {
  if (!state.reviewActive || !state.reviewAwaitingNext) return;
  state.reviewIndex += 1;
  if (state.reviewIndex >= state.reviewList.length) {
    finishReviewSession(state.reviewSessionSource === "wrongbook-single");
    return;
  }
  state.reviewAwaitingNext = false;
  state.reviewLastResult = null;
  state.reviewLastJudgeDisplay = { feedback: "", answer: "" };
  resetReviewRetryState();
  setReviewFlowState("answering");
  renderReviewCard();
  rebuildWrongQueue();
}

function clearReviewPreviewTimer() {
  if (state.reviewPreviewTimer) {
    clearTimeout(state.reviewPreviewTimer);
    state.reviewPreviewTimer = null;
  }
}

function clearReviewPreviewCountdownTimer() {
  if (state.reviewPreviewCountdownTimer) {
    clearInterval(state.reviewPreviewCountdownTimer);
    state.reviewPreviewCountdownTimer = null;
  }
}

function resetPreviewTimerUi() {
  if (reviewPreviewTimer) reviewPreviewTimer.classList.add("is-hidden");
  if (reviewPreviewTimeText) reviewPreviewTimeText.textContent = "倒计时 0.0 秒";
  if (reviewPreviewProgressBar) reviewPreviewProgressBar.style.width = "100%";
}

function stopReviewPreviewSequence() {
  state.reviewPreviewToken += 1;
  state.reviewPreviewRunning = false;
  clearReviewPreviewTimer();
  clearReviewPreviewCountdownTimer();
  resetPreviewTimerUi();
  if (reviewPreview) {
    reviewPreview.textContent = "";
    reviewPreview.classList.add("is-hidden");
  }
}

function getDefaultPromptPair(item) {
  if (!item) return ["", ""];
  if (item.type === "word") {
    const a = item.text || "";
    const b = item.meaning || item.text || "";
    return [a, b];
  }
  const list = CHAR_PHRASE_MAP.get(item.text) || [];
  const first = list[0] || item.phrase || item.text || "";
  const second = list[1] || item.phrase || `${item.text || ""}${item.text || ""}`;
  return [first, second];
}

function applyLexiconOverrides(overrides) {
  const map = overrides && typeof overrides === "object" ? overrides : {};
  state.lexiconOverrides = map;

  CHAR_ITEMS.forEach((item) => {
    const base = BASE_ITEM_SNAPSHOT.get(`char:${item.text}`) || { pinyin: item.pinyin || "", prompt1: "", prompt2: "" };
    item.pinyin = base.pinyin || item.pinyin || "-";
    item.prompt1 = base.prompt1 || "";
    item.prompt2 = base.prompt2 || "";
  });
  WORD_ITEMS.forEach((item) => {
    const base = BASE_ITEM_SNAPSHOT.get(`word:${item.text}`) || { pinyin: item.pinyin || "", prompt1: "", prompt2: "" };
    item.pinyin = base.pinyin || item.pinyin || "-";
    item.prompt1 = base.prompt1 || "";
    item.prompt2 = base.prompt2 || "";
  });

  Object.values(map).forEach((x) => {
    if (!x || !x.text) return;
    const type = x.type === "word" ? "word" : "char";
    const item = type === "word" ? WORD_MAP.get(x.text) : CHAR_MAP.get(x.text);
    if (!item) return;
    if (typeof x.pinyin === "string" && x.pinyin.trim()) item.pinyin = x.pinyin.trim();
    if (typeof x.prompt1 === "string") item.prompt1 = x.prompt1.trim();
    if (typeof x.prompt2 === "string") item.prompt2 = x.prompt2.trim();
  });

  if (writeSelect && writeSelect.value) updateWriteTarget(writeSelect.value);
}

function getPromptPhrases(item) {
  const [base1, base2] = getDefaultPromptPair(item);
  return [item && item.prompt1 ? item.prompt1 : base1, item && item.prompt2 ? item.prompt2 : base2];
}

function refreshStats() {
  const all = CHAR_ITEMS.length + WORD_ITEMS.length;
  const seen = Object.keys(state.progress).length;
  const mastered = Object.values(state.progress).filter((x) => x && x.success >= 3).length;
  statsText.textContent = `已接触 ${seen}/${all} 项（字+词），稳定掌握 ${mastered} 项，错题 ${state.wrongBook.length} 个`;
}

function initLevelFilter() {
  const levels = [...new Set(CHAR_ITEMS.concat(WORD_ITEMS).map((it) => it.level))].sort((a, b) => a - b);
  levelFilter.innerHTML = [`<option value="all">全部</option>`, ...levels.map((lv) => `<option value="${lv}">HSK ${lv}</option>`)].join("");
  levelFilter.value = state.level;
}

function initWriteSelect() {
  const currentValue = writeSelect.value;
  writeSelect.innerHTML = CHAR_ITEMS.map(
    (it) => `<option value="${it.text}">HSK${it.level} · ${it.text} · ${it.pinyin}</option>`
  ).join("");
  const nextValue = CHAR_MAP.has(currentValue) ? currentValue : (CHAR_ITEMS[0] && CHAR_ITEMS[0].text);
  if (nextValue) writeSelect.value = nextValue;
  updateWriteTarget(nextValue);
}

function setWriteBatchPlaying(playing) {
  state.writeBatchPlaying = Boolean(playing);
  if (writeListPlaySelected) {
    const selectedCount = (state.writeSelectedChars || []).length;
    writeListPlaySelected.disabled = state.writeBatchPlaying || selectedCount === 0;
  }
  if (writeListStopPlay) writeListStopPlay.disabled = !state.writeBatchPlaying;
}

function getLearnSelectedCharItems() {
  const keys = Array.isArray(state.learnSelectedKeys) ? state.learnSelectedKeys : [];
  const chars = [];
  const seen = new Set();
  keys.forEach((key) => {
    const [type, ...rest] = String(key || "").split(":");
    if (type !== "char") return;
    const text = rest.join(":");
    const item = CHAR_MAP.get(text);
    if (!item || seen.has(item.text)) return;
    seen.add(item.text);
    chars.push(item);
  });
  return chars;
}

function getWriteNavigationItems() {
  const selectedChars = getLearnSelectedCharItems();
  return selectedChars.length ? selectedChars : CHAR_ITEMS;
}

function updateWriteNavButtons() {
  const list = getWriteNavigationItems();
  const disabled = list.length <= 1;
  if (writePrevChar) writePrevChar.disabled = disabled;
  if (writeNextChar) writeNextChar.disabled = disabled;
}

function moveWriteTarget(step) {
  const list = getWriteNavigationItems();
  if (!list.length) return;
  const current = writeSelect.value;
  let index = list.findIndex((it) => it.text === current);
  if (index < 0) index = 0;
  else index = (index + step + list.length) % list.length;
  const next = list[index];
  if (!next) return;
  writeSelect.value = next.text;
  updateWriteTarget(next.text);
  playStrokeDemo(true);
  writeFeedback.textContent = `已切换到“${next.text}”。`;
}

function syncWriteListFromLearnSelection(options = {}) {
  const sourceSet = new Set(getLearnSelectedCharItems().map((it) => it.text));
  const prev = Array.isArray(state.writeSelectedChars) ? state.writeSelectedChars : [];
  const next = prev.filter((ch) => sourceSet.has(ch));
  if (next.length !== prev.length) state.writeSelectedChars = next;
  if (options && options.resetPage) state.writeListPage = 1;
  if (!sourceSet.size && state.writeBatchPlaying) stopWriteBatchDemo();
  renderWriteCharList();
  updateWriteNavButtons();
}

function renderWriteCharList() {
  if (!writeCharList || !writeListSummary) return;
  const keyword = String(state.writeListSearch || "").trim().toLowerCase();
  const sourceChars = getLearnSelectedCharItems();
  const sourceSet = new Set(sourceChars.map((it) => it.text));
  const selectedInSource = (state.writeSelectedChars || []).filter((ch) => sourceSet.has(ch));
  if (selectedInSource.length !== (state.writeSelectedChars || []).length) state.writeSelectedChars = selectedInSource;
  const selectedSet = new Set(selectedInSource);
  const filtered = sourceChars.filter((it) => {
    if (!keyword) return true;
    return (
      String(it.text || "").includes(keyword) ||
      String(it.pinyin || "").toLowerCase().includes(keyword) ||
      String(it.meaning || "").toLowerCase().includes(keyword)
    );
  });
  const pageSize = Math.max(1, Number(state.writeListPageSize) || 50);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  state.writeListPage = Math.max(1, Math.min(state.writeListPage, totalPages));
  const start = (state.writeListPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  writeListSummary.textContent = sourceChars.length
    ? `学习页已选 ${sourceChars.length} 个汉字；当前显示 ${filtered.length} 个，已勾选 ${selectedSet.size} 个用于批量演示`
    : "请先在学习页面勾选要演示的汉字。";
  if (writeListPageSize) writeListPageSize.value = String(pageSize);
  if (writeListPageInfo) writeListPageInfo.textContent = `第 ${state.writeListPage} / ${totalPages} 页`;
  if (writeListPrev) writeListPrev.disabled = state.writeListPage <= 1;
  if (writeListNext) writeListNext.disabled = state.writeListPage >= totalPages;
  if (writeListSelectPage) writeListSelectPage.disabled = pageItems.length === 0;
  if (writeListClearSelected) writeListClearSelected.disabled = selectedSet.size === 0;
  if (writeListPlaySelected) writeListPlaySelected.disabled = state.writeBatchPlaying || selectedSet.size === 0;

  if (!pageItems.length) {
    const msg = sourceChars.length ? "没有匹配的汉字，请调整搜索条件。" : "学习页尚未选择汉字。";
    const emptyHtml = `<tr><td colspan="5">${msg}</td></tr>`;
    if (state.writeListHtml !== emptyHtml) {
      writeCharList.innerHTML = emptyHtml;
      state.writeListHtml = emptyHtml;
    }
    return;
  }

  const listHtml = pageItems
    .map((it) => {
      const checked = selectedSet.has(it.text) ? "checked" : "";
      return `<tr>
        <td><input type="checkbox" data-action="write-select-item" data-char="${it.text}" ${checked} /></td>
        <td class="char-cell demo-char-cell" data-action="write-demo-item" data-char="${it.text}" title="点击演示笔画">${it.text}</td>
        <td>${it.pinyin || "-"}</td>
        <td>${it.level}</td>
        <td><button class="ghost" data-action="write-demo-item" data-char="${it.text}">演示</button></td>
      </tr>`;
    })
    .join("");
  if (state.writeListHtml !== listHtml) {
    writeCharList.innerHTML = listHtml;
    state.writeListHtml = listHtml;
  }
}

function startCharStrokeDemo(text) {
  const item = CHAR_MAP.get(text);
  if (!item) return;
  writeSelect.value = item.text;
  updateWriteTarget(item.text);
  switchTab("write");
  playStrokeDemo(true);
  writeFeedback.textContent = `已切换到“${item.text}”，可边看笔画边练写。`;
}

function setStrokeDemoButtonsEnabled(enabled) {
  if (strokeDemoPlay) strokeDemoPlay.disabled = !enabled;
  if (strokeDemoReplay) strokeDemoReplay.disabled = !enabled;
}

function initStrokeWriter(char) {
  if (!strokeDemo) return false;
  const target = String(char || "").trim();
  if (!target) return false;
  if (!window.HanziWriter || typeof window.HanziWriter.create !== "function") {
    strokeDemo.innerHTML = "";
    if (strokeDemoMsg) strokeDemoMsg.textContent = "笔画演示加载失败，请检查网络后重试。";
    state.strokeWriter = null;
    state.strokeChar = "";
    setStrokeDemoButtonsEnabled(false);
    return false;
  }
  const size = Math.max(170, Math.min(240, Math.floor(strokeDemo.clientWidth || 220)));
  strokeDemo.innerHTML = "";
  try {
    state.strokeWriter = window.HanziWriter.create("stroke-demo", target, {
      width: size,
      height: size,
      padding: 5,
      showOutline: true,
      strokeAnimationSpeed: 0.95,
      delayBetweenStrokes: 220,
      strokeColor: "#111827",
      radicalColor: "#1f2937",
      outlineColor: "#d8ccb0"
    });
    state.strokeChar = target;
    if (strokeDemoMsg) strokeDemoMsg.textContent = "";
    setStrokeDemoButtonsEnabled(true);
    return true;
  } catch (err) {
    strokeDemo.innerHTML = "";
    if (strokeDemoMsg) strokeDemoMsg.textContent = "该字暂无笔画演示数据。";
    state.strokeWriter = null;
    state.strokeChar = "";
    setStrokeDemoButtonsEnabled(false);
    return false;
  }
}

function playStrokeDemo(forceRebuild = false) {
  const item = CHAR_MAP.get(writeSelect.value) || CHAR_ITEMS[0];
  if (!item) return Promise.resolve(false);
  const needBuild = forceRebuild || !state.strokeWriter || state.strokeChar !== item.text;
  if (needBuild && !initStrokeWriter(item.text)) return Promise.resolve(false);
  if (!state.strokeWriter || typeof state.strokeWriter.animateCharacter !== "function") return Promise.resolve(false);
  if (strokeDemoMsg) strokeDemoMsg.textContent = `正在演示“${item.text}”的笔画...`;
  return Promise.resolve(state.strokeWriter.animateCharacter())
    .then(() => {
      if (strokeDemoMsg) strokeDemoMsg.textContent = `“${item.text}”笔画演示完成。`;
      return true;
    })
    .catch(() => {
      if (strokeDemoMsg) strokeDemoMsg.textContent = "笔画演示失败，请重试。";
      return false;
    });
}

function stopWriteBatchDemo() {
  state.writeBatchToken += 1;
  setWriteBatchPlaying(false);
}

async function playWriteBatchDemo() {
  const selected = new Set(state.writeSelectedChars || []);
  const queue = getLearnSelectedCharItems().filter((it) => selected.has(it.text));
  if (!queue.length) {
    if (strokeDemoMsg) strokeDemoMsg.textContent = "请先在右侧列表选择至少一个汉字。";
    return;
  }
  const token = state.writeBatchToken + 1;
  state.writeBatchToken = token;
  setWriteBatchPlaying(true);
  for (let i = 0; i < queue.length; i += 1) {
    if (state.writeBatchToken !== token) break;
    const item = queue[i];
    writeSelect.value = item.text;
    updateWriteTarget(item.text);
    if (strokeDemoMsg) strokeDemoMsg.textContent = `批量演示 ${i + 1}/${queue.length}：${item.text}`;
    await playStrokeDemo(true);
    await new Promise((resolve) => setTimeout(resolve, 260));
  }
  const finished = state.writeBatchToken === token;
  setWriteBatchPlaying(false);
  if (finished && strokeDemoMsg) strokeDemoMsg.textContent = `批量演示完成，共 ${queue.length} 个汉字。`;
}

function initReviewSettings() {
  const levels = [...new Set(CHAR_ITEMS.concat(WORD_ITEMS).map((it) => it.level))].sort((a, b) => a - b);
  reviewLevelFilter.innerHTML = [`<option value="all">全部</option>`, ...levels.map((lv) => `<option value="${lv}">HSK ${lv}</option>`)].join("");
  reviewTypeFilter.value = state.reviewType;
  reviewLevelFilter.value = state.reviewLevel;
  reviewCountFilter.value = state.reviewCount;
  reviewWrongMixFilter.value = state.reviewWrongMixRatio;
  if (reviewPreviewFilter) reviewPreviewFilter.value = state.reviewPreviewMode;
}

function updateWriteTarget(text) {
  const item = CHAR_MAP.get(text) || CHAR_ITEMS[0];
  const [prompt1, prompt2] = getPromptPhrases(item);
  targetChar.textContent = item.text;
  targetMeta.textContent = `${item.pinyin} · ${item.meaning}`;
  if (targetPrompts) {
    const prompts = [prompt1, prompt2].map((x) => String(x || "").trim()).filter(Boolean);
    targetPrompts.textContent = prompts.length ? `提示词：${prompts.join(" · ")}` : "提示词：-";
  }
  initStrokeWriter(item.text);
  resetWriteRetryState(makeItemKey(item));
  if (typeof state.refreshWriteCanvas === "function") state.refreshWriteCanvas({ clear: true });
  updateWriteNavButtons();
}

function renderLearnCard() {
  const list = currentLearnList();
  state.learnIndex = Math.max(0, Math.min(state.learnIndex, Math.max(0, list.length - 1)));
  const fallback = getDataset(state.learnType)[0] || CHAR_ITEMS[0];
  const item = list[state.learnIndex] || fallback;
  learnChar.textContent = item.text;
  learnPinyin.textContent = item.pinyin || "-";
  learnMeaning.textContent = item.meaning || "-";
  learnProgress.textContent = `学习进度：${list.length ? state.learnIndex + 1 : 0}/${list.length || 0}（${state.learnRandomMode ? "随机" : "顺序"}）`;
  learnChar.classList.toggle("char", item.type === "char");
  const modeBtn = document.getElementById("learn-mode-toggle");
  const autoBtn = document.getElementById("learn-auto-speak");
  if (modeBtn) modeBtn.textContent = state.learnRandomMode ? "随机学习" : "顺序学习";
  if (autoBtn) autoBtn.textContent = `自动朗读：${state.learnAutoSpeak ? "开" : "关"}`;
  if (state.learnAutoSpeak && list.length) speakLearnItem(item);
}

function getUserDictationStatsMap() {
  const map = new Map();
  if (!state.auth.username) return map;
  const rows = state.submissions.filter((x) => x && x.username === state.auth.username && x.type && x.target);
  rows.forEach((row) => {
    const key = `${row.type}:${row.target}`;
    const prev = map.get(key) || { total: 0, correct: 0, accuracy: 0 };
    const total = prev.total + 1;
    const correct = prev.correct + (row.finalResult ? 1 : 0);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    map.set(key, { total, correct, accuracy });
  });
  return map;
}

function matchLearnDictationCountFilter(total, filterValue) {
  if (filterValue === "0") return total === 0;
  if (filterValue === "1-4") return total >= 1 && total <= 4;
  if (filterValue === "5+") return total >= 5;
  return true;
}

function matchLearnAccuracyFilter(total, accuracy, filterValue) {
  if (filterValue === "unattempted") return total === 0;
  if (total <= 0) return filterValue === "all";
  if (filterValue === "lt60") return accuracy < 60;
  if (filterValue === "60-79") return accuracy >= 60 && accuracy < 80;
  if (filterValue === "80-99") return accuracy >= 80 && accuracy < 100;
  if (filterValue === "100") return accuracy === 100;
  return true;
}

function renderLearnCharList() {
  if (!learnCharList || !learnListSummary) return;
  const keyword = String(state.learnCharSearch || "").trim().toLowerCase();
  const merged = [...CHAR_ITEMS, ...WORD_ITEMS];
  const levelFilterValue = state.learnListLevelFilter || "all";
  const typeFilter = state.learnListTypeFilter || "all";
  const countFilter = state.learnDictationCountFilter || "all";
  const accuracyFilter = state.learnAccuracyFilter || "all";
  const selectedSet = new Set(state.learnSelectedKeys || []);
  const statsMap = getUserDictationStatsMap();
  const levels = [...new Set(merged.map((it) => Number(it.level) || 1))].sort((a, b) => a - b);
  if (learnListLevelFilter) {
    const levelOptions = [`<option value="all">全部</option>`, ...levels.map((lv) => `<option value="${lv}">HSK ${lv}</option>`)].join("");
    if (learnListLevelFilter.innerHTML !== levelOptions) learnListLevelFilter.innerHTML = levelOptions;
    learnListLevelFilter.value = levelFilterValue;
  }
  const allItems = merged.filter((it) => {
    const key = `${it.type}:${it.text}`;
    const stats = statsMap.get(key) || { total: 0, correct: 0, accuracy: 0 };
    if (levelFilterValue !== "all" && String(it.level) !== String(levelFilterValue)) return false;
    if (typeFilter !== "all" && it.type !== typeFilter) return false;
    if (!matchLearnDictationCountFilter(stats.total, countFilter)) return false;
    if (!matchLearnAccuracyFilter(stats.total, stats.accuracy, accuracyFilter)) return false;
    if (!keyword) return true;
    return (
      String(it.text || "").includes(keyword) ||
      String(it.pinyin || "").toLowerCase().includes(keyword) ||
      String(it.meaning || "").toLowerCase().includes(keyword)
    );
  });
  const pageSize = Math.max(1, Number(state.learnCharPageSize) || 50);
  const totalPages = Math.max(1, Math.ceil(allItems.length / pageSize));
  state.learnCharPage = Math.max(1, Math.min(state.learnCharPage, totalPages));
  const start = (state.learnCharPage - 1) * pageSize;
  const pageItems = allItems.slice(start, start + pageSize);
  const wrongSet = new Set(state.wrongBook.filter((x) => x && x.key).map((x) => x.key));
  const attemptedCount = allItems.filter((it) => {
    const key = `${it.type}:${it.text}`;
    const stats = statsMap.get(key);
    return stats && stats.total > 0;
  }).length;
  const attemptedStats = allItems
    .map((it) => statsMap.get(`${it.type}:${it.text}`) || { total: 0, accuracy: 0 })
    .filter((x) => x.total > 0);
  const weakCount = attemptedStats.filter((x) => x.accuracy < 80).length;
  const avgAccuracy = attemptedStats.length
    ? Math.round(attemptedStats.reduce((sum, x) => sum + x.accuracy, 0) / attemptedStats.length)
    : 0;
  learnListSummary.textContent = `共 ${allItems.length} 项（已默写 ${attemptedCount} 项，已选 ${selectedSet.size}）`;
  if (learnMetricStrip) {
    const metricsHtml = [
      { label: "总项", value: `${allItems.length}` },
      { label: "已默写", value: `${attemptedCount}` },
      { label: "平均准确率", value: attemptedStats.length ? `${avgAccuracy}%` : "-" },
      { label: "薄弱项(<80%)", value: `${weakCount}` }
    ]
      .map((x) => `<div class="learn-metric"><p class="label">${x.label}</p><p class="value">${x.value}</p></div>`)
      .join("");
    if (state.learnMetricsHtml !== metricsHtml) {
      learnMetricStrip.innerHTML = metricsHtml;
      state.learnMetricsHtml = metricsHtml;
    }
  }
  if (learnCharPageSize) learnCharPageSize.value = String(pageSize);
  if (learnListLevelFilter) learnListLevelFilter.value = levelFilterValue;
  if (learnListTypeFilter) learnListTypeFilter.value = typeFilter;
  if (learnDictationCountFilter) learnDictationCountFilter.value = countFilter;
  if (learnAccuracyFilter) learnAccuracyFilter.value = accuracyFilter;
  learnCharPageInfo.textContent = `第 ${state.learnCharPage} / ${totalPages} 页`;
  learnCharPrev.disabled = state.learnCharPage <= 1;
  learnCharNext.disabled = state.learnCharPage >= totalPages;
  if (learnDictateSelected) learnDictateSelected.disabled = selectedSet.size === 0;
  if (learnDemoSelected) {
    const hasSelectedChar = [...selectedSet].some((key) => String(key).startsWith("char:"));
    learnDemoSelected.disabled = !hasSelectedChar;
  }
  const listHtml = pageItems
    .map((it) => {
      const key = `${it.type}:${it.text}`;
      const stats = statsMap.get(key) || { total: 0, correct: 0, accuracy: 0 };
      const inWrong = wrongSet.has(key);
      const checked = selectedSet.has(key) ? "checked" : "";
      const charCellClass = it.type === "char" ? "char-cell demo-char-cell" : "char-cell";
      const charCellAttrs =
        it.type === "char" ? `data-action="show-stroke-demo" data-char="${it.text}" title="点击演示笔画"` : "";
      const accuracyText = stats.total > 0 ? `${stats.accuracy}%` : "-";
      const accuracyClass = stats.total <= 0 ? "" : stats.accuracy >= 80 ? "status-yes" : "status-no";
      return `<tr>
        <td><input type="checkbox" data-action="select-item" data-key="${key}" ${checked} /></td>
        <td class="${charCellClass}" ${charCellAttrs}>${it.text}</td>
        <td>${it.type === "word" ? "词汇" : "汉字"}</td>
        <td>${it.pinyin || "-"}</td>
        <td>${it.level}</td>
        <td>${stats.total}</td>
        <td class="${accuracyClass}">${accuracyText}</td>
        <td class="${inWrong ? "status-no" : "status-yes"}">${inWrong ? "是" : "否"}</td>
      </tr>`;
    })
    .join("");
  if (state.learnListHtml !== listHtml) {
    learnCharList.innerHTML = listHtml;
    state.learnListHtml = listHtml;
  }
}

function normalizeWrongItem(x) {
  if (!x || !x.key) return null;
  const [type, ...rest] = String(x.key).split(":");
  const text = rest.join(":");
  const item = type === "word" ? WORD_MAP.get(text) : CHAR_MAP.get(text);
  if (!item) return null;
  const wordCorrectHits = Number(x.wordCorrectHits) || 0;
  return {
    key: makeItemKey(item),
    type: item.type,
    text: item.text,
    level: item.level,
    pinyin: item.pinyin,
    meaning: item.meaning,
    // keep legacy field name, now used for both char and word wrong-book hit count.
    wordCorrectHits: Math.max(0, wordCorrectHits)
  };
}

function rebuildWrongQueue() {
  state.wrongBook = state.wrongBook.map(normalizeWrongItem).filter(Boolean);
  const typeFiltered = state.wrongBook.filter((it) => it.type === state.reviewType);
  state.wrongQueue = typeFiltered
    .map((it) => (it.type === "word" ? WORD_MAP.get(it.text) : CHAR_MAP.get(it.text)))
    .filter(Boolean);
  saveWrongBook();
  renderWrongBook();
  renderLearnCharList();
}

function addWrongItem(item) {
  const key = makeItemKey(item);
  const existIdx = state.wrongBook.findIndex((x) => x.key === key);
  if (existIdx >= 0) {
    // 错题再次写错，重置“连续写对次数”。
    const prev = state.wrongBook[existIdx];
    if ((prev.wordCorrectHits || 0) !== 0) {
      state.wrongBook[existIdx] = { ...prev, wordCorrectHits: 0 };
      saveWrongBook();
      rebuildWrongQueue();
    }
    return;
  }
  state.wrongBook.push({
    key,
    type: item.type,
    text: item.text,
    level: item.level,
    pinyin: item.pinyin,
    meaning: item.meaning,
    wordCorrectHits: 0
  });
  saveWrongBook();
  rebuildWrongQueue();
}

function removeWrongItem(item) {
  const key = makeItemKey(item);
  const idx = state.wrongBook.findIndex((x) => x.key === key);
  if (idx < 0) return;

  const current = state.wrongBook[idx];
  const hits = (Number(current.wordCorrectHits) || 0) + 1;
  // 全部错题（汉字/词汇）都需连续写对 5 次才从错题本移除。
  if (hits >= 5) {
    state.wrongBook = state.wrongBook.filter((x) => x.key !== key);
  } else {
    state.wrongBook[idx] = { ...current, wordCorrectHits: hits };
  }
  saveWrongBook();
  rebuildWrongQueue();
}

function renderWrongBook() {
  const all = Array.isArray(state.wrongBook) ? state.wrongBook : [];
  const levels = [...new Set(all.map((it) => Number(it.level) || 1))].sort((a, b) => a - b);
  if (state.wrongLevelFilter !== "all" && !levels.includes(Number(state.wrongLevelFilter))) {
    state.wrongLevelFilter = "all";
  }
  const filtered =
    state.wrongLevelFilter === "all" ? all : all.filter((it) => String(it.level) === String(state.wrongLevelFilter));
  const selectedCount =
    state.wrongDictationCount === "all" ? filtered.length : Math.min(filtered.length, Number(state.wrongDictationCount) || 10);

  wrongCount.textContent =
    state.wrongLevelFilter === "all"
      ? `错题本：${all.length} 个`
      : `错题本：${filtered.length}/${all.length} 个（HSK ${state.wrongLevelFilter}）`;

  if (wrongLevelFilters) {
    wrongLevelFilters.innerHTML = [
      `<button class="${state.wrongLevelFilter === "all" ? "is-active" : "ghost"}" data-level="all">全部</button>`,
      ...levels.map(
        (lv) =>
          `<button class="${String(state.wrongLevelFilter) === String(lv) ? "is-active" : "ghost"}" data-level="${lv}">HSK ${lv}</button>`
      )
    ].join("");
  }

  if (wrongDictationCount) wrongDictationCount.value = state.wrongDictationCount;
  if (startWrongDictation) startWrongDictation.disabled = selectedCount <= 0;

  wrongList.innerHTML = filtered.map((it) => `<button class="chip" data-key="${it.key}">${it.text}</button>`).join("");
}

function switchTab(tab) {
  state.tab = tab;
  tabs.forEach((el) => el.classList.toggle("is-active", el.dataset.tab === tab));
  Object.entries(panels).forEach(([key, node]) => {
    if (!node) return;
    node.classList.toggle("is-active", key === tab);
  });
  renderTabContent(tab, { force: true });
}

function speakPrompt(item) {
  if (!("speechSynthesis" in window) || !item) return;
  const [p1, p2] = getPromptPhrases(item);
  speakChineseSegments(
    [
      { text: String(item.text || ""), rate: 0.77, pitch: 1.05, pauseMs: 260, split: true },
      { text: String(p1 || ""), rate: 0.84, pitch: 1.01, pauseMs: 220, split: true },
      { text: String(p2 || ""), rate: 0.84, pitch: 1.01, pauseMs: 150, split: true }
    ],
    { cancel: true }
  );
}

function waitPreviewTick(ms) {
  return new Promise((resolve) => {
    clearReviewPreviewTimer();
    state.reviewPreviewTimer = setTimeout(() => {
      state.reviewPreviewTimer = null;
      resolve();
    }, ms);
  });
}

function scrollToPageBottom() {
  const prefersReducedMotion =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = prefersReducedMotion ? "auto" : "smooth";
  window.setTimeout(() => {
    const maxTop = Math.max(
      0,
      (document.documentElement && document.documentElement.scrollHeight) || 0,
      (document.body && document.body.scrollHeight) || 0
    );
    window.scrollTo({ top: maxTop, behavior });
  }, 60);
}

async function runPreReviewPreviewAndStart() {
  const list = Array.isArray(state.reviewList) ? state.reviewList : [];
  if (!list.length) {
    state.reviewPreviewRunning = false;
    state.reviewActive = false;
    setReviewFlowState("idle");
    renderReviewCard();
    return;
  }
  const enablePreview = state.reviewPreviewMode === "all";
  if (!enablePreview) {
    state.reviewPreviewRunning = false;
    resetPreviewTimerUi();
    state.reviewActive = true;
    setReviewFlowState("answering");
    renderReviewCard();
    scrollToPageBottom();
    return;
  }

  const token = state.reviewPreviewToken + 1;
  state.reviewPreviewToken = token;
  state.reviewPreviewRunning = true;
  state.reviewActive = false;
  setReviewFlowState("preview");
  cleanupAllDictationPads();
  reviewFeedback.textContent = "";
  reviewAnswer.textContent = "";
  reviewAnswer.classList.add("is-hidden");
  reviewStartBtn.classList.add("hidden");
  reviewResetBtn.classList.add("hidden");
  wordAnswerRow.classList.add("hidden");
  const totalChars = list.reduce((sum, it) => sum + [...String((it && it.text) || "")].length, 0);
  const totalMs = Math.max(0, totalChars) * 500;
  const totalSec = totalMs / 1000;
  if (reviewPreviewTimer) reviewPreviewTimer.classList.remove("is-hidden");
  const updatePreviewCountdownText = () => {
    const remainMs = Math.max(0, totalMs - (Date.now() - previewStartAt));
    const remainSec = remainMs / 1000;
    const ratio = totalMs > 0 ? Math.max(0, Math.min(1, remainMs / totalMs)) : 0;
    dueCount.textContent = `预览中：共 ${totalChars} 字（总时长 ${totalSec.toFixed(1)} 秒）`;
    if (reviewPreviewTimeText) reviewPreviewTimeText.textContent = `倒计时 ${remainSec.toFixed(1)} 秒`;
    if (reviewPreviewProgressBar) reviewPreviewProgressBar.style.width = `${(ratio * 100).toFixed(1)}%`;
  };
  const previewStartAt = Date.now();
  updatePreviewCountdownText();
  clearReviewPreviewCountdownTimer();
  state.reviewPreviewCountdownTimer = setInterval(() => {
    if (state.reviewPreviewToken !== token) return;
    updatePreviewCountdownText();
  }, 100);
  if (reviewPreview) {
    reviewPreview.textContent = list.map((it) => it.text).join(" ");
    reviewPreview.classList.remove("is-hidden");
  }
  await waitPreviewTick(totalMs);
  clearReviewPreviewCountdownTimer();
  resetPreviewTimerUi();

  if (state.reviewPreviewToken !== token) return;
  state.reviewPreviewRunning = false;
  if (reviewPreview) {
    reviewPreview.textContent = "";
    reviewPreview.classList.add("is-hidden");
  }
  state.reviewActive = true;
  setReviewFlowState("answering");
  renderReviewCard();
  scrollToPageBottom();
}

function startReviewSession(source, emptyMessage) {
  clearAdvanceTimer();
  stopReviewPreviewSequence();
  resetReviewRetryState();
  if (state.reviewDraftActive) rollbackReviewDraftSession();
  const filtered = buildReviewSessionList(source);
  state.reviewList = filtered;
  state.reviewIndex = 0;
  state.reviewActive = false;
  state.reviewSessionSource = "normal";
  state.reviewSessionPointsEarned = 0;
  setReviewFlowState(filtered.length > 0 ? "preview" : "idle");
  resetReviewSessionStats();
  state.reviewMessage = filtered.length > 0 ? "默写前预览中..." : emptyMessage;
  if (filtered.length > 0) beginReviewDraftSession();
  runPreReviewPreviewAndStart();
  scrollReviewCardToTopIfNeeded();
}

function resolveItemByKey(key) {
  if (!key) return null;
  const [type, ...rest] = String(key).split(":");
  const text = rest.join(":");
  if (type === "word") return WORD_MAP.get(text) || null;
  return CHAR_MAP.get(text) || null;
}

function startDirectReviewSession(items, emptyMessage, options = {}) {
  clearAdvanceTimer();
  stopReviewPreviewSequence();
  resetReviewRetryState();
  if (state.reviewDraftActive) rollbackReviewDraftSession();
  const unique = [];
  const seen = new Set();
  items.forEach((it) => {
    if (!it) return;
    const key = `${it.type}:${it.text}`;
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(it);
  });
  state.reviewList = unique;
  state.reviewIndex = Math.max(0, Math.min(unique.length > 0 ? unique.length - 1 : 0, Number(options.startIndex) || 0));
  state.reviewActive = false;
  state.reviewSessionSource = options && options.source ? String(options.source) : "normal";
  state.reviewSessionPointsEarned = 0;
  setReviewFlowState(unique.length > 0 ? "preview" : "idle");
  resetReviewSessionStats(options.initialStats || {});
  state.reviewMessage = unique.length > 0 ? "默写前预览中..." : emptyMessage;
  if (unique.length > 0 && options.useDraftSession !== false) beginReviewDraftSession();
  runPreReviewPreviewAndStart();
}

function cancelReviewSessionWithoutSave() {
  clearAdvanceTimer();
  stopReviewPreviewSequence();
  resetReviewRetryState();
  rollbackReviewDraftSession();
  state.reviewActive = false;
  state.reviewList = [];
  state.reviewIndex = 0;
  state.reviewSessionSource = "normal";
  state.reviewSessionPointsEarned = 0;
  setReviewFlowState("idle");
  state.reviewAwaitingNext = false;
  state.reviewMessage = "已取消本轮默写，数据未保存。";
  renderReviewCard();
}

function renderReviewCard() {
  clearAdvanceTimer();
  const item = state.reviewActive ? currentReviewItem() : null;
  renderReviewButtons();
  reviewBegin.title = state.reviewPreviewRunning
    ? "默写前预览进行中，当前不可点击开始。"
    : state.reviewActive
      ? "默写进行中，当前不可点击开始。"
      : "点击开始本轮默写。";
  reviewRestart.title = state.reviewPreviewRunning
    ? "默写前预览进行中，暂不可重启。"
    : state.reviewActive
      ? "点击后重新开始本轮默写。"
      : "当前没有进行中的默写，无法重启。";
  const total = state.reviewFlowState === "ended" ? state.reviewSessionTotal : state.reviewList.length;
  const current = state.reviewActive ? state.reviewIndex + 1 : state.reviewFlowState === "ended" ? total : 0;
  const levelText = state.reviewLevel === "all" ? "全部" : `HSK${state.reviewLevel}`;
  const countText = state.reviewCount === "all" ? "全部" : `${state.reviewCount}个`;
  const mixText = state.reviewType === "char" ? `，错题混入${state.reviewWrongMixRatio}%` : "";
  dueCount.textContent = `进度: ${current}/${total}（${state.reviewType === "word" ? "词汇" : "汉字"}，${levelText}，${countText}${mixText}）`;

  const keepLastJudgeResult =
    state.reviewFlowState === "ended" &&
    state.reviewLastResult &&
    typeof state.reviewLastResult.isGood === "boolean";
  if (!state.reviewAwaitingNext && !keepLastJudgeResult) {
    reviewFeedback.textContent = "";
    reviewAnswer.textContent = "";
    reviewAnswer.classList.add("is-hidden");
  }
  wordReviewInput.value = "";
  renderReviewSummaryCard();

  if (!item) {
    cleanupAllDictationPads();
    resetPreviewTimerUi();
    reviewPinyin.textContent = "拼音：-";
    reviewMeaning.textContent = "英语解释：-";
    if (reviewPreview && !state.reviewPreviewRunning) {
      reviewPreview.textContent = "";
      reviewPreview.classList.add("is-hidden");
    }
    dictationWriterHost.innerHTML = `<span>${state.reviewMessage}</span>`;
    reviewStartBtn.classList.add("hidden");
    reviewResetBtn.classList.add("hidden");
    if (reviewNextBtn) reviewNextBtn.classList.add("hidden");
    if (reviewStopBtn) reviewStopBtn.classList.add("hidden");
    wordAnswerRow.classList.add("hidden");
    syncIpadLandscapeReviewScale();
    return;
  }

  reviewPinyin.textContent = `拼音：${item.pinyin || "-"}`;
  reviewMeaning.textContent = `英语解释：${item.meaning || "-"}`;
  if (!state.reviewPreviewRunning) resetPreviewTimerUi();
  if (item.type === "char") {
    wordAnswerRow.classList.add("hidden");
    reviewStartBtn.classList.remove("hidden");
    reviewResetBtn.classList.remove("hidden");
    initDictationPad();
  } else {
    initWordDictationPads(item);
    reviewStartBtn.classList.remove("hidden");
    reviewResetBtn.classList.remove("hidden");
    wordAnswerRow.classList.add("hidden");
  }
  renderReviewButtons();
  syncIpadLandscapeReviewScale();
  if (!state.reviewAwaitingNext) speakPrompt(item);
}

function finalizeReviewResult(item, isGood, accuracyPercent, meta = {}) {
  const isWrongBookSinglePractice = state.reviewSessionSource === "wrongbook-single";
  const earnedPoints = 1;
  const judgeSourceText = meta && meta.judgeDetail ? `（${getJudgeSourceLabel(meta.judgeDetail)}）` : "";
  state.reviewLastResult = { isGood, accuracyPercent, itemKey: makeItemKey(item) };
  state.reviewAwaitingNext = true;
  state.reviewSessionCorrect += isGood ? 1 : 0;
  state.reviewSessionWrong += isGood ? 0 : 1;
  if (!isGood) state.reviewSessionWrongItems.push(item.text);

  if (isGood) {
    reviewFeedback.textContent = `${item.type === "word" ? "词语" : "默写"}正确${isWrongBookSinglePractice ? "（练习模式）" : ""}${judgeSourceText}`;
    if (!isWrongBookSinglePractice) {
      scheduleProgress(item, true);
      removeWrongItem(item);
      state.reviewSessionPointsEarned += earnedPoints;
    }
  } else {
    reviewFeedback.textContent = `${item.type === "word" ? "词语" : "默写"}不正确${judgeSourceText}`;
    reviewAnswer.textContent = `正确答案：${item.text}（${item.meaning || ""}）`;
    reviewAnswer.classList.remove("is-hidden");
    if (!isWrongBookSinglePractice) {
      scheduleProgress(item, false);
      if (item.type !== "word") addWrongItem(item);
    }
  }
  state.reviewLastJudgeDisplay = {
    feedback: String(reviewFeedback.textContent || ""),
    answer: reviewAnswer.classList.contains("is-hidden") ? "" : String(reviewAnswer.textContent || "")
  };

  if (!isWrongBookSinglePractice && item.type === "char" && isGood && meta.mlFeatureAccepted && Array.isArray(meta.mlFeature)) {
    updateCharMlPrototype(item.text, meta.mlFeature);
  }
  if (!isWrongBookSinglePractice && item.type === "word" && isGood && Array.isArray(meta.mlUpdates)) {
    meta.mlUpdates.forEach((x) => {
      if (!x || !x.isGood || !x.accepted || !x.char || !Array.isArray(x.feature)) return;
      updateCharMlPrototype(x.char, x.feature);
    });
  }

  // 词汇默写按单字判定：把写错的字加入错题本。
  if (!isWrongBookSinglePractice && item.type === "word" && Array.isArray(meta.wordCharResults)) {
    meta.wordCharResults.forEach((x) => {
      if (!x || x.isGood) return;
      const ch = String(x.char || "").trim();
      if (!ch) return;
      const charItem = CHAR_MAP.get(ch);
      if (!charItem) return;
      addWrongItem(charItem);
    });
  }

  if (!isWrongBookSinglePractice) {
    saveProgress();
    refreshReviewDraftSnapshotToCurrent();
    syncUserDataToServer()
      .then(() => {
        refreshReviewDraftSnapshotToCurrent();
      })
      .catch((err) => {
        console.warn("sync user data failed:", err && err.message ? err.message : err);
      });
  }
  refreshStats();
  recordSubmission(item, isGood, accuracyPercent, {
    ...meta,
    points: isWrongBookSinglePractice ? 0 : earnedPoints
  });
  renderAdminPanel();
  renderUserRecords();

  if (state.reviewIndex >= state.reviewList.length - 1) {
    finishReviewSession(isWrongBookSinglePractice);
    return;
  }
  setReviewFlowState("reviewed");
  renderReviewButtons();
}

function evaluateWordInput() {
  evaluateWordDrawing();
}

function getBinaryData(ctx, size) {
  const image = ctx.getImageData(0, 0, size, size).data;
  const bits = new Uint8Array(size * size);
  for (let i = 0; i < bits.length; i += 1) {
    const idx = i * 4;
    const luminance = image[idx] * 0.299 + image[idx + 1] * 0.587 + image[idx + 2] * 0.114;
    bits[i] = luminance < 220 ? 1 : 0;
  }
  return bits;
}

function findBoundingBox(bits, size) {
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) return null;
  return { minX, minY, maxX, maxY };
}

function normalizeBits(bits, size, targetSize = 96, padding = 8) {
  const out = new Uint8Array(targetSize * targetSize);
  const box = findBoundingBox(bits, size);
  if (!box) return out;

  const sourceW = box.maxX - box.minX + 1;
  const sourceH = box.maxY - box.minY + 1;
  const drawW = Math.max(1, targetSize - padding * 2);
  const drawH = Math.max(1, targetSize - padding * 2);
  const scale = Math.max(0.01, Math.min(drawW / sourceW, drawH / sourceH));
  const mappedW = Math.max(1, Math.round(sourceW * scale));
  const mappedH = Math.max(1, Math.round(sourceH * scale));
  const offsetX = Math.floor((targetSize - mappedW) / 2);
  const offsetY = Math.floor((targetSize - mappedH) / 2);

  for (let y = 0; y < mappedH; y += 1) {
    const sy = box.minY + Math.min(sourceH - 1, Math.floor(y / scale));
    for (let x = 0; x < mappedW; x += 1) {
      const sx = box.minX + Math.min(sourceW - 1, Math.floor(x / scale));
      if (bits[sy * size + sx]) out[(offsetY + y) * targetSize + (offsetX + x)] = 1;
    }
  }
  return out;
}

function dilateBits(bits, size, radius = 1) {
  if (radius <= 0) return bits;
  const out = new Uint8Array(bits.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny < 0 || ny >= size || nx < 0 || nx >= size) continue;
          out[ny * size + nx] = 1;
        }
      }
    }
  }
  return out;
}

function shiftBits(bits, size, dx, dy) {
  const out = new Uint8Array(bits.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
      out[ny * size + nx] = 1;
    }
  }
  return out;
}

function denoiseBits(bits, size) {
  const out = new Uint8Array(bits.length);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const idx = y * size + x;
      if (!bits[idx]) continue;
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
          if (bits[ny * size + nx]) neighbors += 1;
        }
      }
      if (neighbors >= 1) out[idx] = 1;
    }
  }
  return out;
}

function scoreWritingBase(userBits, templateBits, size) {
  let userCount = 0;
  let templateCount = 0;
  let overlapWithTemplateTol = 0;
  let overlapWithUserTol = 0;

  const templateTol = dilateBits(templateBits, size, 2);
  const userTol = dilateBits(userBits, size, 2);

  for (let i = 0; i < userBits.length; i += 1) {
    if (userBits[i]) userCount += 1;
    if (templateBits[i]) templateCount += 1;
    if (userBits[i] && templateTol[i]) overlapWithTemplateTol += 1;
    if (templateBits[i] && userTol[i]) overlapWithUserTol += 1;
  }

  if (userCount < 20) return { pass: false, score: 0 };
  const precision = overlapWithTemplateTol / Math.max(1, userCount);
  const recall = overlapWithUserTol / Math.max(1, templateCount);
  const sizeBalance = 1 - Math.min(1, Math.abs(userCount - templateCount) / Math.max(templateCount, 1));
  const score = 0.35 * precision + 0.55 * recall + 0.1 * sizeBalance;
  return { pass: score >= 0.58, score };
}

function countActiveBits(bits) {
  let c = 0;
  for (let i = 0; i < bits.length; i += 1) {
    if (bits[i]) c += 1;
  }
  return c;
}

function buildProjectionProfiles(bits, size) {
  const row = new Float32Array(size);
  const col = new Float32Array(size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      row[y] += 1;
      col[x] += 1;
    }
  }
  return { row, col };
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const av = a[i];
    const bv = b[i];
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  if (na <= 0 || nb <= 0) return 0;
  return dot / Math.sqrt(na * nb);
}

function scoreProjectionEngine(userBits, templateBits, size) {
  const u = buildProjectionProfiles(userBits, size);
  const t = buildProjectionProfiles(templateBits, size);
  const rowSim = cosineSimilarity(u.row, t.row);
  const colSim = cosineSimilarity(u.col, t.col);
  const score = Math.max(0, Math.min(1, 0.5 * rowSim + 0.5 * colSim));
  return score;
}

function buildGridDensity(bits, size, cells = 8) {
  const grid = new Float32Array(cells * cells);
  const cellW = size / cells;
  const cellH = size / cells;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!bits[y * size + x]) continue;
      const gx = Math.min(cells - 1, Math.floor(x / cellW));
      const gy = Math.min(cells - 1, Math.floor(y / cellH));
      grid[gy * cells + gx] += 1;
    }
  }
  return grid;
}

function scoreGridEngine(userBits, templateBits, size) {
  const u = buildGridDensity(userBits, size, 8);
  const t = buildGridDensity(templateBits, size, 8);
  const score = cosineSimilarity(u, t);
  return Math.max(0, Math.min(1, score));
}

function downsampleProfile(profile, bins = 12) {
  const n = profile.length;
  const out = new Float32Array(bins);
  if (!n || bins <= 0) return out;
  const step = n / bins;
  for (let i = 0; i < bins; i += 1) {
    const start = Math.floor(i * step);
    const end = Math.max(start + 1, Math.floor((i + 1) * step));
    let sum = 0;
    let cnt = 0;
    for (let j = start; j < Math.min(n, end); j += 1) {
      sum += profile[j];
      cnt += 1;
    }
    out[i] = cnt > 0 ? sum / cnt : 0;
  }
  return out;
}

function extractMlFeature(bits, size) {
  const total = Math.max(1, countActiveBits(bits));
  const grid = buildGridDensity(bits, size, 8);
  const gridNorm = Array.from(grid, (x) => x / total);
  const proj = buildProjectionProfiles(bits, size);
  const row = downsampleProfile(proj.row, 12);
  const col = downsampleProfile(proj.col, 12);
  const rowNorm = Array.from(row, (x) => x / size);
  const colNorm = Array.from(col, (x) => x / size);
  const box = findBoundingBox(bits, size);
  const boxW = box ? box.maxX - box.minX + 1 : 1;
  const boxH = box ? box.maxY - box.minY + 1 : 1;
  const aspect = Math.max(0.2, Math.min(3, boxW / Math.max(1, boxH)));
  const cover = Math.max(0, Math.min(1, (boxW * boxH) / (size * size)));
  const density = Math.max(0, Math.min(1, total / Math.max(1, boxW * boxH)));
  return [...gridNorm, ...rowNorm, ...colNorm, aspect / 3, cover, density];
}

function updateCharMlPrototype(char, feature) {
  if (!char || !Array.isArray(feature) || feature.length === 0) return;
  const item = CHAR_MAP.get(char);
  if (!item) return;
  const p = getProgress(item);
  const cur = Array.isArray(p.mlFeatureMean) ? p.mlFeatureMean : null;
  const count = Math.max(0, Number(p.mlFeatureCount) || 0);
  if (!cur || cur.length !== feature.length) {
    p.mlFeatureMean = [...feature];
    p.mlFeatureCount = 1;
    return;
  }
  const alpha = count < 10 ? 0.22 : 0.12;
  const next = new Array(feature.length);
  for (let i = 0; i < feature.length; i += 1) {
    const prevV = Number(cur[i]) || 0;
    const newV = Number(feature[i]) || 0;
    next[i] = (1 - alpha) * prevV + alpha * newV;
  }
  p.mlFeatureMean = next;
  p.mlFeatureCount = count + 1;
}

function scorePersonalMlForChar(char, userBits, size) {
  const item = CHAR_MAP.get(char);
  if (!item) return null;
  const p = getProgress(item);
  const proto = Array.isArray(p.mlFeatureMean) ? p.mlFeatureMean : null;
  if (!proto || proto.length === 0) return null;
  const feat = extractMlFeature(userBits, size);
  if (proto.length !== feat.length) return null;
  const sim = cosineSimilarity(proto, feat);
  return Math.max(0, Math.min(1, sim));
}

function scoreWritingWithWeights(userBits, templateBits, size, weights) {
  const cleanUser = denoiseBits(userBits, size);
  const cleanTemplate = denoiseBits(templateBits, size);
  const minInk = 20;
  if (countActiveBits(cleanUser) < minInk) {
    return { score: 0, engines: { overlap: 0, projection: 0, grid: 0 } };
  }

  let best = { score: 0, overlap: 0, projection: 0, grid: 0 };
  const overlapW = Number(weights && weights.overlap) || 0;
  const projectionW = Number(weights && weights.projection) || 0;
  const gridW = Number(weights && weights.grid) || 0;
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const shifted = dx === 0 && dy === 0 ? cleanUser : shiftBits(cleanUser, size, dx, dy);
      const overlap = scoreWritingBase(shifted, cleanTemplate, size).score;
      const projection = scoreProjectionEngine(shifted, cleanTemplate, size);
      const grid = scoreGridEngine(shifted, cleanTemplate, size);
      const combined = overlapW * overlap + projectionW * projection + gridW * grid;
      if (combined > best.score) best = { score: combined, overlap, projection, grid };
    }
  }
  return {
    score: Math.max(0, Math.min(1, best.score)),
    engines: {
      overlap: Math.max(0, Math.min(1, best.overlap)),
      projection: Math.max(0, Math.min(1, best.projection)),
      grid: Math.max(0, Math.min(1, best.grid))
    }
  };
}

function scoreWriting(userBits, templateBits, size) {
  const scored = scoreWritingWithWeights(userBits, templateBits, size, { overlap: 0.52, projection: 0.28, grid: 0.2 });
  return {
    pass: scored.score >= 0.62,
    score: scored.score,
    engines: scored.engines
  };
}

let recognitionTierThresholdsCache = null;
const templateBitsCache = new Map();
let recognitionTierWarmupStarted = false;
let recognitionTierWarmupTimer = null;

function isRecognitionV2Enabled() {
  return state.flags.recognitionV2Enabled !== false;
}

function scheduleRecognitionTierWarmup(delayMs = 0) {
  if (recognitionTierThresholdsCache || recognitionTierWarmupStarted) return;
  if (!recognitionCore || typeof recognitionCore.computeQuantileThresholds !== "function") return;
  recognitionTierWarmupStarted = true;
  const size = 96;
  const counts = [];
  let index = 0;
  const chunkSize = 8;
  const executeSlice = (budgetMs = 8) => {
    const deadline = performance.now() + Math.max(2, Number(budgetMs) || 8);
    while (index < CHAR_ITEMS.length && performance.now() < deadline) {
      const end = Math.min(index + chunkSize, CHAR_ITEMS.length);
      for (; index < end; index += 1) {
        const item = CHAR_ITEMS[index];
        const count = countActiveBits(createTemplateBitsForCharRaw(item.text, size));
        if (count > 0) counts.push(count);
      }
    }
  };
  const scheduleNext = (ms = 0) => {
    recognitionTierWarmupTimer = window.setTimeout(runChunk, Math.max(0, Number(ms) || 0));
  };
  const runChunk = (idleDeadline) => {
    if (state.reviewActive && state.reviewFlowState === "answering") {
      scheduleNext(250);
      return;
    }
    if (idleDeadline && typeof idleDeadline.timeRemaining === "function") {
      executeSlice(idleDeadline.timeRemaining());
    } else {
      executeSlice(6);
    }
    if (index < CHAR_ITEMS.length) {
      if (typeof window.requestIdleCallback === "function") {
        recognitionTierWarmupTimer = window.requestIdleCallback(runChunk, { timeout: 500 });
      } else {
        scheduleNext(16);
      }
      return;
    }
    recognitionTierThresholdsCache = recognitionCore.computeQuantileThresholds(counts, 0.33, 0.66);
    recognitionTierWarmupStarted = false;
    recognitionTierWarmupTimer = null;
  };
  if (typeof window.requestIdleCallback === "function") {
    recognitionTierWarmupTimer = window.setTimeout(() => {
      recognitionTierWarmupTimer = window.requestIdleCallback(runChunk, { timeout: 800 });
    }, Math.max(0, Number(delayMs) || 0));
  } else {
    scheduleNext(delayMs);
  }
}

function getRecognitionTierThresholds() {
  if (recognitionTierThresholdsCache) return recognitionTierThresholdsCache;
  scheduleRecognitionTierWarmup();
  return null;
}

function resolveCharJudgeOutcome(char, userBits, templateBits, retryAttempt) {
  const mlScore = scorePersonalMlForChar(char, userBits, 96);
  if (!isRecognitionV2Enabled() || !recognitionCore || typeof recognitionCore.decideRecognition !== "function") {
    const legacy = scoreWriting(userBits, templateBits, 96);
    const blendedScore = typeof mlScore === "number" ? 0.78 * legacy.score + 0.22 * mlScore : legacy.score;
    const pass = typeof mlScore === "number" ? blendedScore >= 0.61 || (mlScore >= 0.93 && legacy.score >= 0.5) : legacy.pass;
    return {
      finalDecision: pass ? "pass" : "fail",
      detail: normalizeJudgeDetail({
        version: "v1",
        decision: pass ? "pass" : "fail",
        decisionScore: blendedScore,
        baseScore: legacy.score,
        mlScore: typeof mlScore === "number" ? mlScore : null,
        blendedScore,
        tier: "medium",
        thresholds: { pass: 0.61, retryLow: 0.56 },
        engines: legacy.engines,
        retryAttempt: Math.max(0, Number(retryAttempt) || 0),
        reason: pass ? "pass_threshold" : "below_threshold"
      }),
      score: Math.max(0, Math.min(1, blendedScore)),
      mlScore,
      mlAccepted: pass
    };
  }

  const quantiles = getRecognitionTierThresholds();
  const hasTierQuantiles = !!(quantiles && Number(quantiles.sampleSize) > 0);
  const tier = hasTierQuantiles ? recognitionCore.resolveTier(countActiveBits(templateBits), quantiles) : "medium";
  const profile = recognitionCore.resolveTierProfile(tier);
  const scored = scoreWritingWithWeights(userBits, templateBits, 96, profile.weights);
  const detail = normalizeJudgeDetail(
    recognitionCore.decideRecognition({
      tier,
      engines: scored.engines,
      mlScore,
      retryAttempt: Math.max(0, Number(retryAttempt) || 0)
    })
  );

  return {
    finalDecision: detail.decision,
    detail,
    score: Math.max(0, Math.min(1, Number(detail.decisionScore) || 0)),
    mlScore,
    mlAccepted: typeof recognitionCore.isMlUpdateEligible === "function" ? recognitionCore.isMlUpdateEligible(detail) : false
  };
}

function createReviewRetryState() {
  return { itemKey: "", attempt: 0, pendingIndexes: [], frozenWordResults: [] };
}

function getReviewRetryState(item) {
  const key = makeItemKey(item);
  if (!state.reviewRetryState || state.reviewRetryState.itemKey !== key) {
    state.reviewRetryState = createReviewRetryState();
    state.reviewRetryState.itemKey = key;
  }
  return state.reviewRetryState;
}

function resetReviewRetryState() {
  state.reviewRetryState = createReviewRetryState();
}

function resetWriteRetryState(itemKey = "") {
  state.writeRetryState = { itemKey, attempt: 0 };
}

async function resolveOcrJudgeOutcome(target, handwritingImage, type = "char", candidates = []) {
  try {
    const response = await requestOcrJudge({
      image: handwritingImage,
      target,
      type,
      candidates: Array.isArray(candidates) ? candidates : []
    });
    const detail = normalizeJudgeDetail(response && response.judgeDetail);
    if (!detail) return null;
    return {
      source: "ocr",
      response,
      detail,
      finalDecision: detail.decision === "pass" ? "pass" : "fail",
      score: Math.max(0, Math.min(1, Number(detail.decisionScore) || Number(response.bestScore) || 0)),
      accuracyPercent: normalizeAccuracyPercent(response && response.accuracyPercent),
      recognizedText: String((response && response.recognizedText) || "")
    };
  } catch (err) {
    console.warn("[OCR] judge failed, fallback to local:", err && err.message ? err.message : err);
    return null;
  }
}

function drawStrokesToCanvas(strokes, sourceSize, size) {
  const out = document.createElement("canvas");
  out.width = size;
  out.height = size;
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);

  const scale = size / sourceSize;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 8 * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  strokes.forEach((stroke) => {
    ctx.beginPath();
    stroke.forEach((point, idx) => {
      const x = point.x * scale;
      const y = point.y * scale;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
  return out;
}

function drawPadStrokesToCanvas(pad, size) {
  return drawStrokesToCanvas(pad.strokes, pad && pad.canvas ? pad.canvas.width : 320, size);
}

async function evaluateDrawing() {
  const item = currentReviewItem();
  if (!item || item.type !== "char") return;
  if (state.reviewAwaitingNext) {
    reviewFeedback.textContent = "请点击“下一个字”继续。";
    return;
  }
  if (!state.dictationPad) {
    reviewFeedback.textContent = "画布未初始化，请点击重写本题。";
    return;
  }
  if (state.dictationPad.strokeCount === 0) {
    reviewFeedback.textContent = "请先写完字，再点击完成并判定。";
    return;
  }

  const size = 96;
  const userCanvas = drawPadStrokesToCanvas(state.dictationPad, size);
  const userCtx = userCanvas.getContext("2d");

  const userBits = normalizeBits(getBinaryData(userCtx, size), size, size, 10);
  const templateBits = createTemplateBitsForChar(item.text, size);
  const retryState = getReviewRetryState(item);
  const handwritingImage = userCanvas.toDataURL("image/png");
  setJudgeLoading(reviewFeedback, reviewStartBtn, "正在进行 OCR 判定");
  try {
    const ocrOutcome = await resolveOcrJudgeOutcome(item.text, handwritingImage, "char", [item.text]);
    const outcome = ocrOutcome || resolveCharJudgeOutcome(item.text, userBits, templateBits, retryState.attempt);
    if (outcome.finalDecision === "retry" && retryState.attempt < 1) {
      retryState.attempt = 1;
      if (state.dictationPad && typeof state.dictationPad.reset === "function") state.dictationPad.reset();
      reviewFeedback.textContent = "接近正确，请再写一次。";
      reviewAnswer.textContent = "";
      reviewAnswer.classList.add("is-hidden");
      return;
    }

    const finalPass = outcome.finalDecision === "pass";
    const accuracy = ocrOutcome
      ? normalizeAccuracyPercent(ocrOutcome.accuracyPercent || Math.round(outcome.score * 100))
      : Math.max(0, Math.min(100, Math.round(outcome.score * 100)));
    finalizeReviewResult(item, finalPass, accuracy, {
      handwritingImage,
      mlFeature: extractMlFeature(userBits, size),
      mlFeatureAccepted: finalPass && outcome.mlAccepted,
      judgeDetail: outcome.detail,
      ocrResponse: ocrOutcome ? ocrOutcome.response : null
    });
    resetReviewRetryState();
  } finally {
    clearJudgeLoading(reviewFeedback, reviewStartBtn);
  }
}

function createTemplateBitsForCharRaw(char, size) {
  const templateCanvas = document.createElement("canvas");
  templateCanvas.width = size;
  templateCanvas.height = size;
  const templateCtx = templateCanvas.getContext("2d");
  templateCtx.fillStyle = "#fff";
  templateCtx.fillRect(0, 0, size, size);
  templateCtx.fillStyle = "#000";
  templateCtx.font = "76px 'Noto Serif SC'";
  templateCtx.textAlign = "center";
  templateCtx.textBaseline = "middle";
  templateCtx.fillText(char, size / 2, size / 2 + 2);
  return normalizeBits(getBinaryData(templateCtx, size), size, size, 10);
}

function createTemplateBitsForChar(char, size) {
  const key = `${size}:${char}`;
  if (templateBitsCache.has(key)) return templateBitsCache.get(key);
  const bits = createTemplateBitsForCharRaw(char, size);
  templateBitsCache.set(key, bits);
  return bits;
}

async function evaluateWordDrawing() {
  const item = currentReviewItem();
  if (!item || item.type !== "word") return;
  if (state.reviewAwaitingNext) {
    reviewFeedback.textContent = "请点击“下一个字”继续。";
    return;
  }
  if (!Array.isArray(state.dictationPads) || state.dictationPads.length === 0) {
    reviewFeedback.textContent = "词汇手写框未初始化，请点击重写本题。";
    return;
  }

  const chars = [...item.text];
  const size = 96;
  if (chars.length !== state.dictationPads.length) {
    reviewFeedback.textContent = "手写框数量与词汇字符数不一致，请重写本题。";
    return;
  }

  const retryState = getReviewRetryState(item);
  const retryAttempt = Math.max(0, Number(retryState.attempt) || 0);
  const retryMode = retryAttempt > 0 && Array.isArray(retryState.pendingIndexes) && retryState.pendingIndexes.length > 0;
  const pendingSet = new Set(retryMode ? retryState.pendingIndexes : []);
  const charResults = retryMode
    ? (Array.isArray(retryState.frozenWordResults) ? retryState.frozenWordResults.map((x) => (x ? { ...x } : x)) : new Array(chars.length).fill(null))
    : new Array(chars.length).fill(null);
  const nextPendingIndexes = [];
  setJudgeLoading(reviewFeedback, reviewStartBtn, "正在进行 OCR 判定");
  try {
    for (let i = 0; i < chars.length; i += 1) {
      if (retryMode && !pendingSet.has(i)) continue;
      const pad = state.dictationPads[i];
      if (!pad || pad.strokeCount === 0) {
        reviewFeedback.textContent = `请先完成第 ${i + 1} 个字的书写。`;
        return;
      }
      const userCanvas = drawPadStrokesToCanvas(pad, size);
      const userCtx = userCanvas.getContext("2d");
      const userBits = normalizeBits(getBinaryData(userCtx, size), size, size, 10);
      const templateBits = createTemplateBitsForChar(chars[i], size);
      const handwritingImage = userCanvas.toDataURL("image/png");
      reviewFeedback.textContent = `正在进行 OCR 判定（第 ${i + 1} 字）`;
      const ocrOutcome = await resolveOcrJudgeOutcome(chars[i], handwritingImage, "char", [chars[i]]);
      const outcome = ocrOutcome || resolveCharJudgeOutcome(chars[i], userBits, templateBits, retryAttempt);
      if (!retryMode && outcome.finalDecision === "retry") {
        nextPendingIndexes.push(i);
        continue;
      }

      const isGood = outcome.finalDecision === "pass";
      const accuracy = ocrOutcome
        ? normalizeAccuracyPercent(ocrOutcome.accuracyPercent || Math.round(outcome.score * 100))
        : Math.max(0, Math.min(100, Math.round(outcome.score * 100)));
      charResults[i] = {
        char: chars[i],
        isGood,
        accuracyPercent: accuracy,
        handwritingImage,
        judgeDetail: outcome.detail,
        mlFeature: extractMlFeature(userBits, size),
        mlFeatureAccepted: isGood && outcome.mlAccepted
      };
    }

    if (!retryMode && nextPendingIndexes.length > 0) {
      retryState.attempt = 1;
      retryState.pendingIndexes = nextPendingIndexes;
      retryState.frozenWordResults = charResults;
      nextPendingIndexes.forEach((index) => {
        const pad = state.dictationPads[index];
        if (pad && typeof pad.reset === "function") pad.reset();
      });
      const pendingText = nextPendingIndexes.map((x) => x + 1).join("、");
      reviewFeedback.textContent = `第 ${pendingText} 字接近正确，请重写这些字后再判定。`;
      reviewAnswer.textContent = "";
      reviewAnswer.classList.add("is-hidden");
      return;
    }

  const normalizedCharResults = charResults.map((x, idx) => {
    if (x) return x;
    return {
      char: chars[idx],
      isGood: false,
      accuracyPercent: 0,
      handwritingImage: "",
      judgeDetail: normalizeJudgeDetail({
        version: "v2",
        decision: "fail",
        decisionScore: 0,
        baseScore: 0,
        mlScore: null,
        blendedScore: 0,
        tier: "medium",
        thresholds: { pass: 0.61, retryLow: 0.56 },
        engines: { overlap: 0, projection: 0, grid: 0 },
        retryAttempt,
        reason: "missing_result"
      }),
      mlFeature: [],
      mlFeatureAccepted: false
    };
  });
  const isGood = normalizedCharResults.every((x) => x.isGood);
  const accuracyPercent = Math.round(
    normalizedCharResults.reduce((sum, x) => sum + x.accuracyPercent, 0) / Math.max(1, normalizedCharResults.length)
  );
  const detailText = normalizedCharResults
    .map((x, idx) => `第${idx + 1}字${x.isGood ? "正确" : "错误"}(${x.accuracyPercent}%)`)
    .join("，");
  const usedOcrJudge = normalizedCharResults.some((x) => isOcrJudgeDetail(x && x.judgeDetail));
  const itemJudgeDetail = normalizeJudgeDetail({
    version: usedOcrJudge ? "paddleocr-v1" : "v2",
    decision: isGood ? "pass" : "fail",
    decisionScore: accuracyPercent / 100,
    baseScore: accuracyPercent / 100,
    mlScore: null,
    blendedScore: accuracyPercent / 100,
    tier: "medium",
    thresholds: { pass: 0.61, retryLow: 0.56 },
    engines: { overlap: 0, projection: 0, grid: 0 },
    retryAttempt,
    reason: isGood ? "word_all_pass" : "word_partial_fail",
    ocrFirst: usedOcrJudge,
    engine: usedOcrJudge ? "PP-OCRv5_server_rec" : ""
  });
    finalizeReviewResult(item, isGood, accuracyPercent, {
      userAnswer: detailText,
      wordCharResults: normalizedCharResults.map((x) => ({
        char: x.char,
        isGood: x.isGood,
        accuracyPercent: x.accuracyPercent,
        handwritingImage: x.handwritingImage,
        judgeDetail: x.judgeDetail
      })),
      mlUpdates: normalizedCharResults.map((x) => ({
        char: x.char,
        isGood: x.isGood,
        feature: x.mlFeature,
        accepted: Boolean(x.mlFeatureAccepted)
      })),
      handwritingImage: normalizedCharResults.map((x) => x.handwritingImage).join("||"),
      judgeDetail: itemJudgeDetail
    });
    resetReviewRetryState();
  } finally {
    clearJudgeLoading(reviewFeedback, reviewStartBtn);
  }
}

function cleanupDictationPad() {
  if (state.dictationPad && typeof state.dictationPad.cleanup === "function") {
    state.dictationPad.cleanup();
  }
  state.dictationPad = null;
}

function cleanupAllDictationPads() {
  cleanupDictationPad();
  if (Array.isArray(state.dictationPads)) {
    state.dictationPads.forEach((pad) => {
      if (pad && typeof pad.cleanup === "function") pad.cleanup();
    });
  }
  state.dictationPads = [];
  dictationWriterHost.classList.remove("word-mode");
}

function createHandwritingPad(container, canvasSize = 320) {
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  canvas.className = "dictation-canvas";
  canvas.setAttribute("aria-label", "汉字默写画布");
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const pad = { canvas, ctx, drawing: false, currentStroke: [], strokes: [], strokeCount: 0, cleanup: null, reset: null };

  function drawPad() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#e6dcc2";
    ctx.lineWidth = 1;
    [
      [0, 0, canvas.width, canvas.height],
      [canvas.width, 0, 0, canvas.height],
      [0, canvas.height / 2, canvas.width, canvas.height / 2],
      [canvas.width / 2, 0, canvas.width / 2, canvas.height]
    ].forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line[0], line[1]);
      ctx.lineTo(line[2], line[3]);
      ctx.stroke();
    });

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    pad.strokes.forEach((stroke) => {
      ctx.beginPath();
      stroke.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (source.clientX - rect.left) * scaleX, y: (source.clientY - rect.top) * scaleY };
  }

  function start(event) {
    pad.drawing = true;
    pad.currentStroke = [getPoint(event)];
  }

  function move(event) {
    if (!pad.drawing) return;
    event.preventDefault();
    pad.currentStroke.push(getPoint(event));
    drawPad();
    ctx.beginPath();
    pad.currentStroke.forEach((point, idx) => {
      if (idx === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  function end() {
    if (!pad.drawing) return;
    pad.drawing = false;
    if (pad.currentStroke.length > 1) {
      pad.strokes.push(pad.currentStroke);
      pad.strokeCount += 1;
    }
    pad.currentStroke = [];
    drawPad();
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);

  pad.reset = () => {
    pad.drawing = false;
    pad.currentStroke = [];
    pad.strokes = [];
    pad.strokeCount = 0;
    drawPad();
  };

  pad.cleanup = () => {
    canvas.removeEventListener("mousedown", start);
    canvas.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", end);
    canvas.removeEventListener("touchstart", start);
    canvas.removeEventListener("touchmove", move);
    window.removeEventListener("touchend", end);
  };

  drawPad();
  return pad;
}

function initDictationPad() {
  cleanupAllDictationPads();
  dictationWriterHost.classList.remove("word-mode");
  dictationWriterHost.innerHTML = "";
  state.dictationPad = createHandwritingPad(dictationWriterHost, 320);
}

function initWordDictationPads(item) {
  cleanupAllDictationPads();
  dictationWriterHost.classList.add("word-mode");
  const chars = [...(item && item.text ? item.text : "")];
  dictationWriterHost.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "word-dictation-grid";
  const pads = [];
  chars.forEach((_, idx) => {
    const cell = document.createElement("div");
    cell.className = "word-dictation-cell";
    const label = document.createElement("p");
    label.className = "word-dictation-label";
    label.textContent = `第 ${idx + 1} 字`;
    const host = document.createElement("div");
    host.className = "word-dictation-canvas-host";
    cell.appendChild(label);
    cell.appendChild(host);
    grid.appendChild(cell);
    pads.push(createHandwritingPad(host, 220));
  });
  dictationWriterHost.appendChild(grid);
  state.dictationPads = pads;
}

function wireLearn() {
  document.getElementById("prev-char").addEventListener("click", () => {
    moveLearn(-1);
  });

  document.getElementById("next-char").addEventListener("click", () => {
    moveLearn(1);
  });

  document.getElementById("learn-play").addEventListener("click", () => {
    const item = currentLearnList()[state.learnIndex];
    if (!item) return;
    speakLearnItem(item);
  });

  document.getElementById("learn-mode-toggle").addEventListener("click", () => {
    state.learnRandomMode = !state.learnRandomMode;
    renderLearnCard();
  });

  document.getElementById("learn-auto-speak").addEventListener("click", () => {
    state.learnAutoSpeak = !state.learnAutoSpeak;
    renderLearnCard();
  });

  document.getElementById("toggle-detail").addEventListener("click", () => {
    learnCard.querySelector(".meta").classList.toggle("is-hidden");
  });

  learnTypeFilter.addEventListener("change", (e) => {
    state.learnType = e.target.value;
    state.learnIndex = 0;
    state.learnCharPage = 1;
    renderLearnCard();
    queueLearnCharListRender();
  });

  levelFilter.addEventListener("change", (e) => {
    state.level = e.target.value;
    state.learnIndex = 0;
    state.learnCharPage = 1;
    renderLearnCard();
    queueLearnCharListRender();
  });

  if (learnCharSearch) {
    learnCharSearch.addEventListener("input", (event) => {
      state.learnCharSearch = event.target.value || "";
      state.learnCharPage = 1;
      queueLearnCharListRender();
    });
  }

  if (learnListLevelFilter) {
    learnListLevelFilter.addEventListener("change", (event) => {
      state.learnListLevelFilter = event.target.value || "all";
      state.learnCharPage = 1;
      queueLearnCharListRender();
    });
  }

  learnListTypeFilter.addEventListener("change", (event) => {
    state.learnListTypeFilter = event.target.value || "all";
    state.learnCharPage = 1;
    queueLearnCharListRender();
  });

  if (learnDictationCountFilter) {
    learnDictationCountFilter.addEventListener("change", (event) => {
      state.learnDictationCountFilter = event.target.value || "all";
      state.learnCharPage = 1;
      queueLearnCharListRender();
    });
  }

  if (learnAccuracyFilter) {
    learnAccuracyFilter.addEventListener("change", (event) => {
      state.learnAccuracyFilter = event.target.value || "all";
      state.learnCharPage = 1;
      queueLearnCharListRender();
    });
  }

  if (learnResetFilters) {
    learnResetFilters.addEventListener("click", () => {
      state.learnCharSearch = "";
      state.learnListLevelFilter = "all";
      state.learnListTypeFilter = "all";
      state.learnDictationCountFilter = "all";
      state.learnAccuracyFilter = "all";
      state.learnCharPage = 1;
      if (learnCharSearch) learnCharSearch.value = "";
      if (learnListLevelFilter) learnListLevelFilter.value = "all";
      if (learnListTypeFilter) learnListTypeFilter.value = "all";
      if (learnDictationCountFilter) learnDictationCountFilter.value = "all";
      if (learnAccuracyFilter) learnAccuracyFilter.value = "all";
      queueLearnCharListRender();
    });
  }

  learnCharPageSize.addEventListener("change", (event) => {
    state.learnCharPageSize = Number(event.target.value) || 50;
    state.learnCharPage = 1;
    queueLearnCharListRender();
  });

  learnCharPrev.addEventListener("click", () => {
    state.learnCharPage = Math.max(1, state.learnCharPage - 1);
    queueLearnCharListRender();
  });

  learnCharNext.addEventListener("click", () => {
    state.learnCharPage += 1;
    queueLearnCharListRender();
  });

  learnCharList.addEventListener("click", (event) => {
    const ck = event.target.closest("input[data-action='select-item']");
    if (ck) {
      const key = ck.dataset.key;
      const set = new Set(state.learnSelectedKeys || []);
        if (ck.checked) set.add(key);
        else set.delete(key);
        state.learnSelectedKeys = [...set];
        queueLearnCharListRender();
        syncWriteListFromLearnSelection();
        return;
    }
    const strokeCell = event.target.closest("td[data-action='show-stroke-demo']");
    if (strokeCell) {
      startCharStrokeDemo(strokeCell.dataset.char);
      return;
    }
  });

  learnSelectPage.addEventListener("click", () => {
    const checks = Array.from(learnCharList.querySelectorAll("input[data-action='select-item']"));
    const set = new Set(state.learnSelectedKeys || []);
    checks.forEach((x) => set.add(x.dataset.key));
    state.learnSelectedKeys = [...set];
    queueLearnCharListRender();
    syncWriteListFromLearnSelection();
  });

  learnClearSelected.addEventListener("click", () => {
    state.learnSelectedKeys = [];
    queueLearnCharListRender();
    syncWriteListFromLearnSelection({ resetPage: true });
  });

  learnDemoSelected.addEventListener("click", () => {
    const chars = getLearnSelectedCharItems();
    if (!chars.length) {
      learnListSummary.textContent = "请先在列表中勾选至少一个汉字，再进行批量演示。";
      return;
    }
    state.writeSelectedChars = chars.map((it) => it.text);
    syncWriteListFromLearnSelection({ resetPage: true });
    switchTab("write");
    playWriteBatchDemo();
  });

  learnDictateSelected.addEventListener("click", () => {
    const keys = state.learnSelectedKeys || [];
    const items = keys.map(resolveItemByKey).filter(Boolean);
    if (!items.length) return;
    const firstType = items[0].type;
    const mixed = items.some((x) => x.type !== firstType);
    state.reviewType = mixed ? "char" : firstType;
    reviewTypeFilter.value = state.reviewType;
    switchTab("review");
    startDirectReviewSession(items, "未找到选中的默写项目。");
  });

  document.addEventListener("keydown", (event) => {
    if (state.tab !== "learn" || !isLearnerRole(state.auth.role)) return;
    if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
    if (event.key === "ArrowLeft") moveLearn(-1);
    if (event.key === "ArrowRight") moveLearn(1);
    if (event.key.toLowerCase() === "p") {
      const item = currentLearnList()[state.learnIndex];
      if (item) speakLearnItem(item);
    }
  });
}

function wireReview() {
  const alignReviewPanelToTop = () => {
    const panel = panels.review;
    if (!panel) return;
    const anchor = panel.querySelector(".review-panel-head") || panel;
    const prefersReducedMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";
    if (anchor && typeof anchor.scrollIntoView === "function") {
      anchor.scrollIntoView({ behavior, block: "start", inline: "nearest" });
      return;
    }
    const top = Math.max(0, window.scrollY + panel.getBoundingClientRect().top - 12);
    window.scrollTo({ top, behavior });
  };

  reviewBegin.addEventListener("click", () => {
    if (state.reviewPreviewRunning || state.reviewActive || state.reviewFlowState === "reviewed") {
      const ok = window.confirm(t("review.stopConfirm"));
      if (!ok) return;
      cancelReviewSessionWithoutSave();
      return;
    }
    const source = getDataset(state.reviewType);
    startReviewSession(source, "当前筛选下没有可默写的项目。");
    alignReviewPanelToTop();
    scrollReviewCardToTopIfNeeded();
  });

  reviewRestart.addEventListener("click", () => {
    if (!state.reviewActive && state.reviewFlowState !== "reviewed") {
      reviewFeedback.textContent = "当前没有进行中的默写。";
      return;
    }
    const ok = window.confirm("重新开始将取消当前默写进度，且本轮数据不保存，是否继续？");
    if (!ok) return;
    const source = getDataset(state.reviewType);
    startReviewSession(source, "当前筛选下没有可默写的项目。");
  });

  document.getElementById("review-play").addEventListener("click", () => {
    if (!state.reviewActive) return;
    const item = currentReviewItem();
    if (!item) return;
    speakPrompt(item);
  });

  document.getElementById("review-replay").addEventListener("click", () => {
    if (!state.reviewActive) return;
    const item = currentReviewItem();
    if (!item) return;
    speakPrompt(item);
  });

  reviewStartBtn.addEventListener("click", () => {
    if (!state.reviewActive || state.reviewAwaitingNext) return;
    if (state.reviewType === "word") evaluateWordDrawing();
    else evaluateDrawing();
  });

  reviewResetBtn.addEventListener("click", () => {
    if (!state.reviewActive || state.reviewAwaitingNext) return;
    if (state.reviewType === "word") initWordDictationPads(currentReviewItem());
    else initDictationPad();
    reviewFeedback.textContent = "已清空，请重新书写后再判定。";
    reviewAnswer.classList.add("is-hidden");
  });

  if (reviewNextBtn) {
    reviewNextBtn.addEventListener("click", () => {
      if (!state.reviewAwaitingNext) {
        reviewFeedback.textContent = "请先完成并判定。";
        return;
      }
      advanceToNextReviewItem();
    });
  }

  wordReviewSubmit.addEventListener("click", () => {
    if (!state.reviewActive || state.reviewType !== "word" || state.reviewAwaitingNext) return;
    evaluateWordDrawing();
  });

  wordReviewInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") evaluateWordDrawing();
  });

  if (reviewStopBtn) {
    reviewStopBtn.addEventListener("click", () => {
      if (!state.reviewActive && !state.reviewPreviewRunning && state.reviewFlowState !== "reviewed") return;
      const ok = window.confirm(t("review.stopConfirm"));
      if (!ok) return;
      cancelReviewSessionWithoutSave();
    });
  }

  if (reviewSettleBtn) {
    reviewSettleBtn.addEventListener("click", () => {
      if (state.reviewFlowState !== "ended") return;
      if (state.reviewSettlementAnimated) return;
      const points = Math.max(0, Number(state.reviewSettlementPoints) || 0);
      if (points <= 0) return;
      state.reviewSettlementAnimated = true;
      renderReviewSummaryCard();
      const target = rewardPanel || rewardText || null;
      if (target && typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }
      window.setTimeout(() => {
        playPointsGainEffect(points, "本轮默写", target);
      }, target ? 420 : 0);
    });
  }

  reviewTypeFilter.addEventListener("change", (event) => {
    if (state.reviewDraftActive) rollbackReviewDraftSession();
    state.reviewType = event.target.value;
    saveReviewPrefs();
    state.reviewActive = false;
    state.reviewList = [];
    state.reviewIndex = 0;
    state.reviewAwaitingNext = false;
    state.reviewLastResult = null;
    state.reviewLastJudgeDisplay = { feedback: "", answer: "" };
    setReviewFlowState("idle");
    state.reviewMessage = "默写类型已切换，请点击“开始默写”。";
    rebuildWrongQueue();
    renderReviewCard();
  });

  reviewLevelFilter.addEventListener("change", (event) => {
    if (state.reviewDraftActive) rollbackReviewDraftSession();
    state.reviewLevel = event.target.value;
    saveReviewPrefs();
    state.reviewActive = false;
    state.reviewList = [];
    state.reviewIndex = 0;
    state.reviewAwaitingNext = false;
    state.reviewLastResult = null;
    state.reviewLastJudgeDisplay = { feedback: "", answer: "" };
    setReviewFlowState("idle");
    state.reviewMessage = "设置已更新，请点击“开始默写”。";
    renderReviewCard();
  });

  reviewCountFilter.addEventListener("change", (event) => {
    if (state.reviewDraftActive) rollbackReviewDraftSession();
    state.reviewCount = event.target.value;
    saveReviewPrefs();
    state.reviewActive = false;
    state.reviewList = [];
    state.reviewIndex = 0;
    state.reviewAwaitingNext = false;
    state.reviewLastResult = null;
    state.reviewLastJudgeDisplay = { feedback: "", answer: "" };
    setReviewFlowState("idle");
    state.reviewMessage = "设置已更新，请点击“开始默写”。";
    renderReviewCard();
  });

  reviewWrongMixFilter.addEventListener("change", (event) => {
    if (state.reviewDraftActive) rollbackReviewDraftSession();
    state.reviewWrongMixRatio = event.target.value;
    saveReviewPrefs();
    state.reviewActive = false;
    state.reviewList = [];
    state.reviewIndex = 0;
    state.reviewAwaitingNext = false;
    state.reviewLastResult = null;
    state.reviewLastJudgeDisplay = { feedback: "", answer: "" };
    setReviewFlowState("idle");
    state.reviewMessage = "设置已更新，请点击“开始默写”。";
    renderReviewCard();
  });

  if (reviewPreviewFilter) {
    reviewPreviewFilter.addEventListener("change", (event) => {
      if (state.reviewDraftActive) rollbackReviewDraftSession();
      state.reviewPreviewMode = event.target.value || "0";
      saveReviewPrefs();
      state.reviewActive = false;
      state.reviewList = [];
      state.reviewIndex = 0;
      state.reviewAwaitingNext = false;
      state.reviewLastResult = null;
      state.reviewLastJudgeDisplay = { feedback: "", answer: "" };
      setReviewFlowState("idle");
      state.reviewMessage = "设置已更新，请点击“开始默写”。";
      renderReviewCard();
    });
  }
}

function wireWrongBook() {
  if (clearWrongBtn) {
    clearWrongBtn.addEventListener("click", () => {
      state.wrongBook = [];
      saveWrongBook();
      rebuildWrongQueue();
      refreshStats();
    });
  }

  startWrongDictation.addEventListener("click", () => {
    const source =
      state.wrongLevelFilter === "all"
        ? state.wrongQueue
        : state.wrongQueue.filter((it) => String(it.level) === String(state.wrongLevelFilter));
    const limit = state.wrongDictationCount === "all" ? source.length : Number(state.wrongDictationCount) || 10;
    const picked =
      state.wrongDictationCount === "all"
        ? [...source]
        : weightedSampleWithoutReplacement(source, Math.min(limit, source.length), (it) => buildMemoryCurveWeight(it, { inWrongBook: true }));
    switchTab("review");
    startDirectReviewSession(picked, "当前筛选下没有错题可默写。");
  });

  if (wrongLevelFilters) {
    wrongLevelFilters.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-level]");
      if (!btn) return;
      state.wrongLevelFilter = btn.dataset.level || "all";
      renderWrongBook();
    });
  }

  if (wrongDictationCount) {
    wrongDictationCount.addEventListener("change", (event) => {
      state.wrongDictationCount = event.target.value || "10";
      renderWrongBook();
    });
  }

  wrongList.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-key]");
    if (!target) return;
    const [type, ...rest] = target.dataset.key.split(":");
    const text = rest.join(":");
    const item = type === "word" ? WORD_MAP.get(text) : CHAR_MAP.get(text);
    if (!item) return;
    state.reviewType = item.type;
    reviewTypeFilter.value = item.type;
    switchTab("review");
    startDirectReviewSession([item], "该项目不存在。", { source: "wrongbook-single" });
  });
}

function wireRecords() {
  if (recordsTargetSelect) {
    recordsTargetSelect.addEventListener("change", (event) => {
      state.recordsReportUser = event.target.value || "";
      state.recordsPage = 1;
      renderUserRecords();
    });
  }
  if (recordsJudgedDays) {
    recordsJudgedDays.addEventListener("change", (event) => {
      const nextDays = Number(event.target.value);
      state.recordsJudgedDays = [1, 3, 7].includes(nextDays) ? nextDays : 7;
      state.recordsPage = 1;
      renderUserRecords();
    });
  }
  if (recordsDailyChart) {
    recordsDailyChart.addEventListener("click", (event) => {
      const button = event.target && event.target.closest ? event.target.closest("[data-range]") : null;
      if (!button) return;
      const nextDays = Number(button.getAttribute("data-range"));
      if (![7, 14, 30].includes(nextDays)) return;
      if (state.recordsChartDays === nextDays) return;
      state.recordsChartDays = nextDays;
      renderUserRecords();
    });
  }
  if (recordsPrev) {
    recordsPrev.addEventListener("click", () => {
      if (state.recordsPage <= 1) return;
      state.recordsPage -= 1;
      renderUserRecords();
    });
  }
  if (recordsNext) {
    recordsNext.addEventListener("click", () => {
      state.recordsPage += 1;
      renderUserRecords();
    });
  }
}

function wireTabs() {
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.auth.role === "admin" && !["admin", "admin-users", "admin-wrong", "admin-items"].includes(btn.dataset.tab)) return;
      if (state.auth.role === "parent" && !["admin", "admin-wrong", "records"].includes(btn.dataset.tab)) return;
      if (btn.dataset.tab === "admin" && !canAccessReviewAudit(state.auth.role)) return;
      if (btn.dataset.tab === "admin-users" && !isSuperAdmin(state.auth.role)) return;
      if (btn.dataset.tab === "admin-wrong" && !isManagerRole(state.auth.role)) return;
      if (btn.dataset.tab === "admin-items" && !isSuperAdmin(state.auth.role)) return;
      if ((state.reviewActive || state.reviewPreviewRunning) && state.tab === "review" && btn.dataset.tab !== "review") {
        const ok = window.confirm("正在默写中。切换菜单将取消本轮默写且数据不保存，是否继续？");
        if (!ok) return;
        cancelReviewSessionWithoutSave();
      }
      switchTab(btn.dataset.tab);
    });
  });
}

function wireAuth() {
  authTabLogin.addEventListener("click", () => switchAuthMode("login"));
  authTabRegister.addEventListener("click", () => switchAuthMode("register"));
  authLogin.addEventListener("click", handleLogin);
  authRegister.addEventListener("click", handleRegister);
  if (authRoleSelect) {
    authRoleSelect.addEventListener("change", () => refreshAuthRegisterRoleUi());
  }
  authTogglePassword.addEventListener("click", () => {
    const show = authPassword.type === "password";
    authPassword.type = show ? "text" : "password";
    authPasswordConfirm.type = show ? "text" : "password";
    updateAuthTogglePasswordLabel();
  });
  authPassword.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    if (authRegister.classList.contains("hidden")) handleLogin();
    else handleRegister();
  });
  authPasswordConfirm.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleRegister();
  });
  if (authParentUsername) {
    authParentUsername.addEventListener("keydown", (event) => {
      if (event.key === "Enter") handleRegister();
    });
  }
  if (userMenuToggle) {
    userMenuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleUserMenu();
    });
  }
  if (userMenuList) {
    userMenuList.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
  document.addEventListener("click", (event) => {
    if (!userMenu || !userMenuList) return;
    if (!userMenu.contains(event.target)) setUserMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setUserMenuOpen(false);
  });
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", async () => {
      setUserMenuOpen(false);
      await handleChangePassword();
    });
  }
  logoutBtn.addEventListener("click", async () => {
    setUserMenuOpen(false);
    await logout();
  });
}

function wireAdmin() {
  adminFilterApply.addEventListener("click", renderAdminPanel);
  if (adminUserFilter) {
    adminUserFilter.addEventListener("keydown", (event) => {
      if (event.key === "Enter") renderAdminPanel();
    });
  }
  adminTimeFilter.addEventListener("change", renderAdminPanel);
  if (adminOutcomeFilter) {
    adminOutcomeFilter.addEventListener("change", (event) => {
      state.adminOutcomeFilter = event.target.value || "all";
      renderAdminPanel();
    });
  }
  if (adminUsersRefresh) {
    adminUsersRefresh.addEventListener("click", () => {
      fetchAdminUsers();
    });
  }
  if (adminUsersList) {
    adminUsersList.addEventListener("click", async (event) => {
      if (state.auth.role !== "admin") return;

      const resetBtn = event.target.closest("button[data-action='reset-user-data']");
      if (resetBtn) {
        const username = String(resetBtn.dataset.username || "").trim();
        if (!username) return;
        const ok = window.confirm(`确认清空用户「${username}」的数据吗？将清空学习进度、错题本、积分、默写记录，并让该用户会话失效。`);
        if (!ok) return;
        try {
          const resp = await apiRequest(`/api/admin/users/${encodeURIComponent(username)}/reset-data`, {
            method: "POST"
          });
          if (adminUsersMsg) {
            const count = Number(resp && resp.submissionsCleared) || 0;
            adminUsersMsg.textContent = `已清空用户数据：${username}（清理记录 ${count} 条）`;
          }
          if (state.adminWrongBookQueryUser === username) {
            state.adminWrongBookItems = [];
            renderAdminWrongBookPanel();
          }
          state.submissions = state.submissions.filter((x) => x && x.username !== username);
          renderAdminPanel();
          renderUserRecords();
          await fetchAdminUsers();
        } catch (err) {
          if (adminUsersMsg) adminUsersMsg.textContent = err && err.message ? err.message : "清空用户数据失败";
        }
        return;
      }

      const deleteBtn = event.target.closest("button[data-action='delete-user']");
      if (!deleteBtn) return;
      const username = String(deleteBtn.dataset.username || "").trim();
      if (!username) return;
      const ok = window.confirm(`确认删除用户「${username}」吗？该用户的学习数据和记录会被一并删除。`);
      if (!ok) return;
      try {
        await apiRequest(`/api/admin/users/${encodeURIComponent(username)}`, {
          method: "DELETE"
        });
        if (adminUsersMsg) adminUsersMsg.textContent = `已删除用户：${username}`;
        if (state.adminWrongBookQueryUser === username) {
          state.adminWrongBookQueryUser = "";
          state.adminWrongBookItems = [];
          renderAdminWrongBookPanel();
        }
        state.submissions = state.submissions.filter((x) => x && x.username !== username && x.reviewedBy !== username);
        renderAdminPanel();
        renderUserRecords();
        await fetchAdminUsers();
      } catch (err) {
        if (adminUsersMsg) adminUsersMsg.textContent = err && err.message ? err.message : "删除用户失败";
      }
    });
  }
  if (adminWrongSearch) {
    adminWrongSearch.addEventListener("click", () => {
      const fallback = String(state.adminWrongBookQueryUser || "").trim();
      const name = String(window.prompt("请输入用户名以查询错题本：", fallback) || "").trim();
      if (!name) return;
      queryAdminWrongBook(name);
    });
  }
  if (adminWrongSearchUser) {
    adminWrongSearchUser.addEventListener("keydown", (event) => {
      if (event.key === "Enter") queryAdminWrongBook(adminWrongSearchUser.value || "");
    });
  }
  if (adminWrongList) {
    adminWrongList.addEventListener("click", async (event) => {
      const btn = event.target.closest("button[data-action='delete-wrong-item']");
      if (!btn || !isManagerRole(state.auth.role)) return;
      const username = String(state.adminWrongBookQueryUser || "").trim();
      const type = btn.dataset.type === "word" ? "word" : "char";
      const text = String(btn.dataset.text || "").trim();
      if (!username || !text) return;
      const ok = window.confirm(t("adminWrong.confirmDelete", { username, text }));
      if (!ok) return;
      try {
        const resp = await apiRequest(`/api/admin/users/${encodeURIComponent(username)}/wrong-book`, {
          method: "PUT",
          body: JSON.stringify({ action: "remove", type, text })
        });
        state.adminWrongBookItems = Array.isArray(resp.wrongBook) ? resp.wrongBook : [];
        if (adminWrongMsg) adminWrongMsg.textContent = t("adminWrong.deleted", { text });
        renderAdminWrongBookPanel();
      } catch (err) {
        if (adminWrongMsg) adminWrongMsg.textContent = err && err.message ? err.message : t("adminWrong.deleteFailed");
      }
    });
  }

  if (adminItemsTypeFilter) {
    adminItemsTypeFilter.addEventListener("change", (event) => {
      state.adminItemsTypeFilter = event.target.value || "all";
      state.adminItemsPage = 1;
      queueAdminItemsPanelRender();
    });
  }
  if (adminItemsLevelFilter) {
    adminItemsLevelFilter.addEventListener("change", (event) => {
      state.adminItemsLevelFilter = event.target.value || "all";
      state.adminItemsPage = 1;
      queueAdminItemsPanelRender();
    });
  }
  if (adminItemsSearch) {
    adminItemsSearch.addEventListener("input", (event) => {
      state.adminItemsSearch = event.target.value || "";
      state.adminItemsPage = 1;
      queueAdminItemsPanelRender();
    });
  }
  if (adminItemsPageSize) {
    adminItemsPageSize.addEventListener("change", (event) => {
      state.adminItemsPageSize = Number(event.target.value) || 50;
      state.adminItemsPage = 1;
      queueAdminItemsPanelRender();
    });
  }
  if (adminItemsPrev) {
    adminItemsPrev.addEventListener("click", () => {
      state.adminItemsPage = Math.max(1, state.adminItemsPage - 1);
      queueAdminItemsPanelRender();
    });
  }
  if (adminItemsNext) {
    adminItemsNext.addEventListener("click", () => {
      state.adminItemsPage += 1;
      queueAdminItemsPanelRender();
    });
  }
  if (adminItemsSaveAll) {
    adminItemsSaveAll.addEventListener("click", async () => {
      if (state.auth.role !== "admin" || state.adminItemsSaving) return;
      const keys = getDirtyAdminItemKeys();
      if (!keys.length) {
        if (adminItemsMsg) adminItemsMsg.textContent = "没有需要保存的修改";
        return;
      }
      state.adminItemsSaving = true;
      if (adminItemsMsg) adminItemsMsg.textContent = `正在保存 ${keys.length} 项...`;
      queueAdminItemsPanelRender();
      let okCount = 0;
      const failed = [];
      let latestOverrides = state.lexiconOverrides;
      for (const key of keys) {
        try {
          const resp = await saveAdminItemOverrideByKey(key);
          latestOverrides = (resp && resp.lexiconOverrides) || latestOverrides;
          okCount += 1;
        } catch (err) {
          const parsed = parseAdminItemKey(key);
          failed.push((parsed && parsed.text) || key);
        }
      }
      applyLexiconOverrides(latestOverrides || state.lexiconOverrides);
      initWriteSelect();
      renderLearnCard();
      queueLearnCharListRender();
      state.adminItemsSaving = false;
      queueAdminItemsPanelRender();
      if (adminItemsMsg) {
        adminItemsMsg.textContent =
          failed.length > 0
            ? `已保存 ${okCount} 项，失败 ${failed.length} 项：${failed.slice(0, 3).join("、")}${failed.length > 3 ? "..." : ""}`
            : `批量保存完成：${okCount} 项`;
      }
    });
  }
  if (adminItemsList) {
    adminItemsList.addEventListener("input", (event) => {
      const input = event.target.closest("input[data-admin-item]");
      if (!input || state.auth.role !== "admin") return;
      const key = String(input.dataset.key || "");
      const field = String(input.dataset.adminItem || "");
      setAdminDraftField(key, field, input.value || "");
      refreshAdminItemsDirtyUi();
    });

    adminItemsList.addEventListener("click", async (event) => {
      const btn = event.target.closest("button[data-action='save-admin-item']");
      if (!btn || state.auth.role !== "admin" || state.adminItemsSaving) return;
      const key = String(btn.dataset.key || "");
      const parsed = parseAdminItemKey(key);
      if (!parsed || !parsed.text) return;
      if (!isAdminItemDirty(key, getAdminItemByKey(key))) {
        if (adminItemsMsg) adminItemsMsg.textContent = `无修改：${parsed.text}`;
        return;
      }
      try {
        state.adminItemsSaving = true;
        queueAdminItemsPanelRender();
        const resp = await saveAdminItemOverrideByKey(key);
        applyLexiconOverrides((resp && resp.lexiconOverrides) || state.lexiconOverrides);
        initWriteSelect();
        renderLearnCard();
        queueLearnCharListRender();
        state.adminItemsSaving = false;
        queueAdminItemsPanelRender();
        if (adminItemsMsg) adminItemsMsg.textContent = `已保存：${parsed.text}`;
      } catch (err) {
        state.adminItemsSaving = false;
        queueAdminItemsPanelRender();
        if (adminItemsMsg) adminItemsMsg.textContent = err && err.message ? err.message : "保存失败";
      }
    });
  }

  adminList.addEventListener("click", async (event) => {
    const btn = event.target.closest("button[data-action]");
    const card = event.target.closest(".admin-item");
    if (!btn || !card || !canAccessReviewAudit(state.auth.role)) return;
    const id = card.dataset.id;
    const row = state.submissions.find((x) => x.id === id);
    if (!row) return;
    const beforeFinalResult = Boolean(row.finalResult);
    const action = btn.dataset.action;
    if (action === "set-char-status") {
      if (row.type !== "word") return;
      ensureSubmissionWordCharResults(row);
      const idx = Number(btn.dataset.index);
      const nextValue = btn.dataset.value === "true";
      const current = getWordCharResultsForRender(row).map((x) => ({ ...x }));
      if (!Number.isInteger(idx) || idx < 0 || idx >= current.length) return;
      current[idx].isGood = nextValue;
      state.adminWordReviewDrafts[id] = current;
      renderAdminPanel();
      return;
    }

    const reviewedCharResults =
      row.type === "word"
        ? getWordCharResultsForRender(row).map((x) => ({
            char: x.char || "",
            isGood: Boolean(x.isGood),
            accuracyPercent: normalizeAccuracyPercent(x.accuracyPercent),
            handwritingImage: x.handwritingImage || "",
            judgeDetail: normalizeJudgeDetail(x.judgeDetail)
          }))
        : null;
    const after = action === "apply-char-review"
      ? reviewedCharResults && reviewedCharResults.length > 0
        ? reviewedCharResults.every((x) => x.isGood)
        : false
      : action === "mark-correct";
    try {
      const resp = await apiRequest(`/api/submissions/${encodeURIComponent(id)}/review`, {
        method: "PUT",
        body: JSON.stringify({
          finalResult: after,
          wordCharResults: reviewedCharResults || undefined
        })
      });
      const idx = state.submissions.findIndex((x) => x.id === id);
      if (idx !== -1 && resp.submission) state.submissions[idx] = normalizeSubmissionRow(resp.submission);
      delete state.adminWordReviewDrafts[id];
      renderAdminPanel();
      renderUserRecords();
      const changed = Boolean(resp && resp.submission && resp.submission.finalResult) !== beforeFinalResult;
      window.alert(changed ? "复判完成：已更新错题本和积分。" : "复判完成：已更新错题本/积分（如有变更）。");
    } catch (err) {
      reviewFeedback.textContent = err && err.message ? err.message : "复判失败";
    }
  });
}

function setupCanvas() {
  const canvas = document.getElementById("write-canvas");
  const ctx = canvas.getContext("2d");
  const strokes = [];
  let drawing = false;
  let currentStroke = [];

  function drawGuide() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#e6dcc2";
    ctx.lineWidth = 1;
    [
      [0, 0, canvas.width, canvas.height],
      [canvas.width, 0, 0, canvas.height],
      [0, canvas.height / 2, canvas.width, canvas.height / 2],
      [canvas.width / 2, 0, canvas.width / 2, canvas.height]
    ].forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line[0], line[1]);
      ctx.lineTo(line[2], line[3]);
      ctx.stroke();
    });

    ctx.fillStyle = "rgba(19, 35, 47, 0.08)";
    ctx.font = "220px 'Noto Serif SC'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(targetChar.textContent, canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    strokes.forEach((stroke) => {
      ctx.beginPath();
      stroke.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (source.clientX - rect.left) * scaleX, y: (source.clientY - rect.top) * scaleY };
  }

  function start(event) {
    drawing = true;
    currentStroke = [getPoint(event)];
  }

  function move(event) {
    if (!drawing) return;
    event.preventDefault();
    currentStroke.push(getPoint(event));
    drawGuide();
    ctx.beginPath();
    currentStroke.forEach((point, idx) => {
      if (idx === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  function end() {
    if (!drawing) return;
    drawing = false;
    if (currentStroke.length > 1) strokes.push(currentStroke);
    currentStroke = [];
    drawGuide();
  }

  function refreshCanvas(options = {}) {
    if (options && options.clear) strokes.length = 0;
    drawGuide();
  }

  state.refreshWriteCanvas = refreshCanvas;

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);

  document.getElementById("clear-canvas").addEventListener("click", () => {
    strokes.length = 0;
    drawGuide();
    writeFeedback.textContent = "";
  });

  document.getElementById("undo-stroke").addEventListener("click", () => {
    strokes.pop();
    drawGuide();
    writeFeedback.textContent = "";
  });

  writeSelect.addEventListener("change", () => {
    updateWriteTarget(writeSelect.value);
    writeFeedback.textContent = "";
  });

  if (writePrevChar) {
    writePrevChar.addEventListener("click", () => {
      moveWriteTarget(-1);
    });
  }

  if (writeNextChar) {
    writeNextChar.addEventListener("click", () => {
      moveWriteTarget(1);
    });
  }

  if (writeListSearch) {
    writeListSearch.addEventListener("input", (event) => {
      state.writeListSearch = event.target.value || "";
      state.writeListPage = 1;
      queueWriteCharListRender();
    });
  }

  if (writeListPageSize) {
    writeListPageSize.addEventListener("change", (event) => {
      state.writeListPageSize = Number(event.target.value) || 50;
      state.writeListPage = 1;
      queueWriteCharListRender();
    });
  }

  if (writeListPrev) {
    writeListPrev.addEventListener("click", () => {
      state.writeListPage = Math.max(1, state.writeListPage - 1);
      queueWriteCharListRender();
    });
  }

  if (writeListNext) {
    writeListNext.addEventListener("click", () => {
      state.writeListPage += 1;
      queueWriteCharListRender();
    });
  }

  if (writeCharList) {
    writeCharList.addEventListener("click", (event) => {
      const ck = event.target.closest("input[data-action='write-select-item']");
      if (ck) {
        const char = ck.dataset.char;
        const set = new Set(state.writeSelectedChars || []);
        if (ck.checked) set.add(char);
        else set.delete(char);
        state.writeSelectedChars = [...set];
        queueWriteCharListRender();
        return;
      }
      const demoBtn = event.target.closest("[data-action='write-demo-item']");
      if (!demoBtn) return;
      const text = demoBtn.dataset.char;
      const item = CHAR_MAP.get(text);
      if (!item) return;
      stopWriteBatchDemo();
      writeSelect.value = item.text;
      updateWriteTarget(item.text);
      playStrokeDemo(true);
      writeFeedback.textContent = `正在演示“${item.text}”。`;
    });
  }

  if (writeListSelectPage) {
    writeListSelectPage.addEventListener("click", () => {
      if (!writeCharList) return;
      const checks = Array.from(writeCharList.querySelectorAll("input[data-action='write-select-item']"));
      const set = new Set(state.writeSelectedChars || []);
      checks.forEach((x) => set.add(x.dataset.char));
      state.writeSelectedChars = [...set];
      queueWriteCharListRender();
    });
  }

  if (writeListClearSelected) {
    writeListClearSelected.addEventListener("click", () => {
      state.writeSelectedChars = [];
      queueWriteCharListRender();
    });
  }

  if (writeListPlaySelected) {
    writeListPlaySelected.addEventListener("click", () => {
      playWriteBatchDemo();
    });
  }

  if (writeListStopPlay) {
    writeListStopPlay.addEventListener("click", () => {
      stopWriteBatchDemo();
      if (strokeDemoMsg) strokeDemoMsg.textContent = "已停止批量演示。";
    });
  }

  if (strokeDemoPlay) {
    strokeDemoPlay.addEventListener("click", () => {
      playStrokeDemo(false);
    });
  }

  if (strokeDemoReplay) {
    strokeDemoReplay.addEventListener("click", () => {
      playStrokeDemo(true);
    });
  }

  const writeCheckBtn = document.getElementById("write-check");
  if (writeCheckBtn) {
    writeCheckBtn.addEventListener("click", async () => {
      const item = CHAR_MAP.get(writeSelect.value);
      if (!item) return;
      if (strokes.length === 0) {
        writeFeedback.textContent = "请先写字，再进行智能判定。";
        return;
      }

      const size = 96;
      const userCanvas = drawStrokesToCanvas(strokes, 340, size);
      const userCtx = userCanvas.getContext("2d");

      const userBits = normalizeBits(getBinaryData(userCtx, size), size, size, 10);
      const templateBits = createTemplateBitsForChar(item.text, size);
      const handwritingImage = userCanvas.toDataURL("image/png");
      if (!state.writeRetryState || state.writeRetryState.itemKey !== makeItemKey(item)) {
        resetWriteRetryState(makeItemKey(item));
      }
      const retryAttempt = Math.max(0, Number(state.writeRetryState.attempt) || 0);
      setJudgeLoading(writeFeedback, writeCheckBtn, "正在进行 OCR 判定");
      try {
        const ocrOutcome = await resolveOcrJudgeOutcome(item.text, handwritingImage, "char", [item.text]);
        const outcome = ocrOutcome || resolveCharJudgeOutcome(item.text, userBits, templateBits, retryAttempt);
        if (outcome.finalDecision === "retry" && retryAttempt < 1) {
          state.writeRetryState.attempt = 1;
          if (typeof state.refreshWriteCanvas === "function") state.refreshWriteCanvas({ clear: true });
          writeFeedback.textContent = "接近正确，请再写一次。";
          return;
        }
        const pass = outcome.finalDecision === "pass";
        writeFeedback.textContent = `${pass ? "判定通过" : "判定未通过"}（${getJudgeSourceLabel(outcome.detail)}）`;
        resetWriteRetryState(makeItemKey(item));

        scheduleProgress(item, pass);
        if (pass) {
          removeWrongItem(item);
          addPoints(1);
          if (outcome.mlAccepted) updateCharMlPrototype(item.text, extractMlFeature(userBits, size));
        } else addWrongItem(item);
        refreshStats();
        rebuildWrongQueue();
      } finally {
        clearJudgeLoading(writeFeedback, writeCheckBtn);
      }
    });
  }

  drawGuide();
}

async function init() {
  await loadLexiconData();
  rebuildLexiconCaches();
  state.lang = "zh";
  setLanguage("zh", false);
  initSpeechEngine();
  initLevelFilter();
  initWriteSelect();
  syncWriteListFromLearnSelection({ resetPage: true });
  setWriteBatchPlaying(false);
  initReviewSettings();
  learnTypeFilter.value = state.learnType;
  wireAuth();
  wireTabs();
  wireLearn();
  wireReview();
  wireWrongBook();
  wireRecords();
  wireAdmin();
  setupCanvas();
  scheduleRecognitionTierWarmup(300);
  renderLearnCard();
  renderLearnCharList();
  syncIpadLandscapeReviewScale();
  window.addEventListener("resize", syncIpadLandscapeReviewScale);
  window.addEventListener("orientationchange", () => {
    window.setTimeout(syncIpadLandscapeReviewScale, 120);
  });
  switchAuthMode("login");

  const session = loadSession();
  if (session && session.loggedIn && session.username && session.role && session.token) {
    try {
      await setAuthState(session.username, session.role, session.token, session);
      return;
    } catch (err) {
      clearSession();
      state.auth = { loggedIn: false, role: "", username: "", token: "", linkedParentUsername: "", linkedChildren: [] };
    }
  }
  authScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
  authMsg.textContent = t("auth.needLogin");
}

init().catch((err) => {
  console.error(err);
  authScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
  authMsg.textContent = "初始化失败，请刷新重试。";
});

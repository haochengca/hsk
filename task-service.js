"use strict";

const crypto = require("node:crypto");

const TEMPLATE_TYPE_HSK_LEVEL_CHARS = "HSK_LEVEL_CHARS";
const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  PAUSED: "paused",
  COMPLETED: "completed",
  ARCHIVED: "archived"
};

function normalizeSelectedLevels(input) {
  const raw = Array.isArray(input) ? input : [input];
  const values = raw
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item >= 1 && item <= 6);
  return [...new Set(values)].sort((a, b) => a - b);
}

function normalizeTaskStatus(value, fallback = TASK_STATUS.PENDING) {
  const status = String(value || "").trim().toLowerCase();
  return Object.values(TASK_STATUS).includes(status) ? status : fallback;
}

function createEmptyTaskProgress() {
  return {
    version: 1,
    sessionId: "",
    currentIndex: 0,
    completedCount: 0,
    correctCount: 0,
    wrongItems: [],
    completedItems: [],
    lastSnapshotAt: 0,
    lastCheckpointId: "",
    startedAt: 0,
    pausedAt: 0,
    resumedAt: 0,
    completedAt: 0
  };
}

function buildTaskItems(charDataset, selectedLevels, options = {}) {
  const levels = normalizeSelectedLevels(selectedLevels);
  const dedupe = options.dedupe !== false;
  const count = options.practiceCount === "all" ? "all" : Math.max(0, Number(options.practiceCount) || 0);
  const source = Array.isArray(charDataset) ? charDataset : [];
  const filtered = source.filter((item) => levels.includes(Number(item && item.level)));
  const seen = new Set();
  const items = [];

  filtered.forEach((item) => {
    const text = String((item && item.char) || "").trim();
    if (!text) return;
    if (dedupe && seen.has(text)) return;
    seen.add(text);
    items.push({
      seq: items.length,
      type: "char",
      itemId: text,
      text,
      pinyin: String((item && item.pinyin) || ""),
      meaning: String((item && item.meaning) || ""),
      phrase: String((item && item.phrase) || ""),
      sentence: String((item && item.sentence) || ""),
      sourceLevel: Number(item && item.level) || 1
    });
  });

  if (count === "all" || count <= 0 || count >= items.length) return items;
  return items.slice(0, count).map((item, index) => ({ ...item, seq: index }));
}

function summarizeTask(task) {
  const items = Array.isArray(task && task.items) ? task.items : [];
  const progress = normalizeTaskProgress(task && task.progress, items);
  const totalCount = items.length;
  const completedCount = Math.min(totalCount, Number(progress.completedCount) || 0);
  const correctCount = Math.min(completedCount, Math.max(0, Number(progress.correctCount) || 0));
  const wrongCount = Math.max(0, completedCount - correctCount);
  const accuracyPercent = completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0;
  const levels = {};
  items.forEach((item) => {
    const key = String(Number(item && item.sourceLevel) || 1);
    levels[key] = levels[key] || { total: 0, completed: 0, correct: 0, wrong: 0 };
    levels[key].total += 1;
  });
  progress.completedItems.forEach((item) => {
    const seq = Number(item && item.seq);
    const base = Number.isInteger(seq) && seq >= 0 && seq < items.length ? items[seq] : null;
    if (!base) return;
    const key = String(Number(base.sourceLevel) || 1);
    levels[key] = levels[key] || { total: 0, completed: 0, correct: 0, wrong: 0 };
    levels[key].completed += 1;
    if (item.isCorrect) levels[key].correct += 1;
    else levels[key].wrong += 1;
  });
  return {
    totalCount,
    completedCount,
    correctCount,
    wrongCount,
    accuracyPercent,
    wrongItems: [...progress.wrongItems],
    levelStats: levels
  };
}

function normalizeCompletedItem(input, items) {
  const row = input && typeof input === "object" ? input : {};
  const seq = Number(row.seq);
  if (!Number.isInteger(seq) || seq < 0 || seq >= items.length) return null;
  const base = items[seq];
  const text = String(row.text || base.text || "").trim();
  return {
    seq,
    itemId: String(row.itemId || base.itemId || text),
    text,
    isCorrect: Boolean(row.isCorrect),
    accuracyPercent: Math.max(0, Math.min(100, Number(row.accuracyPercent) || 0)),
    answeredAt: Math.max(0, Number(row.answeredAt) || 0)
  };
}

function normalizeTaskProgress(input, items) {
  const progress = createEmptyTaskProgress();
  const source = input && typeof input === "object" ? input : {};
  progress.version = Number(source.version) || 1;
  progress.sessionId = String(source.sessionId || "");
  progress.currentIndex = Math.max(0, Math.min(items.length, Number(source.currentIndex) || 0));
  progress.lastSnapshotAt = Math.max(0, Number(source.lastSnapshotAt) || 0);
  progress.lastCheckpointId = String(source.lastCheckpointId || "");
  progress.startedAt = Math.max(0, Number(source.startedAt) || 0);
  progress.pausedAt = Math.max(0, Number(source.pausedAt) || 0);
  progress.resumedAt = Math.max(0, Number(source.resumedAt) || 0);
  progress.completedAt = Math.max(0, Number(source.completedAt) || 0);

  const normalizedItems = Array.isArray(source.completedItems)
    ? source.completedItems
        .map((item) => normalizeCompletedItem(item, items))
        .filter(Boolean)
        .sort((a, b) => a.seq - b.seq)
    : [];
  const dedupedMap = new Map();
  normalizedItems.forEach((item) => dedupedMap.set(item.seq, item));
  progress.completedItems = [...dedupedMap.values()].sort((a, b) => a.seq - b.seq);
  progress.completedCount = Math.min(items.length, Number(source.completedCount) || progress.completedItems.length);
  progress.correctCount = Math.min(
    progress.completedCount,
    Math.max(0, Number(source.correctCount) || progress.completedItems.filter((item) => item.isCorrect).length)
  );
  const wrongItems = Array.isArray(source.wrongItems)
    ? source.wrongItems.map((item) => String(item || "").trim()).filter(Boolean)
    : progress.completedItems.filter((item) => !item.isCorrect).map((item) => item.text);
  progress.wrongItems = [...new Set(wrongItems)];
  return progress;
}

function createTaskRecord(input, charDataset, nowMs = Date.now()) {
  const levels = normalizeSelectedLevels(input && input.selectedLevels);
  if (!levels.length) {
    throw new Error("selectedLevels must include at least one HSK level between 1 and 6");
  }
  const templateType = String((input && input.templateType) || TEMPLATE_TYPE_HSK_LEVEL_CHARS);
  if (templateType !== TEMPLATE_TYPE_HSK_LEVEL_CHARS) {
    throw new Error("unsupported templateType");
  }

  const items = buildTaskItems(charDataset, levels, {
    dedupe: input && input.dedupe,
    practiceCount: input && input.practiceCount
  });
  if (!items.length) {
    throw new Error("selected levels produced no task items");
  }

  const title = `HSK ${levels.join("+")} 汉字任务`;
  const task = {
    id: `task_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`,
    ownerId: String((input && input.ownerId) || "").trim(),
    assigneeId: String((input && input.assigneeId) || "").trim() || String((input && input.ownerId) || "").trim(),
    templateType,
    title,
    selectedLevels: levels,
    dedupe: input && input.dedupe !== false,
    practiceCount: input && input.practiceCount === "all" ? "all" : Math.max(0, Number(input && input.practiceCount) || items.length),
    status: TASK_STATUS.PENDING,
    createdAt: nowMs,
    dueAt: Math.max(0, Number(input && input.dueAt) || 0),
    items,
    progress: createEmptyTaskProgress(),
    summary: {
      totalCount: items.length,
      completedCount: 0,
      correctCount: 0,
      wrongCount: 0,
      accuracyPercent: 0,
      wrongItems: [],
      levelStats: {}
    }
  };
  task.summary = summarizeTask(task);
  return task;
}

function startTask(task, nowMs = Date.now()) {
  const next = {
    ...task,
    status: TASK_STATUS.IN_PROGRESS,
    progress: createEmptyTaskProgress()
  };
  next.progress.sessionId = `session_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  next.progress.startedAt = nowMs;
  next.progress.resumedAt = nowMs;
  next.progress.pausedAt = 0;
  next.summary = summarizeTask(next);
  return next;
}

function resumeTask(task, nowMs = Date.now()) {
  const status = normalizeTaskStatus(task && task.status);
  if (status === TASK_STATUS.COMPLETED || status === TASK_STATUS.ARCHIVED) {
    throw new Error("completed task cannot be resumed");
  }
  const next = {
    ...task,
    status: TASK_STATUS.IN_PROGRESS,
    progress: normalizeTaskProgress(task && task.progress, task.items)
  };
  next.progress.sessionId = next.progress.sessionId || `session_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  next.progress.startedAt = next.progress.startedAt || nowMs;
  next.progress.resumedAt = nowMs;
  next.progress.pausedAt = 0;
  next.summary = summarizeTask(next);
  return next;
}

function applyTaskProgressSnapshot(task, snapshot, nowMs = Date.now()) {
  const items = Array.isArray(task && task.items) ? task.items : [];
  const current = normalizeTaskProgress(task && task.progress, items);
  const input = snapshot && typeof snapshot === "object" ? snapshot : {};
  const checkpointId = String(input.checkpointId || "");
  if (checkpointId && checkpointId === current.lastCheckpointId) {
    return { task: { ...task, progress: current, summary: summarizeTask(task) }, idempotent: true };
  }

  const next = {
    ...task,
    status: normalizeTaskStatus(input.status, normalizeTaskStatus(task && task.status, TASK_STATUS.IN_PROGRESS)),
    progress: { ...current }
  };

  next.progress.sessionId = String(input.sessionId || current.sessionId || "");
  next.progress.currentIndex = Math.max(
    0,
    Math.min(items.length, Number(input.currentIndex != null ? input.currentIndex : current.currentIndex) || 0)
  );
  if (Array.isArray(input.completedItems)) {
    next.progress.completedItems = input.completedItems
      .map((item) => normalizeCompletedItem(item, items))
      .filter(Boolean)
      .sort((a, b) => a.seq - b.seq);
    const deduped = new Map();
    next.progress.completedItems.forEach((item) => deduped.set(item.seq, item));
    next.progress.completedItems = [...deduped.values()].sort((a, b) => a.seq - b.seq);
  }
  next.progress.completedCount = Math.min(items.length, next.progress.completedItems.length);
  next.progress.correctCount = next.progress.completedItems.filter((item) => item.isCorrect).length;
  next.progress.wrongItems = [...new Set(next.progress.completedItems.filter((item) => !item.isCorrect).map((item) => item.text))];
  next.progress.lastSnapshotAt = nowMs;
  next.progress.lastCheckpointId = checkpointId || current.lastCheckpointId;
  if (next.status === TASK_STATUS.PAUSED) next.progress.pausedAt = nowMs;
  if (next.status === TASK_STATUS.IN_PROGRESS) next.progress.resumedAt = nowMs;
  next.summary = summarizeTask(next);
  return { task: next, idempotent: false };
}

function completeTask(task, snapshot, nowMs = Date.now()) {
  const { task: updated } = applyTaskProgressSnapshot(task, snapshot, nowMs);
  const next = {
    ...updated,
    status: TASK_STATUS.COMPLETED,
    progress: {
      ...updated.progress,
      currentIndex: updated.items.length,
      completedAt: nowMs,
      pausedAt: 0
    }
  };
  next.summary = summarizeTask(next);
  return next;
}

function normalizeTaskRecord(input) {
  const task = input && typeof input === "object" ? { ...input } : {};
  task.id = String(task.id || "").trim();
  task.ownerId = String(task.ownerId || "").trim();
  task.assigneeId = String(task.assigneeId || "").trim();
  task.templateType = String(task.templateType || TEMPLATE_TYPE_HSK_LEVEL_CHARS);
  task.title = String(task.title || "");
  task.selectedLevels = normalizeSelectedLevels(task.selectedLevels);
  task.dedupe = task.dedupe !== false;
  task.practiceCount = task.practiceCount === "all" ? "all" : Math.max(0, Number(task.practiceCount) || 0);
  task.status = normalizeTaskStatus(task.status);
  task.createdAt = Math.max(0, Number(task.createdAt) || 0);
  task.dueAt = Math.max(0, Number(task.dueAt) || 0);
  task.items = Array.isArray(task.items)
    ? task.items.map((item, index) => ({
        seq: Number.isInteger(Number(item && item.seq)) ? Number(item.seq) : index,
        type: "char",
        itemId: String((item && item.itemId) || (item && item.text) || ""),
        text: String((item && item.text) || ""),
        pinyin: String((item && item.pinyin) || ""),
        meaning: String((item && item.meaning) || ""),
        phrase: String((item && item.phrase) || ""),
        sentence: String((item && item.sentence) || ""),
        sourceLevel: Number(item && item.sourceLevel) || 1
      }))
    : [];
  task.progress = normalizeTaskProgress(task.progress, task.items);
  task.summary = summarizeTask(task);
  return task;
}

function canAccessTask(task, username) {
  const user = String(username || "").trim();
  if (!user || !task) return false;
  return task.ownerId === user || task.assigneeId === user;
}

module.exports = {
  TEMPLATE_TYPE_HSK_LEVEL_CHARS,
  TASK_STATUS,
  normalizeSelectedLevels,
  normalizeTaskStatus,
  createEmptyTaskProgress,
  buildTaskItems,
  summarizeTask,
  createTaskRecord,
  startTask,
  resumeTask,
  applyTaskProgressSnapshot,
  completeTask,
  normalizeTaskRecord,
  canAccessTask
};

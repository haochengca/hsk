"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const dataset = require("../data/hsk_chars_1_6.json");
const {
  TASK_STATUS,
  createTaskRecord,
  applyTaskProgressSnapshot,
  resumeTask,
  completeTask
} = require("../task-service.js");

test("createTaskRecord builds deduped multi-level task snapshot", () => {
  const task = createTaskRecord(
    {
      ownerId: "child1",
      assigneeId: "child1",
      selectedLevels: [2, 1, 1],
      practiceCount: 12
    },
    dataset,
    123
  );

  assert.equal(task.templateType, "HSK_LEVEL_CHARS");
  assert.deepEqual(task.selectedLevels, [1, 2]);
  assert.equal(task.items.length, 12);
  assert.equal(task.items[0].seq, 0);
  assert.equal(task.items.every((item) => item.sourceLevel === 1 || item.sourceLevel === 2), true);
  assert.equal(task.status, TASK_STATUS.PENDING);
});

test("applyTaskProgressSnapshot keeps checkpoints idempotent", () => {
  const task = createTaskRecord(
    {
      ownerId: "child1",
      assigneeId: "child1",
      selectedLevels: [1],
      practiceCount: 5
    },
    dataset,
    123
  );

  const first = applyTaskProgressSnapshot(
    task,
    {
      status: TASK_STATUS.IN_PROGRESS,
      sessionId: "session_a",
      checkpointId: "cp_1",
      currentIndex: 2,
      completedItems: [
        { seq: 0, isCorrect: true, accuracyPercent: 98 },
        { seq: 1, isCorrect: false, accuracyPercent: 42 }
      ]
    },
    456
  );

  assert.equal(first.idempotent, false);
  assert.equal(first.task.progress.currentIndex, 2);
  assert.equal(first.task.progress.completedCount, 2);
  assert.equal(first.task.progress.correctCount, 1);
  assert.deepEqual(first.task.progress.wrongItems, [task.items[1].text]);

  const second = applyTaskProgressSnapshot(
    first.task,
    {
      status: TASK_STATUS.IN_PROGRESS,
      sessionId: "session_a",
      checkpointId: "cp_1",
      currentIndex: 2,
      completedItems: [
        { seq: 0, isCorrect: true, accuracyPercent: 98 },
        { seq: 1, isCorrect: false, accuracyPercent: 42 }
      ]
    },
    789
  );

  assert.equal(second.idempotent, true);
  assert.equal(second.task.progress.lastSnapshotAt, 456);
});

test("resumeTask and completeTask preserve progress and summary", () => {
  const task = createTaskRecord(
    {
      ownerId: "child1",
      assigneeId: "child1",
      selectedLevels: [1, 2],
      practiceCount: 4
    },
    dataset,
    123
  );

  const updated = applyTaskProgressSnapshot(
    task,
    {
      status: TASK_STATUS.PAUSED,
      sessionId: "session_x",
      checkpointId: "cp_1",
      currentIndex: 3,
      completedItems: [
        { seq: 0, isCorrect: true, accuracyPercent: 88 },
        { seq: 1, isCorrect: true, accuracyPercent: 90 },
        { seq: 2, isCorrect: false, accuracyPercent: 50 }
      ]
    },
    456
  ).task;

  const resumed = resumeTask(updated, 789);
  assert.equal(resumed.status, TASK_STATUS.IN_PROGRESS);
  assert.equal(resumed.progress.currentIndex, 3);
  assert.equal(resumed.progress.sessionId, "session_x");

  const completed = completeTask(
    resumed,
    {
      sessionId: "session_x",
      checkpointId: "cp_2",
      currentIndex: 4,
      completedItems: [
        ...resumed.progress.completedItems,
        { seq: 3, isCorrect: true, accuracyPercent: 99 }
      ]
    },
    999
  );

  assert.equal(completed.status, TASK_STATUS.COMPLETED);
  assert.equal(completed.summary.totalCount, 4);
  assert.equal(completed.summary.completedCount, 4);
  assert.equal(completed.summary.correctCount, 3);
  assert.equal(completed.summary.wrongCount, 1);
  assert.equal(completed.summary.accuracyPercent, 75);
});

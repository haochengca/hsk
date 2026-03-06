"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const core = require("../recognition-core.js");

test("computeQuantileThresholds and resolveTier classify into three tiers", () => {
  const q = core.computeQuantileThresholds([10, 20, 30, 40, 50, 60]);
  assert.ok(q.low > 0);
  assert.ok(q.high >= q.low);

  assert.equal(core.resolveTier(15, q), "simple");
  assert.equal(core.resolveTier(35, q), "medium");
  assert.equal(core.resolveTier(55, q), "complex");
});

test("combineEngineScores uses tier weights", () => {
  const simpleProfile = core.resolveTierProfile("simple");
  const score = core.combineEngineScores(
    { overlap: 1, projection: 0.5, grid: 0 },
    simpleProfile
  );

  assert.ok(Math.abs(score - 0.69) < 1e-9);
});

test("decideRecognition returns retry in uncertain band then fail after retry exhausted", () => {
  const decisionRetry = core.decideRecognition({
    tier: "medium",
    engines: { overlap: 0.6, projection: 0.6, grid: 0.6 },
    retryAttempt: 0
  });

  assert.equal(decisionRetry.decision, "retry");
  assert.equal(decisionRetry.reason, "uncertain_retry");

  const decisionFail = core.decideRecognition({
    tier: "medium",
    engines: { overlap: 0.6, projection: 0.6, grid: 0.6 },
    retryAttempt: 1
  });

  assert.equal(decisionFail.decision, "fail");
  assert.equal(decisionFail.reason, "uncertain_exhausted");
});

test("decideRecognition supports ML fallback pass and ml update gate", () => {
  const detail = core.decideRecognition({
    tier: "simple",
    engines: { overlap: 0.5, projection: 0.5, grid: 0.5 },
    mlScore: 0.93,
    retryAttempt: 0
  });

  assert.equal(detail.decision, "pass");
  assert.equal(detail.reason, "pass_ml_fallback");
  assert.equal(core.isMlUpdateEligible(detail), false);

  const high = core.decideRecognition({
    tier: "simple",
    engines: { overlap: 0.9, projection: 0.9, grid: 0.9 },
    mlScore: 0.95,
    retryAttempt: 0
  });
  assert.equal(core.isMlUpdateEligible(high), true);
});

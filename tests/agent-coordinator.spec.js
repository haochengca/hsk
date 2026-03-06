"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { classifyTask, createCoordinator } = require("../scripts/agent-coordinator.js");

test("classifyTask routes handwriting-recognition requests to handwriting-accuracy", () => {
  const intent = classifyTask({
    title: "Increase handwriting recognition accuracy",
    details: "Tune thresholds and fusion for stroke recognition"
  });

  assert.equal(intent, "handwriting-accuracy");
});

test("createPlan builds workflow with task-intake as lead agent", () => {
  const coordinator = createCoordinator();
  const plan = coordinator.createPlan({
    title: "Improve handwriting recognition",
    details: "Focus on low-confidence rejection and retry"
  });

  assert.equal(plan.leadAgentId, "task-intake-agent");
  assert.ok(Array.isArray(plan.steps));
  assert.ok(plan.steps.length >= 4);
  assert.equal(plan.steps[0].agentId, "task-intake-agent");
});

test("collaborate adds sync actions when new task overlaps active plans", () => {
  const coordinator = createCoordinator();
  const activePlan = coordinator.createPlan({
    title: "Deploy monitoring updates",
    details: "Add error dashboards and alerting"
  }, {
    intent: "ops-reliability"
  });

  const newPlan = coordinator.collaborate(
    {
      title: "Improve handwriting recognition accuracy",
      details: "Optimize model fusion"
    },
    [activePlan]
  );

  assert.ok(newPlan.syncActions.length > 0);
  const hasSharedIntakeAgent = newPlan.syncActions.some((item) => item.agentId === "task-intake-agent");
  assert.equal(hasSharedIntakeAgent, true);
});

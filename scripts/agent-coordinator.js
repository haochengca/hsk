#!/usr/bin/env node
"use strict";

const crypto = require("crypto");

const DEFAULT_AGENTS = Object.freeze([
  {
    id: "task-intake-agent",
    name: "Task Intake Agent",
    responsibility: "Classify incoming tasks and pick the collaboration workflow.",
    intents: ["handwriting-accuracy", "feature-delivery", "ops-reliability", "generic"]
  },
  {
    id: "data-agent",
    name: "Data Agent",
    responsibility: "Curate datasets, label quality issues, and track drift patterns.",
    intents: ["handwriting-accuracy"]
  },
  {
    id: "model-agent",
    name: "Model Agent",
    responsibility: "Design scoring fusion, thresholds, and personalization rules.",
    intents: ["handwriting-accuracy"]
  },
  {
    id: "evaluation-agent",
    name: "Evaluation Agent",
    responsibility: "Run experiments, evaluate FAR/FRR, and gate unsafe changes.",
    intents: ["handwriting-accuracy", "feature-delivery", "ops-reliability", "generic"]
  },
  {
    id: "product-agent",
    name: "Product Agent",
    responsibility: "Translate technical changes into user-facing behavior and acceptance criteria.",
    intents: ["handwriting-accuracy", "feature-delivery", "generic"]
  },
  {
    id: "backend-agent",
    name: "Backend Agent",
    responsibility: "Implement server-side APIs, persistence, and task orchestration endpoints.",
    intents: ["feature-delivery", "ops-reliability", "generic"]
  },
  {
    id: "frontend-agent",
    name: "Frontend Agent",
    responsibility: "Implement UI flows and interaction details for released changes.",
    intents: ["feature-delivery", "generic"]
  },
  {
    id: "ops-agent",
    name: "Ops Agent",
    responsibility: "Cover deployment safety, observability, and rollback plans.",
    intents: ["ops-reliability", "generic"]
  },
  {
    id: "delivery-agent",
    name: "Delivery Agent",
    responsibility: "Finalize release checklist, docs, and post-release monitoring.",
    intents: ["handwriting-accuracy", "feature-delivery", "ops-reliability", "generic"]
  }
]);

const DEFAULT_WORKFLOWS = Object.freeze({
  "handwriting-accuracy": [
    "task-intake-agent",
    "data-agent",
    "model-agent",
    "evaluation-agent",
    "product-agent",
    "delivery-agent"
  ],
  "feature-delivery": [
    "task-intake-agent",
    "product-agent",
    "backend-agent",
    "frontend-agent",
    "evaluation-agent",
    "delivery-agent"
  ],
  "ops-reliability": [
    "task-intake-agent",
    "ops-agent",
    "backend-agent",
    "evaluation-agent",
    "delivery-agent"
  ],
  generic: [
    "task-intake-agent",
    "product-agent",
    "backend-agent",
    "evaluation-agent",
    "delivery-agent"
  ]
});

const INTENT_RULES = Object.freeze([
  {
    intent: "handwriting-accuracy",
    keywords: [
      "handwriting",
      "recognition",
      "ocr",
      "accuracy",
      "threshold",
      "stroke",
      "fusion",
      "判定",
      "识别",
      "手写",
      "准确率"
    ]
  },
  {
    intent: "feature-delivery",
    keywords: ["feature", "ui", "ux", "page", "api", "frontend", "backend", "功能", "页面", "接口"]
  },
  {
    intent: "ops-reliability",
    keywords: ["deploy", "latency", "error", "monitor", "rollback", "运维", "稳定性", "监控", "发布"]
  }
]);

function normalizeText(parts) {
  return parts
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())
    .join(" ");
}

function classifyTask(input) {
  const text = normalizeText([input && input.title, input && input.details]);
  if (!text) return "generic";

  let best = { intent: "generic", score: 0 };
  for (const rule of INTENT_RULES) {
    let score = 0;
    for (const token of rule.keywords) {
      if (text.includes(token)) score += 1;
    }
    if (score > best.score) best = { intent: rule.intent, score };
  }
  return best.intent;
}

function createTask(input) {
  const title = String(input && input.title ? input.title : "Untitled task").trim();
  const details = String(input && input.details ? input.details : "").trim();
  return {
    taskId: `task_${crypto.randomUUID().slice(0, 8)}`,
    title,
    details,
    createdAt: new Date().toISOString()
  };
}

function toAgentMap(agents) {
  const map = new Map();
  for (const agent of agents) map.set(agent.id, agent);
  return map;
}

function safeWorkflow(intent, workflows) {
  const flow = workflows[intent];
  if (Array.isArray(flow) && flow.length > 0) return flow;
  return workflows.generic;
}

function buildSteps(workflow, agentMap) {
  return workflow.map((agentId, index) => {
    const agent = agentMap.get(agentId);
    if (!agent) {
      return {
        order: index + 1,
        agentId,
        agentName: "Unknown Agent",
        action: "Resolve missing agent mapping before execution."
      };
    }

    return {
      order: index + 1,
      agentId: agent.id,
      agentName: agent.name,
      action: agent.responsibility
    };
  });
}

function buildSyncActions(plan, activePlans) {
  if (!Array.isArray(activePlans) || activePlans.length === 0) return [];

  const currentAgents = new Set(plan.steps.map((step) => step.agentId));
  const syncActions = [];

  for (const existing of activePlans) {
    if (!existing || !Array.isArray(existing.steps)) continue;
    const overlap = [...new Set(existing.steps.map((step) => step.agentId))]
      .filter((agentId) => currentAgents.has(agentId));

    for (const agentId of overlap) {
      syncActions.push({
        sourceTaskId: String(existing.taskId || "unknown"),
        agentId,
        mode: "context-handoff",
        reason: "Agent is shared between tasks; reuse findings before new execution."
      });
    }
  }

  return syncActions;
}

function createCoordinator(config = {}) {
  const agents = Array.isArray(config.agents) && config.agents.length > 0 ? config.agents : DEFAULT_AGENTS;
  const workflows = config.workflows && typeof config.workflows === "object" ? config.workflows : DEFAULT_WORKFLOWS;
  const agentMap = toAgentMap(agents);

  function createPlan(taskInput, options = {}) {
    const task = createTask(taskInput || {});
    const intent = options.intent || classifyTask(task);
    const workflow = safeWorkflow(intent, workflows);
    const steps = buildSteps(workflow, agentMap);
    const leadAgentId = workflow[0] || "task-intake-agent";

    const plan = {
      taskId: task.taskId,
      title: task.title,
      details: task.details,
      createdAt: task.createdAt,
      intent,
      leadAgentId,
      steps
    };

    plan.syncActions = buildSyncActions(plan, options.activePlans || []);
    return plan;
  }

  function collaborate(newTaskInput, activePlans = []) {
    return createPlan(newTaskInput, { activePlans });
  }

  return {
    agents,
    workflows,
    createPlan,
    collaborate
  };
}

function formatPlan(plan, agentMap) {
  const lines = [];
  lines.push(`Task: ${plan.title}`);
  lines.push(`Task ID: ${plan.taskId}`);
  lines.push(`Intent: ${plan.intent}`);
  lines.push(`Lead Agent: ${plan.leadAgentId}`);
  lines.push("Pipeline:");
  for (const step of plan.steps) {
    lines.push(`  ${step.order}. ${step.agentId} - ${step.action}`);
  }

  if (plan.syncActions.length > 0) {
    lines.push("Cross-task Collaboration:");
    for (const item of plan.syncActions) {
      const agent = agentMap.get(item.agentId);
      const agentName = agent ? agent.name : item.agentId;
      lines.push(`  - Sync ${agentName} with ${item.sourceTaskId} (${item.mode})`);
    }
  }

  return lines.join("\n");
}

function parseActiveIntents(raw) {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildMockPlan(intent, coordinator) {
  const flow = safeWorkflow(intent, coordinator.workflows);
  return {
    taskId: `ongoing_${intent}`,
    steps: flow.map((agentId, index) => ({
      order: index + 1,
      agentId
    }))
  };
}

function parseArgs(argv) {
  const args = {
    title: "",
    details: "",
    activeIntents: "",
    json: false,
    listAgents: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--title") {
      args.title = String(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (token === "--details") {
      args.details = String(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (token === "--active-intents") {
      args.activeIntents = String(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (token === "--json") {
      args.json = true;
      continue;
    }
    if (token === "--list-agents") {
      args.listAgents = true;
      continue;
    }
    if (!token.startsWith("--") && !args.title) {
      args.title = token;
    }
  }

  return args;
}

function listAgents(agents) {
  return agents
    .map((agent) => `${agent.id}: ${agent.responsibility}`)
    .join("\n");
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const coordinator = createCoordinator();

  if (args.listAgents) {
    process.stdout.write(`${listAgents(coordinator.agents)}\n`);
    process.exit(0);
  }

  if (!args.title) {
    process.stderr.write("Usage: node scripts/agent-coordinator.js --title \"Task\" [--details \"...\"] [--active-intents \"handwriting-accuracy,feature-delivery\"] [--json]\n");
    process.exit(1);
  }

  const activePlans = parseActiveIntents(args.activeIntents).map((intent) => buildMockPlan(intent, coordinator));
  const plan = coordinator.collaborate({ title: args.title, details: args.details }, activePlans);

  if (args.json) {
    process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
  } else {
    const agentMap = toAgentMap(coordinator.agents);
    process.stdout.write(`${formatPlan(plan, agentMap)}\n`);
  }
}

module.exports = {
  DEFAULT_AGENTS,
  DEFAULT_WORKFLOWS,
  INTENT_RULES,
  classifyTask,
  createCoordinator,
  createTask
};

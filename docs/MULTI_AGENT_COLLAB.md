# 多 Agent 协作机制

## 目标
- 让不同 agent 分工处理任务。
- 新任务到来时，自动识别可复用的进行中上下文并触发协作。

## Agent 列表
- `task-intake-agent`: 任务分类与流程选择。
- `data-agent`: 数据质量、样本与漂移处理。
- `model-agent`: 融合策略、阈值与个性化规则。
- `evaluation-agent`: 实验评估与风险门禁。
- `product-agent`: 需求落地与验收标准整理。
- `backend-agent`: 服务端实现与存储编排。
- `frontend-agent`: 界面与交互实现。
- `ops-agent`: 监控、发布、回滚策略。
- `delivery-agent`: 发布收口与复盘。

## 新任务协作规则
1. `task-intake-agent` 先分类任务意图（例如 `handwriting-accuracy`）。
2. 根据意图加载工作流并生成步骤。
3. 对比进行中任务，找出重复 agent。
4. 对重复 agent 生成 `context-handoff` 协作动作，优先复用已有结论。
5. 执行新任务工作流。

## 使用方式
- 列出所有 agent：
```bash
npm run agents:plan -- --list-agents
```

- 基于新任务生成协作计划：
```bash
npm run agents:plan -- --title "增加手写识别正确率" --details "优化融合阈值并降低误判"
```

- 带进行中任务上下文生成协作计划：
```bash
npm run agents:plan -- --title "增加手写识别正确率" --active-intents "ops-reliability,feature-delivery"
```

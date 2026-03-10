# 多 Agent 协作机制

## 目标
- 让不同 agent 按职责拆分复杂任务。
- 在新任务进入时，自动判断任务意图并选择协作流水线。
- 当存在进行中任务时，自动识别可复用的上下文并生成跨任务协作动作。

## 当前已实现能力
- 支持任务意图自动分类。
- 支持按意图加载预置工作流。
- 支持输出结构化协作计划。
- 支持检测与进行中任务的 agent 重叠。
- 支持为重叠 agent 生成 `context-handoff` 协作动作。
- 支持纯文本输出与 JSON 输出。
- 支持命令行直接调用。

## Agent 列表
- `task-intake-agent`: 任务分类与工作流选择。
- `data-agent`: 数据质量、样本标注与漂移识别。
- `model-agent`: 评分融合、阈值设计与个性化规则。
- `evaluation-agent`: 实验评估、风险门禁与效果验证。
- `product-agent`: 需求翻译、用户影响与验收标准整理。
- `backend-agent`: 服务端接口、持久化与编排实现。
- `frontend-agent`: 页面、交互与前端流程实现。
- `ops-agent`: 发布安全、监控、回滚与稳定性保障。
- `delivery-agent`: 交付收口、发布检查与复盘。

## 支持的任务意图
- `handwriting-accuracy`
  - 关键词示例：`handwriting` `recognition` `ocr` `accuracy` `threshold` `stroke` `fusion` `判定` `识别` `手写`
- `feature-delivery`
  - 关键词示例：`feature` `ui` `ux` `page` `api` `frontend` `backend` `功能` `页面` `接口`
- `ops-reliability`
  - 关键词示例：`deploy` `latency` `error` `monitor` `rollback` `运维` `稳定性` `监控` `发布`
- `generic`
  - 当未命中上述规则时使用通用工作流

## 预置工作流

### `handwriting-accuracy`
1. `task-intake-agent`
2. `data-agent`
3. `model-agent`
4. `evaluation-agent`
5. `product-agent`
6. `delivery-agent`

### `feature-delivery`
1. `task-intake-agent`
2. `product-agent`
3. `backend-agent`
4. `frontend-agent`
5. `evaluation-agent`
6. `delivery-agent`

### `ops-reliability`
1. `task-intake-agent`
2. `ops-agent`
3. `backend-agent`
4. `evaluation-agent`
5. `delivery-agent`

### `generic`
1. `task-intake-agent`
2. `product-agent`
3. `backend-agent`
4. `evaluation-agent`
5. `delivery-agent`

## 协作规则
1. 新任务进入后，`task-intake-agent` 先根据标题和详情执行意图分类。
2. 系统根据意图选择预置工作流。
3. 生成协作计划，包含：
   - `taskId`
   - `title`
   - `details`
   - `intent`
   - `leadAgentId`
   - `steps`
4. 如果传入了进行中任务，会比对步骤中的重复 agent。
5. 对重复 agent 生成 `syncActions`，模式为 `context-handoff`。
6. 新任务执行时，优先复用共享 agent 在旧任务中的上下文结论。

## 命令行使用方式

### 列出所有 agent
```bash
npm run agents:plan -- --list-agents
```

### 基于新任务生成协作计划
```bash
npm run agents:plan -- --title "增加手写识别正确率" --details "优化融合阈值并降低误判"
```

### 带进行中任务上下文生成协作计划
```bash
npm run agents:plan -- --title "增加手写识别正确率" --active-intents "ops-reliability,feature-delivery"
```

### 输出 JSON 结果
```bash
npm run agents:plan -- --title "新增学习页筛选功能" --details "补充列表等级筛选" --json
```

## 输出结构说明

### 文本输出
- 包含任务标题、任务 ID、意图、Lead Agent、Pipeline 步骤。
- 当存在跨任务协作时，附加 `Cross-task Collaboration` 区块。

### JSON 输出
- 主要字段：
  - `taskId`
  - `title`
  - `details`
  - `createdAt`
  - `intent`
  - `leadAgentId`
  - `steps`
  - `syncActions`

## 当前验证覆盖
- 任务意图分类是否正确落到 `handwriting-accuracy`
- 计划生成时是否以 `task-intake-agent` 作为 lead agent
- 当新任务与进行中任务存在 agent 重叠时，是否生成 `syncActions`

验证命令：
```bash
npm run test:agents
```

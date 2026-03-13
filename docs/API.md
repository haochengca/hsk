# HSK 系统 API 文档

Base URL: `/api`

## 1. 健康检查
### `GET /health`
- 响应：`{ ok: true, now }`

## 2. 认证

### `POST /register`
- 请求：`{ username, password, role, linkedParentUsername? }`
  - `role`: `parent|child`
  - 当 `role=child` 时必须传 `linkedParentUsername`，且该账号需已存在并且角色为 `parent`
- 响应：`{ ok, message }`

### `POST /login`
- 请求：`{ username, password }`
- 响应：
```json
{
  "ok": true,
  "token": "...",
  "user": {
    "username": "...",
    "role": "admin|parent|child",
    "linkedParentUsername": "",
    "linkedChildren": []
  }
}
```

### `POST /logout`
- Header: `Authorization: Bearer <token>`
- 响应：`{ ok }`

### `POST /change-password`
- Header: `Authorization: Bearer <token>`
- 请求：`{ currentPassword, newPassword }`
- 规则：
  - 所有已登录角色（admin/parent/child）均可调用
  - `newPassword` 长度需为 6-64 位，且不能与当前密码相同
- 响应：`{ ok: true, message: "密码修改成功" }`

## 3. 用户初始化与保存

### `GET /bootstrap`
- Header: `Authorization`
- 响应：
```json
{
  "ok": true,
  "user": {
    "username": "...",
    "role": "admin|parent|child",
    "linkedParentUsername": "",
    "linkedChildren": []
  },
  "data": {
    "progress": {},
    "wrongBook": [],
    "rewards": {
      "totalPoints": 0,
      "weeklyPoints": 0,
      "weeklyCorrect": 0,
      "currentWeekKey": "YYYY-MM-DD",
      "lastUpdatedAt": 0
    },
    "reviewPrefs": {
      "reviewType": "char|word",
      "reviewLevel": "all|1..6",
      "reviewCount": "all|5|10|20",
      "reviewWrongMixRatio": "0|10|20|30|40|50|70|100"
    }
  },
  "flags": {
    "recognitionV2Enabled": true
  },
  "lexiconOverrides": {},
  "submissions": []
}
```
- 说明：
  - `lexiconOverrides` 为学习项覆盖表，键格式为 `char:字` 或 `word:词`
  - 前端会在启动时应用该表中的 `pinyin / prompt1 / prompt2` 覆盖值
  - `submissions` 返回规则：
    - `admin` / `parent`：返回全部提交记录（按 `createdAt` 倒序）
    - `child`：仅返回当前账号自己的提交记录

### `PUT /user-data`
- Header: `Authorization`
- 请求：
```json
{
  "progress": {},
  "wrongBook": [],
  "rewards": {},
  "reviewPrefs": {}
}
```
- 响应：`{ ok, savedAt }`

## 3.1 已下线路由

### `GET|POST|PUT|DELETE /tasks`
### `GET|POST|PUT|DELETE /tasks/:id`
- Header: `Authorization`
- 当前行为：统一返回 `404`
- 响应：`{ ok: false, message: "任务功能已下线" }`

## 4. 默写提交

### `POST /submissions`
- Header: `Authorization`（parent|child）
- 请求：
```json
{
  "type": "char|word",
  "target": "目标字或词",
  "pinyin": "...",
  "userAnswer": "...",
  "handwritingImage": "data:image/...",
  "accuracyPercent": 0,
  "systemResult": true,
  "finalResult": true,
  "judgeDetail": {
    "version": "v2",
    "decision": "pass|fail|retry",
    "decisionScore": 0.72,
    "baseScore": 0.69,
    "mlScore": 0.81,
    "blendedScore": 0.72,
    "tier": "simple|medium|complex",
    "thresholds": { "pass": 0.61, "retryLow": 0.56 },
    "engines": { "overlap": 0.71, "projection": 0.66, "grid": 0.67 },
    "retryAttempt": 0,
    "reason": "pass_threshold"
  },
  "pointsAwarded": 1,
  "wordCharResults": [
    {
      "char": "你",
      "isGood": true,
      "accuracyPercent": 90,
      "handwritingImage": "data:image/...",
      "judgeDetail": {
        "version": "v2",
        "decision": "pass",
        "decisionScore": 0.74
      }
    }
  ]
}
```
- 说明：
  - 词汇提交可包含 `wordCharResults`，用于逐字追踪。
  - `judgeDetail` 与 `wordCharResults[].judgeDetail` 均为可选字段，旧请求体保持兼容。
  - `handwritingImage` 对词汇可为多图拼接字符串（`||` 分隔），用于兼容旧数据展示。
- 响应：`{ ok, submission }`

## 5. 管理角色复判

### `PUT /submissions/:id/review`
- Header: `Authorization`（parent）
- 请求：
```json
{
  "finalResult": true,
  "wordCharResults": [
    {
      "char": "你",
      "isGood": true,
      "accuracyPercent": 90,
      "handwritingImage": "data:image/...",
      "judgeDetail": {
        "version": "v2",
        "decision": "pass",
        "decisionScore": 0.74
      }
    },
    {
      "char": "好",
      "isGood": false,
      "accuracyPercent": 55,
      "handwritingImage": "data:image/..."
    }
  ]
}
```
- 服务端规则：
  - 若提交是词汇且传了 `wordCharResults`，最终 `finalResult` 以逐字结果自动汇总（全对=正确）。
- 复判后会同步更新该用户积分、词汇错题、相关单字错题。

## 6. 错题本管理

### `GET /admin/users/:username/wrong-book`
- Header: `Authorization`（admin|parent）
- 说明：
  - 仅可查看父母或孩子账号的错题本
- 响应：
```json
{
  "ok": true,
  "wrongBook": [
    {
      "key": "word:高兴",
      "type": "word",
      "text": "高兴"
    }
  ]
}
```

### `PUT /admin/users/:username/wrong-book`
- Header: `Authorization`（admin|parent）
- 请求：
```json
{
  "action": "add|remove",
  "type": "char|word",
  "text": "高兴"
}
```
- 说明：
  - `action` 必须为 `add` 或 `remove`
  - `type` 为空时按 `char` 处理
  - 仅可操作父母或孩子账号的错题本
- 响应：
```json
{
  "ok": true,
  "wrongBook": [
    {
      "key": "word:高兴",
      "type": "word",
      "text": "高兴"
    }
  ]
}
```

## 7. 管理员用户管理

### `GET /admin/users`
- Header: `Authorization`（admin）
- 响应：
```json
{
  "ok": true,
  "users": [
    {
      "username": "alice",
      "role": "admin|parent|child",
      "linkedParentUsername": "",
      "linkedChildren": [],
      "createdAt": 0
    }
  ]
}
```

### `DELETE /admin/users/:username`
- Header: `Authorization`（admin）
- 说明：
  - 不允许删除管理员账号
  - 删除父母/孩子账号时会同步清理其学习数据、会话、提交记录，并维护亲子关联关系
- 响应：`{ ok: true, deleted: username }`

### `POST /admin/users/:username/reset-data`
- Header: `Authorization`（admin）
- 说明：
  - 不删除账号本身，仅清空该用户学习数据（`userData`）、该用户默写记录（`submissions.username`）与该用户会话（`sessions.username`）
  - 不允许清空管理员账号数据
- 响应：
```json
{
  "ok": true,
  "username": "alice",
  "submissionsCleared": 12,
  "sessionsCleared": 1
}
```

## 8. 学习项管理

### `PUT /admin/learning-item-override`
- Header: `Authorization`（admin）
- 请求：
```json
{
  "type": "char|word",
  "text": "高兴",
  "pinyin": "gāoxìng",
  "prompt1": "高兴",
  "prompt2": "很高兴"
}
```
- 说明：
  - `type` 为空时按 `char` 处理
  - `text` 必填，表示学习项内容
  - `pinyin / prompt1 / prompt2` 任一非空即可生成覆盖记录
  - 若三者都为空，则删除该学习项现有覆盖记录
- 响应：
```json
{
  "ok": true,
  "key": "word:高兴",
  "override": {
    "type": "word",
    "text": "高兴",
    "pinyin": "gāoxìng",
    "prompt1": "高兴",
    "prompt2": "很高兴",
    "updatedAt": 0,
    "updatedBy": "admin"
  },
  "lexiconOverrides": {}
}
```

## 9. 认证与会话补充规则
- 除 `GET /health`、`POST /register`、`POST /login` 外，其余 API 均要求 `Authorization: Bearer <token>`
- 会话有效期为 30 天，服务端会在鉴权时清理过期会话
- `POST /change-password` 成功后，仅保留当前登录会话，其余历史会话会被失效

说明：
- 父母账号可使用 `PUT /submissions/:id/review` 与错题本管理接口（`/api/admin/users/:username/wrong-book` 的查询/编辑）。
- 管理员账号不可使用 `PUT /submissions/:id/review`，可使用用户管理接口（`GET/DELETE /api/admin/users...`）与学习项管理接口。
- 管理员菜单中的“提示词1 / 提示词2”默认值由前端运行时生成；一旦通过本接口保存，就以后端 `lexiconOverrides` 为准。

## 9. HSK 数据生成约定
- HSK 原始源文件位于：
  - `data/hsk_source/L1.txt`
  - `data/hsk_source/L2.txt`
  - `data/hsk_source/L3.txt`
  - `data/hsk_source/L4.txt`
  - `data/hsk_source/L5.txt`
  - `data/hsk_source/L6.txt`
- 词汇输出文件：
  - `data/hsk_words_1_6.json`
  - `data/hsk_words_1_6.js`
- 汉字输出文件：
  - `data/hsk_chars_1_6.json`
  - `data/hsk_chars_1_6.js`
- 词汇生成规则：
  - 仅保留多字词
  - 单字词不进入词汇数据
- 汉字生成规则：
  - 从词汇源逐字拆分得到
  - 汉字等级取该字在词汇源中首次出现的等级
  - 若该字存在单字词条，优先使用该条目的拼音与释义
- 统一生成命令：
```bash
npm run data:hsk
```

## 10. 错误码（常见）
- `400` 参数错误
- `401` 未登录或会话过期
- `403` 权限不足
- `404` 资源不存在
- `409` 注册用户名已存在

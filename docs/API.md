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
  "submissions": []
}
```

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
  "pointsAwarded": 1,
  "wordCharResults": [
    {
      "char": "你",
      "isGood": true,
      "accuracyPercent": 90,
      "handwritingImage": "data:image/..."
    }
  ]
}
```
- 说明：
  - 词汇提交可包含 `wordCharResults`，用于逐字追踪。
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
      "handwritingImage": "data:image/..."
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

## 6. 管理员用户管理

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

说明：
- 父母账号可使用 `PUT /submissions/:id/review` 与错题本管理接口（`/api/admin/users/:username/wrong-book` 的查询/编辑）。
- 管理员账号不可使用 `PUT /submissions/:id/review`，可使用用户管理接口（`GET/DELETE /api/admin/users...`）与学习项管理接口。
- 响应：`{ ok, submission }`

## 6. 错误码（常见）
- `400` 参数错误
- `401` 未登录或会话过期
- `403` 权限不足
- `404` 资源不存在
- `409` 注册用户名已存在

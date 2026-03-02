# HSK 系统 API 文档

Base URL: `/api`

## 1. 健康检查
### `GET /health`
- 响应：`{ ok: true, now }`

## 2. 认证

### `POST /register`
- 请求：`{ username, password }`
- 响应：`{ ok, message }`

### `POST /login`
- 请求：`{ username, password }`
- 响应：
```json
{ "ok": true, "token": "...", "user": { "username": "...", "role": "user|admin" } }
```

### `POST /logout`
- Header: `Authorization: Bearer <token>`
- 响应：`{ ok }`

## 3. 用户初始化与保存

### `GET /bootstrap`
- Header: `Authorization`
- 响应：
```json
{
  "ok": true,
  "user": { "username": "...", "role": "user|admin" },
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
- Header: `Authorization`（user）
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

## 5. 管理员复判

### `PUT /submissions/:id/review`
- Header: `Authorization`（admin）
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
- 响应：`{ ok, submission }`

## 6. 错误码（常见）
- `400` 参数错误
- `401` 未登录或会话过期
- `403` 权限不足
- `404` 资源不存在
- `409` 注册用户名已存在

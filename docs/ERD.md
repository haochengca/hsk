# HSK 系统数据模型（ERD 文字版）

## 1. users
- `username` (PK)
- `passwordHash`
- `role` (`admin|parent|child`)
- `linkedParentUsername`（仅 `child` 使用，FK -> users.username）
- `linkedChildren`（仅 `parent` 使用，JSON array of usernames）
- `createdAt`

## 2. sessions
- `token` (PK)
- `username` (FK -> users.username)
- `role`
- `createdAt`
- `expiresAt`

## 3. userData（按 username 聚合）
- `username` (PK/FK -> users.username)
- `progress` (JSON)
- `wrongBook` (JSON array)
- `rewards` (JSON)
- `reviewPrefs` (JSON)

### 3.1 wrongBook item
- `key`（例如：`char:你` / `word:你好`）
- `type`（`char|word`）
- `text`

### 3.2 rewards
- `totalPoints`
- `weeklyPoints`
- `weeklyCorrect`
- `currentWeekKey`
- `lastUpdatedAt`

### 3.3 reviewPrefs
- `reviewType`
- `reviewLevel`
- `reviewCount`
- `reviewWrongMixRatio`

## 4. submissions
- `id` (PK)
- `username` (FK -> users.username)
- `type` (`char|word`)
- `target`
- `pinyin`
- `userAnswer`
- `handwritingImage`
- `accuracyPercent`
- `systemResult`
- `finalResult`
- `judgeDetail` (JSON, optional)
- `pointsAwarded`
- `wordCharResults` (JSON array)
- `reviewedBy`
- `reviewedAt`
- `createdAt`

### 4.1 wordCharResults item
- `char`
- `isGood`
- `accuracyPercent`
- `handwritingImage`
- `judgeDetail` (JSON, optional)

## 5. 关系
- 一个 `users` 可有多条 `sessions`。
- 一个 `users` 对应一个 `userData`。
- 一个 `users` 可有多条 `submissions`。
- `submissions.reviewedBy` 关联管理员 `users.username`（可空）。

## 6. 关键业务约束
- 词汇复判优先以 `wordCharResults` 计算整词最终结果。
- 复判后需要联动更新 `userData.wrongBook` 与 `userData.rewards`。
- 错题本可同时存在词汇项与单字项。

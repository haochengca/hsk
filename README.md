# HSK 学习与默写系统

这是一个面向家庭与教学场景的 HSK 学习网站，支持汉字学习、词汇学习、写字练习、默写测验、错题回流和管理员维护。

## 项目概览

- 前端：原生 HTML / CSS / JavaScript
- 后端：Node.js `http` 服务
- OCR：PaddleOCR 3.x，推荐通过独立容器部署
- 持久化：未配置 `DATABASE_URL` 时使用 SQLite；配置后切换到 Postgres
- 运行环境：Node.js `>=22`
- 默认管理员账号：`admin / admin123`

## 目录说明

- [app.js](./app.js)：前端主逻辑
- [server.js](./server.js)：后端入口
- [data](./data)：HSK 数据源、生成结果与默认 SQLite 数据文件
- [scripts](./scripts)：数据生成与开发辅助脚本
- [tests](./tests)：Node 测试与 Playwright E2E
- [docker-compose.yml](./docker-compose.yml)：本地 Docker Compose 部署入口
- [docker/paddle-ocr/Dockerfile](./docker/paddle-ocr/Dockerfile)：OCR 容器构建文件

## 启动方式总览

### 1. 本地 Node.js 启动

适合前端开发、后端调试或不需要容器时使用。

```bash
npm install
npm start
```

- 默认地址：`http://127.0.0.1:8787`
- 默认使用 SQLite：`data/server_db.sqlite`
- 默认 OCR 地址：`http://192.168.1.33:8788`

说明：

- `192.168.1.33` 是当前 Docker 宿主机在局域网中的地址
- 这个地址用于非容器方式运行 `npm start` 时，让本地 Node 服务访问运行在 Docker 宿主机上的 OCR 容器
- 如果你的 Docker 宿主机地址不是 `192.168.1.33`，请按实际地址覆盖 `OCR_SERVICE_URL`

如果你本地 OCR 服务不在默认地址，可手动覆盖：

```bash
OCR_SERVICE_URL=http://127.0.0.1:8788 npm start
```

### 2. Docker Compose 启动

适合本地完整运行整套服务，也是推荐的部署演练方式。

```bash
docker compose up -d --build
```

启动后默认会同时运行 3 个容器：

- `app`：Node.js 主站与业务 API
- `postgres`：Postgres 16
- `ocr-service`：PaddleOCR 手写识别服务

默认访问地址：

- Web / API：`http://127.0.0.1:8787`
- 应用健康检查：`http://127.0.0.1:8787/api/health`
- OCR 健康检查：`http://127.0.0.1:8788/health`

完整步骤、排障与环境变量说明见：

- [Docker Compose 部署说明](./docs/DEPLOY_PADDLEOCR_DOCKER.md)

## Docker Compose 部署重点

### 依赖要求

- Docker Engine 24+
- Docker Compose v2+
- 首次拉起 OCR 容器时需可联网下载模型

### 一条命令启动

```bash
docker compose up -d --build
```

### 停止与查看日志

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f ocr-service
docker compose down
```

### 默认容器内环境变量

`docker-compose.yml` 已为 `app` 容器设置：

```bash
HOST=0.0.0.0
PORT=8787
DB_PATH=/app/data/server_db.sqlite
DATABASE_URL=postgresql://hsk:hsk_password@postgres:5432/hsk
PGSSL=disable
OCR_SERVICE_URL=http://ocr-service:8788
OCR_SERVICE_TIMEOUT_MS=30000
RECOGNITION_V2_ENABLED=1
```

这意味着：

- `app` 容器默认连接同一套 Compose 中的 `postgres`
- `app` 容器默认通过内部服务名 `ocr-service` 调用 OCR
- 即使保留了 `DB_PATH`，在 Compose 场景下主库仍优先使用 Postgres

### 常用可覆盖变量

可在命令前临时传入，或写入项目根目录 `.env`：

```bash
POSTGRES_DB=hsk
POSTGRES_USER=hsk
POSTGRES_PASSWORD=your_password
POSTGRES_HOST_PORT=5433
OCR_HOST_PORT=8788
```

示例：

```bash
POSTGRES_PASSWORD=change_me OCR_HOST_PORT=9797 docker compose up -d --build
```

说明：

- Postgres 宿主机映射端口默认是 `5433`
- OCR 宿主机映射端口默认是 `8788`
- `app` 的宿主机映射端口当前固定为 `8787:8787`

## 数据与存储

- HSK 源文件位于 `data/hsk_source/L1.txt` 到 `L6.txt`
- 重新生成汉字与词汇数据：

```bash
npm run data:hsk
```

- 未配置 `DATABASE_URL` 时，服务端使用 SQLite，默认文件为 `data/server_db.sqlite`
- 配置 `DATABASE_URL` 后，服务端切换到 Postgres
- 当 Postgres 首次启用且目标库为空时，服务会自动尝试导入旧数据，优先级如下：
  1. `DB_PATH` 指向的 SQLite 文件
  2. `data/server_db.sqlite`
  3. `data/server_db.json`
  4. 默认初始化数据
- `GET /api/health` 会返回当前数据库类型：
  - `db.type = "postgres"` 表示已连接 Postgres
  - `db.type = "sqlite"` 表示仍在使用 SQLite

## 测试命令

```bash
npm run test:agents
npm run test:recognition
npm run test:submissions
npm run test:ocr-api
npm run test:e2e
```

说明：

- 项目当前没有统一的 `npm test`
- E2E 测试依赖 Playwright，并会自行拉起本地服务

## 使用对象

- 孩子：学习汉字、练习书写、进行默写、复习错题
- 父母：查看孩子学习情况、复判默写结果、管理错题本
- 管理员：管理用户、维护学习项、维护提示词与拼音

## 网站主要功能

### 1. 学习

- 支持学习汉字和词汇
- 支持按 HSK 等级筛选
- 可在“全部学习项列表”中按 HSK 等级、列表类型、默写次数、准确率筛选
- 可勾选学习项，用于后续批量演示或开始默写

### 2. 写字练习

- 点击学习列表中的汉字可直接进入写字页演示笔画
- 支持逐字查看、上下切换
- 支持批量演示已选汉字
- 支持在画布上手写并进行智能判定

### 3. 默写测验

- 支持汉字默写和词汇默写
- 可选择 HSK 等级、默写数量、是否混入错题、是否先预览
- 系统会朗读题目，并显示拼音、释义和提示词
- 词汇默写按单字逐个判定

### 4. 错题本

- 自动收集写错的汉字和词汇
- 支持按 HSK 等级筛选
- 支持设置错题默写数量
- 支持针对错题进行专项复习

### 5. 记录与积分

- 自动记录学习与默写结果
- 统计总次数、正确率、最近学习情况
- 每次正确可累计积分

## 不同角色如何使用

### 孩子账号

1. 注册或登录账号
2. 在“学习”页选择 HSK 等级和学习类型
3. 点击汉字开始学习，或勾选后批量练习
4. 进入“写字”页进行笔画和书写练习
5. 进入“默写测验”进行练习
6. 在“错题本”中反复复习错误内容

### 父母账号

1. 登录父母账号
2. 查看孩子的学习与默写记录
3. 在“默写判定审核”中复判系统结果
4. 在“错题本管理”中查看或调整错题本内容

### 管理员账号

1. 登录管理员账号
2. 在“用户管理”中查看和管理用户
3. 在“错题本管理”中查看用户错题
4. 在“学习项管理”中维护拼音、提示词 1、提示词 2

## 开发辅助能力

项目内置多 Agent 协作规划脚本，可用于复杂任务拆解和协作流程规划。

```bash
npm run agents:plan -- --title "优化手写识别正确率" --details "调整阈值与融合策略"
```

## 更多文档

- [接口文档](./docs/API.md)
- [产品需求文档](./docs/PRD.md)
- [项目进度](./docs/PROGRESS.md)
- [Docker Compose 部署说明](./docs/DEPLOY_PADDLEOCR_DOCKER.md)
- [多 Agent 协作文档](./docs/MULTI_AGENT_COLLAB.md)

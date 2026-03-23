# Docker Compose 部署指南

本项目推荐使用 `docker-compose.yml` 一次性启动完整运行环境。当前方案是三容器部署，不是只有 OCR 两容器：

- `app`：Node.js 主站与业务 API
- `postgres`：Postgres 16 数据库
- `ocr-service`：PaddleOCR 3.x 手写识别服务

主服务通过 `OCR_SERVICE_URL=http://ocr-service:8788` 调用 OCR 容器，并通过 `DATABASE_URL` 连接同一套 Compose 中的 Postgres。

补充说明：

- 当 `app` 也运行在 Compose 容器内时，应使用容器服务名 `ocr-service`
- 当 `app` 通过 `npm start` 在宿主机直接运行，而 OCR 仍跑在 Docker 中时，可以把 `OCR_SERVICE_URL` 指向 Docker 宿主机地址
- 当前 README 中示例的 `192.168.1.33`，就是该 Docker 宿主机在局域网中的地址

## 1. 前置要求

- Docker Engine 24+
- Docker Compose v2+
- 首次启动 OCR 容器时，机器需能访问外网以拉取模型
- 建议宿主机至少预留 4GB 内存

## 2. 当前部署内容

### 默认端口

- Web / API：`8787`
- Postgres 宿主机映射：`5433`
- OCR 健康检查：`8788`

### 当前镜像与模型

- Node 基础镜像：`node:22-bookworm-slim`
- Postgres 镜像：`postgres:16-alpine`
- PaddleOCR 版本：`paddleocr==3.4.0`
- PaddlePaddle 版本：`paddlepaddle==3.3.0`
- OCR 模型：`PP-OCRv5_server_rec`

选择 `PP-OCRv5_server_rec` 的原因：

- 中文识别能力更强，适合服务端精度优先场景
- 项目输入多为单字或短词
- 结合预处理裁剪后，效果更适合当前手写判定链路

## 3. 一键启动

在项目根目录执行：

```bash
docker compose up -d --build
```

如需前台查看完整日志，也可以使用：

```bash
docker compose up --build
```

## 4. 启动后的验证

### 查看容器状态

```bash
docker compose ps
```

期望看到：

- `hsk-postgres` 为 `healthy`
- `hsk-paddle-ocr` 为 `healthy`
- `hsk-app` 为 `running`

### 访问检查

- 首页：`http://127.0.0.1:8787`
- 应用健康检查：`http://127.0.0.1:8787/api/health`
- OCR 健康检查：`http://127.0.0.1:8788/health`

### 健康检查返回重点

`GET /api/health` 返回中：

- `ok: true` 表示应用已启动
- `db.type = "postgres"` 表示 Compose 场景下主服务已正确连接数据库

## 5. 默认环境变量

`app` 容器当前固定使用以下变量：

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

`ocr-service` 容器默认使用：

```bash
PORT=8788
OCR_MODEL_NAME=PP-OCRv5_server_rec
OCR_VARIANT_LIMIT=4
PADDLE_PDX_MODEL_SOURCE=BOS
```

## 6. 常用自定义变量

可通过命令前缀或项目根目录 `.env` 覆盖：

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

- `POSTGRES_HOST_PORT` 影响宿主机访问数据库的端口
- `OCR_HOST_PORT` 影响宿主机访问 OCR 健康检查和调试接口的端口
- `app` 的宿主机映射端口当前写死为 `8787:8787`，如需修改需调整 `docker-compose.yml`

## 7. 数据与卷

当前 Compose 会使用以下持久化位置：

- `./data:/app/data`
  - 用于共享项目内数据文件
  - 也会保留 SQLite 文件 `data/server_db.sqlite`
- `postgres-data:/var/lib/postgresql/data`
  - Postgres 数据卷
- `paddle-model-cache:/root/.paddlex`
  - Paddle 模型缓存卷，避免每次重启都重新下载

## 8. 数据库切换与初始化

虽然 `DB_PATH` 仍被传入容器，但在 Compose 部署中：

- `DATABASE_URL` 已默认配置
- 因此应用会优先使用 Postgres

当目标 Postgres 为空时，服务会自动按以下顺序尝试导入旧数据：

1. `DB_PATH` 指向的 SQLite 文件
2. `data/server_db.sqlite`
3. `data/server_db.json`
4. 默认初始化数据

如果是全新环境，没有旧数据，也会自动初始化默认管理员账号：

- 用户名：`admin`
- 密码：`admin123`

## 9. OCR 调用方式

前端与业务代码无需直接访问 OCR 容器，统一走主服务代理接口：

- `GET /api/ocr/health`
- `POST /api/ocr/recognize`
- `POST /api/ocr/judge`

这样可避免前端暴露 OCR 内部地址，也便于后续替换 OCR 实现。

## 10. OCR 识别增强策略

为提升手写识别能力，OCR 服务会对同一张图做多路预处理，包括：

- 墨迹区域自动裁剪
- 自动对比度增强
- Otsu 二值化
- 反相二值兜底
- 居中缩放到白底方图后再识别

然后按目标字词、候选词与识别置信度综合排序，输出最佳结果。

## 11. 常用运维命令

### 查看日志

```bash
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f ocr-service
```

### 重启单个服务

```bash
docker compose restart app
docker compose restart ocr-service
```

### 停止服务

```bash
docker compose down
```

### 连同命名卷一起删除

这会清空 Postgres 数据和 OCR 模型缓存。

```bash
docker compose down -v
```

## 12. 常见问题

### OCR 容器长时间未变成 healthy

优先检查：

- 是否首次下载模型，首次启动会明显更慢
- 宿主机网络是否允许下载 Paddle 模型
- 是否内存不足导致容器被系统杀掉

### `/api/health` 返回 `db.type = "sqlite"`

说明主服务没有按预期连上 Postgres，通常需要检查：

- `postgres` 是否 healthy
- `DATABASE_URL` 是否被覆盖
- `app` 容器日志中是否有连接失败信息

### 8787 或 8788 端口冲突

- OCR 端口可通过 `OCR_HOST_PORT` 覆盖
- Postgres 端口可通过 `POSTGRES_HOST_PORT` 覆盖
- 应用端口当前需要直接修改 `docker-compose.yml`

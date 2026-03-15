# PaddleOCR Docker Compose 部署

本文档说明如何使用 `docker compose` 启动 HSK 主应用和 PaddleOCR API，并通过统一 API 访问 OCR。

## 1. 前提条件

- 已安装 Docker Desktop 或 Docker Engine + Compose Plugin
- 可访问外网下载 Python 依赖和 Paddle 模型
- 建议内存不少于 6GB

## 2. 启动

在项目根目录执行：

```bash
docker compose up --build
```

首次启动会额外下载：

- Python 依赖
- `paddleocr==3.4.0`
- `paddlepaddle==3.3.0`
- `PP-OCRv5_server_rec` 模型

默认端口：

- Web 应用：`http://127.0.0.1:8787`
- PaddleOCR API：`http://127.0.0.1:8060`

## 3. 健康检查

主应用：

```bash
curl http://127.0.0.1:8787/api/health
```

OCR 服务：

```bash
curl http://127.0.0.1:8787/api/ocr/health
curl http://127.0.0.1:8060/health
```

## 4. OCR API 调用

推荐调用 Node 代理接口，这样前端和外部脚本都只需要访问一个服务。

### 4.1 通过主应用代理调用

```bash
curl -X POST http://127.0.0.1:8787/api/ocr/recognize \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{
    "mode": "single_char",
    "images": ["data:image/png;base64,..."],
    "expectedTexts": ["你"]
  }'
```

### 4.2 直接调用 PaddleOCR API

```bash
curl -X POST http://127.0.0.1:8060/ocr/recognize \
  -H 'Content-Type: application/json' \
  -d '{
    "mode": "single_char",
    "images": ["data:image/png;base64,..."],
    "expected_texts": ["你"]
  }'
```

## 5. 关键环境变量

主应用：

- `OCR_ENABLED=1`
- `OCR_API_BASE_URL=http://paddleocr-api:8060`
- `OCR_API_TIMEOUT_MS=20000`

OCR 服务：

- `PADDLE_OCR_DEVICE=cpu`
- `PADDLEOCR_REC_MODEL_NAME=PP-OCRv5_server_rec`
- `PADDLE_PDX_MODEL_SOURCE=BOS`
- `PADDLE_OCR_MAX_IMAGES=12`

## 6. 数据与缓存

Compose 默认挂载两个卷：

- `app-data`：保存 SQLite 数据
- `paddle-model-cache`：保存 Paddle 模型缓存，避免重复下载

清理全部数据与缓存：

```bash
docker compose down -v
```

## 7. 实现说明

- 前端判定流程会优先调用 `/api/ocr/recognize`
- OCR 不可用时，会自动回退到现有本地判定算法
- OCR 服务对每张手写图会执行原图、归一化图、二值化图多路识别，并优先选择与期望汉字完全匹配的结果

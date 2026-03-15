# PaddleOCR Docker Compose 部署

本项目已补充两容器部署方案：

- `app`：现有 Node.js 主站与业务 API
- `ocr-service`：基于 PaddleOCR 3.x 的手写识别服务

其中判定链路当前优先走 PaddleOCR，主服务通过 `OCR_SERVICE_URL` 调用 OCR 容器。

## 1. 版本选择

当前部署文件使用：

- `paddleocr==3.4.0`
- `paddlepaddle==3.3.0`
- 识别模型：`PP-OCRv5_server_rec`

选择原因：

- PaddleOCR 3.x 已经切到新的 pipeline / module 体系
- `PP-OCRv5_server_rec` 对中文识别能力更强，适合服务端精度优先场景
- 本项目的手写输入多为单字或短词，使用识别模型配合预处理裁剪比整页 OCR 更合适

## 2. 启动

在项目根目录执行：

```bash
docker compose up --build
```

启动后：

- 主服务：`http://127.0.0.1:8787`
- OCR 服务健康检查：`http://127.0.0.1:18000/health`

## 3. 相关环境变量

主服务：

- `OCR_SERVICE_URL`，默认 `http://ocr-service:8000`
- `OCR_SERVICE_TIMEOUT_MS`，默认 `30000`

OCR 服务：

- `OCR_HOST_PORT`，宿主机映射端口，默认 `18000`
- `OCR_MODEL_NAME`，默认 `PP-OCRv5_server_rec`
- `OCR_VARIANT_LIMIT`，默认 `4`
- `OCR_PASS_THRESHOLD`，默认 `0.82`
- `OCR_FUZZY_THRESHOLD`，默认 `0.92`
- `PADDLE_PDX_MODEL_SOURCE`，默认 `BOS`

示例：

```bash
OCR_HOST_PORT=18001 docker compose up --build
```

## 4. 识别增强策略

为提高手写识别能力，OCR 服务会对同一张图做多路预处理：

- 墨迹区域自动裁剪
- 自动对比度增强
- Otsu 二值化
- 反相二值图兜底
- 居中缩放到白底方图后再识别

然后按目标字词、候选词和识别置信度进行排序，输出最佳结果。

## 5. 主服务代理接口

主服务已新增：

- `GET /api/ocr/health`
- `POST /api/ocr/recognize`
- `POST /api/ocr/judge`

这样前端或其他业务服务只需要访问主服务，无需直接感知 OCR 容器。

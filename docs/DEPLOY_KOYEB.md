# Koyeb 部署：使用 Koyeb 免费 Postgres

本项目后端已支持：

- 配置 `DATABASE_URL` 时使用 Postgres（推荐生产）
- 不配置时回退 SQLite

---

## 1) 创建 Koyeb Postgres（免费）

在 Koyeb 控制台：

1. 进入 **Databases** -> **Create database service**
2. 选择 **PostgreSQL**
3. 选择 **Free (5h)** 计划
4. 创建完成后，在数据库页面复制连接串（Connection string）

连接串格式示例：

```bash
postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require
```

---

## 2) 绑定到你的 Web Service

在 Koyeb 的 Web Service 环境变量添加：

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<db>?sslmode=require
```

然后点击 **Redeploy**。

---

## 3) 自动迁移说明

当 `DATABASE_URL` 首次启用且 Postgres 为空时，服务会自动导入旧数据（按以下优先级）：

1. `DB_PATH` 指向的 SQLite 文件（默认 `data/server_db.sqlite`）
2. `data/server_db.sqlite`
3. `data/server_db.json`
4. 默认初始数据（含 `admin`）

---

## 4) 验证

部署后访问：

```bash
GET /api/health
```

返回 `ok: true` 即部署成功，且数据已切换到 Postgres。

---

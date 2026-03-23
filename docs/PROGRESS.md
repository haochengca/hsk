# 项目进度（执行与验证）

## 本轮任务执行状态（2026-03-23）
| 任务 | 状态 | 实现文件 | 验证结果 |
|---|---|---|---|
| README 与部署文档统一重写 | 已完成 | `README.md` `docs/DEPLOY_PADDLEOCR_DOCKER.md` | 通过：已统一本地 Node 与 Docker Compose 两条启动路径，修正文档中 Docker 为三容器部署、补充环境变量、验证步骤与排障说明 |

## 本轮任务执行状态（2026-03-13）
| 任务 | 状态 | 实现文件 | 验证结果 |
|---|---|---|---|
| README 补充本地启动与存储说明 | 已完成 | `README.md` | 通过：已补充 `npm install` / `npm start`、Node 版本、默认管理员账号、SQLite/Postgres 切换说明 |
| API 文档补充错题本管理与会话规则 | 已完成 | `docs/API.md` | 通过：已补充 `/admin/users/:username/wrong-book`、任务下线路由说明、会话有效期与改密后的会话规则 |

## 本轮任务执行状态（2026-03-10）
| 任务 | 状态 | 实现文件 | 验证结果 |
|---|---|---|---|
| 前端主包去大数据内嵌、改为运行时加载词库 JSON | 已完成 | `app.js` `index.html` | 通过：`app.js` 不再内嵌 HSK 数据，E2E 验证资源请求命中 `data/hsk_chars_1_6.json` 与 `data/hsk_words_1_6.json` |
| 静态资源缓存策略优化 | 已完成 | `server.js` | 通过：词库 JSON 返回长期缓存头，普通静态资源返回短时缓存头 |
| 登录后隐藏面板延迟渲染 | 已完成 | `app.js` | 通过：后台/记录页改为当前 tab 首次进入渲染，隐藏 tab 使用空闲时预热 |
| 学习页 / 写字页 / 管理页高频列表渲染收敛 | 已完成 | `app.js` | 通过：列表改为按帧合并渲染，HTML 未变化时不重复写入 DOM |
| 新增管理员前端冒烟 E2E | 已完成 | `tests/e2e/frontend-smoke.spec.js` `package.json` `package-lock.json` | 通过：校验 JSON 资源加载、管理员登录与后台默认落点 |
| 新增孩子账号学习主流程 E2E | 已完成 | `tests/e2e/frontend-smoke.spec.js` | 通过：覆盖 child 登录、学习页勾选、进入写字页、从学习页发起默写 |

## 本轮任务执行状态（2026-03-09）
| 任务 | 状态 | 实现文件 | 验证结果 |
|---|---|---|---|
| 重建 HSK 汉字数据生成链路 | 已完成 | `scripts/generate_hsk_chars_from_source.py` `scripts/generate_hsk_data.py` `data/hsk_chars_1_6.json` `data/hsk_chars_1_6.js` | 通过：`npm run data:hsk` 产出 2663 个汉字，分级为 `174/173/270/447/621/978` |
| 重建 HSK 词汇数据生成链路 | 已完成 | `scripts/generate_hsk_words_from_source.py` `scripts/generate_hsk_data.py` `data/hsk_words_1_6.json` `data/hsk_words_1_6.js` | 通过：`npm run data:hsk` 产出 4287 个多字词，单字词为 0 |
| 学习页“全部学习项列表”增加独立 HSK 筛选 | 已完成 | `index.html` `app.js` `styles.css` | 通过：静态核对已接入 `learn-list-level-filter`，筛选逻辑已并入 `renderLearnCharList()` |
| 学习页“全部学习项列表”改为两行居中布局 | 已完成 | `index.html` `styles.css` | 通过：标题独立第一行居中，筛选项第二行居中 |
| 管理员学习项提示词覆盖链路文档化 | 已完成 | `docs/PRD.md` `docs/API.md` | 通过：已补充 `learning-item-override` 接口、`lexiconOverrides` 与提示词来源说明 |
| 面向客户 README 与使用说明补充 | 已完成 | `README.md` | 通过：已新增客户视角使用说明文档 |

## 本轮任务执行状态（2026-03-03）
| 任务 | 状态 | 实现文件 | 验证结果 |
|---|---|---|---|
| 抽离默写状态机模块 | 已完成 | `review-state.js` | 通过：`node tests/e2e/review-state-machine.spec.js` |
| 统一按钮渲染单入口 | 已完成 | `app.js` | 通过：状态切换时按钮可见性由 `renderReviewButtons()` 统一控制 |
| 接入“本轮结算卡” | 已完成 | `index.html` `app.js` `styles.css` | 通过：结束态显示正确率/耗时/建议 |
| 新增状态机边界用例 | 已完成 | `tests/e2e/review-state-machine.spec.js` | 通过：覆盖空态、中间题、最后一题、预览态 |
| 增加每周指标追踪表 | 已完成 | `docs/PROGRESS.md` | 通过：已建立周 KPI 模板 |

## 每周 KPI 追踪表
| 周期（周一） | 默写完成率 | 单题误操作率 | 7日正确率变化 | 错题回流再错率 | D1 留存 | D7 留存 | 连续打卡中位天数 | 备注 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 2026-03-02 | 待采集 | 待采集 | 待采集 | 待采集 | 待采集 | 待采集 | 待采集 | 建立基线 |

## 验证命令记录
```bash
node --check app.js
node --check server.js
node --check tests/e2e/frontend-smoke.spec.js
npm run data:hsk
node --check app.js
node tests/e2e/review-state-machine.spec.js
npm run test:e2e
```

<p align="center">
  <img src="docs/assets/readme-hero.svg" width="100%" alt="知易 · 观象——以象入易，以问观心" />
</p>

<p align="center">
  <strong>看见变化，理解自己</strong><br />
  <sub>一款移动优先的《易经》视觉学习与反思 PWA</sub>
</p>

<p align="center">
  <code>Next.js 16</code> · <code>TypeScript</code> · <code>Tailwind CSS</code> ·
  <code>Vitest</code> · <code>PWA</code> · <code>Local-first</code>
</p>

---

> [!NOTE]
> **知易是一间观察变化的安静书房，而不是提供确定答案的算命摊。** 这里的卦象
> 用来帮助人看见结构、时机与关系，最终回到一个可以实践的小行动。

## 从卦象，到行动

知易把每次阅读组织为一条清楚的路径：

```text
象 · 看见结构  →  辞 · 阅读文本  →  理 · 理解变化
                                            ↓
行 · 完成小行动  ←  问 · 回到自己  ←  用 · 联系处境
```

| 学易 | 观变 | 问心 | 知行 |
| --- | --- | --- | --- |
| 从阴阳、八卦到六十四卦 | 看见变爻与相关卦结构 | 用非确定性语言整理处境 | 带走一个具体的小行动 |

## 你可以在这里

- **循序学易**：通过七段式学习流程理解阴阳、八卦、爻位、变爻与卦象关系。
- **视觉观卦**：触碰六爻查看位置内容，并在八种自然意象组合出的动态水墨背景中观察卦象。
- **提出问题**：手动构建或本地随机起卦，查看本卦、动爻与变卦。
- **结构化反思**：依次阅读「象、辞、理、用、问、行」，避免把解释当成命运结论。
- **浏览六十四卦**：按名称、拼音或上下卦筛选，并查看错卦、综卦与互卦。
- **离线使用**：通过 manifest、service worker 与离线页支持基础 PWA 体验。

## 当前项目快照

| 项目 | 状态 |
| --- | --- |
| 八卦结构数据 | 8 / 8 |
| 六十四卦结构数据 | 64 / 64 |
| 基础反思内容 | 64 / 64 |
| 原创爻位观察 | 64 / 64 |
| 已收录经典原文草稿 | 乾、坤、屯 |
| 自动化测试 | 19 项 |
| 静态页面构建 | 73 页 |
| 服务端用户数据 | 无 |

当前路线：校订六十四卦原创内容，并在来源核验后逐步扩充经典原文。详见
[实施进度](docs/implementation-progress.md)与[路线图](docs/roadmap.md)。

## 设计气质

> 清冷纸色、克制墨色、充足留白。朱砂只属于变化中的爻。

界面以卦象为视觉中心，使用中性象牙纸、墨黑与蓝灰层级，以及由天、泽、火、
雷、风、水、山、地组合出的平静水墨运动。它应当像一间可以慢下来观察的
书房，而不是堆满符号的古风陈列或制造神秘感的占卜界面。

## 本地开始

环境要求：Node 20.19 或更新版本，以及 `package.json` 中 `packageManager`
声明的 npm 版本。

```bash
git clone git@github.com:NoPuzzle/zhiyi.git
cd zhiyi
npm ci
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

常用命令：

```bash
npm run dev      # 本地开发
npm run lint     # 代码检查
npm test         # 自动化测试
npm run build    # 生产构建
```

> [!WARNING]
> 不要运行 `npm audit fix --force`。项目已升级到 Next.js 16.2.12；当前审计仍会
> 通过 Next.js 内置的 `postcss` 与可选 `sharp` 报告传递性问题。不要接受审计
> 建议的破坏性降级，等待上游提供兼容更新后再单独审核。

## 免费公网部署

项目已配置 GitHub Actions，在 `main` 更新后自动生成静态站点并部署到：

```text
https://nopuzzle.github.io/zhiyi/
```

第一次使用需要在仓库 **Settings → Pages** 中把 Source 设为 **GitHub Actions**。
GitHub Free 要求 Pages 源仓库为公开仓库。完整发布与排错步骤见
[GitHub Pages 部署说明](docs/deployment.md)。

## 路由

| 路由 | 用途 |
| --- | --- |
| `/` | 产品入口 |
| `/learn` | 七段式视觉学习 |
| `/ask` | 提问、起卦与结构化反思 |
| `/hexagrams` | 六十四卦浏览、搜索与筛选 |
| `/hexagrams/[id]` | 单卦详情与相关卦结构 |
| `/offline` | 离线回退页 |

## 产品边界

- 不预测命运，不承诺结果，不制造依赖。
- 解释使用「这提示……」「一种可能的理解是……」等开放措辞。
- 「行」必须是小而具体的行动，不能只是另一个反思问题。
- 医疗、法律、财务与心理健康问题必须提示寻求合格专业支持。
- V0.1 只使用本地静态数据，不引入数据库、登录、支付或外部 AI API。
- 不复制现代版权译文、竞品解释或竞品界面文案。

## 跨用户与 Codex 协作

本项目会由不同电脑、GitHub 用户和 Codex 任务共同推进。开始修改前必须阅读：

1. [AGENTS.md](AGENTS.md)：产品、内容、安全与工程规则。
2. [CONTRIBUTING.md](CONTRIBUTING.md)：分支、脏工作区、验证和标准交接协议。
3. [实施进度](docs/implementation-progress.md)：当前基线、已知问题与下一步。

最短预检：

```bash
git status --short --branch
git branch --show-current
git config --get user.name
git config --get user.email
git fetch --prune origin
```

不知道未提交修改属于谁时，停止操作；不要擅自暂存、还原、覆盖或切换分支。

## 文档地图

- [产品说明](docs/product-brief.md)
- [设计系统](docs/design-system.md)
- [数据模式](docs/data-schema.md)
- [路线图](docs/roadmap.md)
- [实施进度](docs/implementation-progress.md)
- [GitHub Pages 部署说明](docs/deployment.md)
- [跨用户协作协议](CONTRIBUTING.md)
- [Mac mini Codex 交接提示](docs/handoff-prompt.md)

---

<p align="center">
  <strong>知易 · 观象</strong><br />
  <sub>以象入易，以问观心</sub>
</p>

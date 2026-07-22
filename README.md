# 知易 / Zhiyi

知易是一款移动优先的《易经》视觉学习与反思 PWA。它通过阴阳、八卦、
六十四卦、变爻和相关卦结构帮助用户观察变化，并把理解落实为一个小而具体的
行动。

知易不是确定性的算命工具，不预测命运，也不保证结果。

## 协作前必读

本项目会由不同电脑、不同用户和不同 Codex 任务通过 GitHub 协作。任何人或
Codex 在修改仓库前，都必须先阅读：

1. [AGENTS.md](AGENTS.md)：产品边界、内容原则和工程规则。
2. [CONTRIBUTING.md](CONTRIBUTING.md)：跨用户、跨设备的 Git 协作协议。
3. [docs/implementation-progress.md](docs/implementation-progress.md)：当前状态与下一步。

不要在不清楚未提交修改归属时执行拉取、切换分支、暂存、还原或覆盖操作。

## 每次任务的最短启动流程

```bash
git status --short --branch
git branch --show-current
git remote -v
git config --get user.name
git config --get user.email
git fetch --prune origin
```

确认工作区干净后，更新 `main` 并为任务建立独立分支：

```bash
git switch main
git pull --ff-only
git switch -c codex/<short-task-name>
```

若工作区不干净，先按照 [CONTRIBUTING.md](CONTRIBUTING.md) 判断修改归属，不要
直接继续同步。

## 本地开发

使用 Node 20.19 或更新版本，以及 `package.json` 中 `packageManager` 声明的 npm
版本。

```bash
npm ci
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

任务完成前运行：

```bash
git diff --check
npm run lint
npm test
npm run build
```

不要运行 `npm audit fix --force`。

## 主要文档

- [产品说明](docs/product-brief.md)
- [设计系统](docs/design-system.md)
- [数据模式](docs/data-schema.md)
- [路线图](docs/roadmap.md)
- [实施进度](docs/implementation-progress.md)
- [Mac mini Codex 交接提示](docs/handoff-prompt.md)

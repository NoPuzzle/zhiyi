# 知易跨用户与 Codex 协作协议

本协议适用于所有电脑、GitHub 用户、人工贡献者和 Codex 任务。GitHub 远端仓库
是共享工作的唯一交接来源；本地未提交修改不视为已经交接。

## 核心规则

1. 继续现有仓库，不重新脚手架或建立替代项目。
2. 默认一个任务一个分支，一个分支在同一时间只有一位负责人。
3. 默认不直接在 `main` 上实现新任务，也不强制推送或改写共享历史。
4. 不处理来源不明的未提交修改，不擅自暂存、还原或覆盖他人的工作。
5. 小步提交；每次交接必须包含分支、提交、验证结果和下一步。
6. 不提交私钥、访问令牌、真实 API 密钥或其他敏感信息。

## 一、新电脑或新用户的一次性设置

克隆仓库后，为当前仓库设置准确的 Git 身份：

```bash
git config --local user.name "Your Name"
git config --local user.email "your-email@example.com"
git config --get user.name
git config --get user.email
```

每位 GitHub 用户和每台电脑应使用自己的 SSH 密钥。验证 GitHub 身份：

```bash
ssh -T git@github.com
```

GitHub 成功认证时会说明已认证但不提供 shell；该命令返回非零状态属于正常
行为。macOS 已登记公钥但私钥尚未载入时，可运行：

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

每位用户应使用自己的 GitHub 账户，不共享私钥。需要直接推送时，确认该账户有
仓库写入权限；没有写入权限时使用个人 fork 和 pull request。

使用 Node 20.19 或更新版本，以及 `package.json` 的 `packageManager` 字段声明的
npm 版本。

## 二、每次任务开始前

先阅读：

1. `AGENTS.md`
2. `CONTRIBUTING.md`
3. `docs/product-brief.md`
4. `docs/design-system.md`
5. `docs/data-schema.md`
6. `docs/roadmap.md`
7. `docs/implementation-progress.md`

然后执行只读预检：

```bash
git status --short --branch
git branch --show-current
git remote -v
git config --get user.name
git config --get user.email
git log -1 --oneline --decorate
git fetch --prune origin
```

开始编辑前必须报告：当前分支、HEAD、工作区是否干净、Git 身份、远端同步
状态、Node/npm 版本和基线检查结果。

### 工作区干净时

从最新 `main` 建立任务分支：

```bash
git switch main
git pull --ff-only
git switch -c codex/<short-task-name>
```

人工贡献者可使用 `user/<name>/<short-task-name>`。分支名称使用简短的小写英文和
连字符。

### 工作区不干净时

先执行：

```bash
git status --short
git diff --stat
```

- 若修改属于当前任务，继续原任务并先说明现状。
- 若修改已完成，应先审核、验证、提交并推送，再开始新任务。
- 若修改来源不明，立即停止并向负责人确认。
- 不得擅自 `git stash`、`git reset --hard`、`git checkout --`、删除文件或切换
  分支来绕过问题。

### 继续远端已有分支时

```bash
git fetch --prune origin
git switch --track origin/<branch-name>
```

若本地已经存在该分支，则使用：

```bash
git switch <branch-name>
git pull --ff-only
```

## 三、建立干净基线

```bash
node -v
npm -v
npm ci
npm run lint
npm test
npm run build
```

若基线失败，先报告失败与当前仓库状态。不要把已有失败误认为本次任务造成，也
不要运行 `npm audit fix --force`。

## 四、任务执行规则

- 遵守 `AGENTS.md` 的产品、内容、安全和工程边界。
- 保留无关修改，只编辑完成当前任务所需的文件。
- 使用小而可审核的改动；行为或项目状态变化时同步文档。
- 不在 UI 组件中硬编码卦象变换逻辑。
- V0.1 不引入数据库、登录、支付或外部 AI API，除非得到明确批准。
- Codex 只有在当前任务明确授权时才执行提交、推送、合并或创建 PR。

## 五、验证、提交与推送

提交前执行：

```bash
git diff --check
npm run lint
npm test
npm run build
git status --short
git diff --stat
```

只暂存本任务文件，并在提交前检查暂存差异：

```bash
git add <explicit-file-list>
git diff --cached
git commit -m "<type>: <concise summary>"
git push -u origin HEAD
```

提交类型优先使用 `feat`、`fix`、`content`、`test`、`docs`、`refactor` 或 `chore`。
共享分支一旦推送，不应 rebase 或 force-push，除非所有协作者明确同意。

## 六、标准交接格式

每次交接至少提供：

```text
分支：
提交：
远端状态：已推送 / 未推送
完成内容：
验证结果：lint / test / build
未提交修改：无 / 文件列表与归属
已知问题：
建议下一步：
```

只有同时满足以下条件，任务才可被另一台电脑或另一位用户安全接手：

- 所需修改已审核并提交。
- 提交已经推送到 GitHub。
- 交接信息包含准确分支和提交哈希。
- 工作区干净，或未提交修改的归属已经明确记录。
- `docs/implementation-progress.md` 已反映重要进展和验证结果。

## 七、接收交接

接收者先确认自己的工作区，再获取指定分支：

```bash
git status --short --branch
git fetch --prune origin
git switch <handoff-branch>
git pull --ff-only
git log -1 --oneline --decorate
```

不要凭聊天摘要猜测版本；以交接中的远端分支和提交哈希为准。功能分支优先通过
PR 审核后合入 `main`。`main` 只接受快进拉取，不进行强制推送。

## 八、冲突或异常处理

- SSH 失败：先运行 `ssh -T git@github.com` 和 `ssh-add -l`。
- 拉取失败：记录分支、HEAD、`git status` 和完整错误，不切换到破坏性命令。
- 发现他人修改：停止写入，提供 `git status --short` 与 `git diff --stat`。
- 多人需要同一文件：先划分负责人或先后顺序，不在同一分支同时编辑。
- 需要改写共享历史、删除数据或覆盖文件时，必须先得到明确批准。

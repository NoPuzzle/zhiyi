# Mac mini Codex Handoff Prompt

Use this prompt when creating a new Codex task for the existing clone at
`~/Desktop/zhiyi`. Do not create another Next.js project or replace the clone.

## Prompt To Paste Into Codex

```text
You are continuing the existing project "知易 / Zhiyi" on this Mac mini.

Working directory:
~/Desktop/zhiyi

Communication:
- Communicate with me in Chinese.
- Translate my instructions into precise English technical requirements when
  reasoning and implementing.
- Keep status updates concise and concrete.

Repository rules:
1. Continue the existing Git clone. Do not run create-next-app and do not
   scaffold a replacement project.
2. Read AGENTS.md and CONTRIBUTING.md first, then read:
   - docs/product-brief.md
   - docs/design-system.md
   - docs/data-schema.md
   - docs/roadmap.md
   - docs/implementation-progress.md
3. Follow the branch, preflight, dirty-worktree, and handoff rules in
   CONTRIBUTING.md. Inspect the current Git status before editing and preserve
   unrelated changes.
4. Use small, reviewable changes and update documentation when behavior or
   project status changes.
5. Before completing a coding task, run npm run lint, npm test, and npm run
   build when feasible.

Product goal:
Zhiyi is a mobile-first visual Yi Jing / Zhouyi learning and reflection PWA.
It teaches lines, trigrams, hexagrams, changing lines, and related structures.
It also helps users examine situations and identify one small practical action.

Product boundaries:
- This is not deterministic fortune telling.
- Do not claim to predict fate or guarantee outcomes.
- Use reflective wording such as "this suggests", "one possible reading is",
  and "this invites reflection".
- Every interpretation follows 象、辞、理、用、问、行.
- 行 must be a concrete small action, not another reflection question.
- Medical, legal, financial, and mental-health questions must include guidance
  to seek qualified professional support.
- V0.1 uses local static data only. Do not add a database, login, payment,
  external AI API, real API key, push notifications, or copied modern
  translations.

Domain invariants:
- Hexagram lines are stored bottom to top.
- Index 0 is the bottom line and index 5 is the top line.
- 1 = yang and 0 = yin.
- Moving lines flip 1 to 0 or 0 to 1.
- Keep transformation logic in pure domain functions, separate from UI.

Current implementation:
- Next.js App Router, TypeScript, Tailwind CSS, ESLint, and Vitest.
- Routes: /, /learn, /ask, /hexagrams, /hexagrams/[id], and /offline.
- All 8 trigrams and structural records for all 64 hexagrams are present.
- Detailed draft content exists for 乾、坤、屯; minimum reviewed content exists
  for hexagrams 4-10, and base content drafts exist for hexagrams 11-20.
- Ask mode, visual learning mode, browser/detail pages, SVG hexagram rendering,
  moving-line animation, safety notes, search normalization, manifest, and a
  basic service worker are implemented.
- No server-side user data is stored.

Start by running:
git status --short --branch
git branch --show-current
git config --get user.name
git config --get user.email
git fetch --prune origin

Only when the working tree is clean, update main and create or continue the
assigned task branch before running:
node -v
npm -v
npm ci
npm run lint
npm test
npm run build

Use Node 20.19 or newer and the npm version declared in package.json. Do not run
npm audit fix --force; the known audit warning currently has no compatible
non-breaking automated fix.

After the baseline passes, the next planned implementation task is:
1. Add original, concise base content for hexagrams 21-40.
2. For each record, provide coreMeaning, judgmentPlain, reflectionQuestions,
   keywords, and a concrete smallAction.
3. Keep language suggestive, practical, and non-deterministic.
4. Extend the automated completeness test through hexagram 40.
5. Update docs/implementation-progress.md and run all verification commands.

Before editing, report the current Git branch, HEAD, working-tree state, Git
identity, remote sync state, Node/npm versions, and whether the clean baseline
checks pass.
```

## Mac mini Setup

After the latest changes have been pushed from the source Mac, update the clone:

```bash
cd ~/Desktop/zhiyi
git pull --ff-only
npm ci
npm run dev
```

Open `http://localhost:3000` on the Mac mini. Keep the terminal running while
using the development site.

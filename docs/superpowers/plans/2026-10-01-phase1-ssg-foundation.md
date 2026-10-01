# 阶段一（地基）：视图路由化 + SSG 预渲染管线 + 多域名 301 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 Home 的 10 个视图提升为真实路由，用 `renderToString` 构建时预渲染全部页面（仅中文），并在 Worker 层完成 mobi/one → global 301。

**Architecture:** 视图↔路径映射收敛到 `src/view-routes.ts`；Home 从 `useState` 驱动改为 URL 驱动；新增 `src/entry-server.tsx`（`StaticRouter` + `renderToString`）和 `src/entry-prerender.ts`（Node 侧遍历路由写静态 HTML），通过 `vite build --ssr` 打包后在 `npm run build` 尾部执行；Worker 改为「先试目录 index.html，再回退 SPA 壳」并加 301。

**Tech Stack:** React 19 + react-router-dom v7 + Vite 7（SSR build）+ Vitest 5 + Cloudflare Workers。

**Spec:** `docs/superpowers/specs/2026-10-01-globalization-design.md`（本计划实现其中阶段一：路由改造、预渲染管线、多域名 301）

## Global Constraints

- TypeScript strict；`verbatimModuleSyntax`：导入类型必须 `import type { ... }`
- `noUnusedLocals` + `noUnusedParameters`：不留未使用变量
- 组件用命名导出（named export）
- UI 文本保持简体中文，本阶段不做 i18n
- 测试：根 `npm test`（Vitest workspace：`src/**` 用 happy-dom，`scripts/**` 用 node）
- 提交信息遵循仓库现有 conventional 风格（如 `feat(extract-data): ...`），每个 Task 一个 commit
- 每个 Task 完成后 `npm test` 与 `npm run lint` 必须通过
- 本阶段**不改**数据结构、不动 `src/data/**` 内容、不接入 i18n/SEO meta/AdSense

---

### Task 1: 视图↔路径映射模块 `src/view-routes.ts`

**Files:**
- Create: `src/view-routes.ts`
- Test: `src/view-routes.test.ts`

**Interfaces:**
- Consumes: `ViewType` from `src/components/Header/types.ts`（已存在，11 个视图字面量联合类型）
- Produces（后续 Task 依赖的精确签名）:
  - `VIEW_PATHS: Record<Exclude<ViewType, 'knowledge'>, `/${string}`>`
  - `pathForView(view: ViewType): string` — `'knowledge'` → `'/'`，其余 → `VIEW_PATHS[view]`
  - `viewFromPath(pathname: string): ViewType | null` — `'/'` → `'knowledge'`，未知路径 → `null`
  - `isViewName(value: string): value is ViewType`

- [ ] **Step 1: Write the failing test**

`src/view-routes.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { VIEW_PATHS, isViewName, pathForView, viewFromPath } from './view-routes';

describe('view-routes', () => {
  it('maps every non-knowledge view to a root-level path', () => {
    expect(VIEW_PATHS).toEqual({
      tutorial: '/tutorial',
      cheatsheet: '/cheatsheet',
      'mental-math': '/mental-math',
      formula: '/formula',
      mastery: '/mastery',
      practice: '/practice',
      notes: '/notes',
      zizhi: '/zizhi',
      shiji: '/shiji',
      'ai-chat': '/ai-chat',
    });
  });

  it('pathForView maps knowledge to root and others to their path', () => {
    expect(pathForView('knowledge')).toBe('/');
    expect(pathForView('practice')).toBe('/practice');
    expect(pathForView('ai-chat')).toBe('/ai-chat');
  });

  it('viewFromPath parses known paths and rejects unknown ones', () => {
    expect(viewFromPath('/')).toBe('knowledge');
    expect(viewFromPath('/mental-math')).toBe('mental-math');
    expect(viewFromPath('/knowledge/p-math-1')).toBeNull();
    expect(viewFromPath('/nope')).toBeNull();
  });

  it('isViewName narrows valid view names', () => {
    expect(isViewName('knowledge')).toBe(true);
    expect(isViewName('zizhi')).toBe(true);
    expect(isViewName('bogus')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/view-routes.test.ts`
Expected: FAIL — `Cannot find module './view-routes'`

- [ ] **Step 3: Write minimal implementation**

`src/view-routes.ts`：

```ts
import type { ViewType } from './components/Header/types';

export const VIEW_PATHS: Record<Exclude<ViewType, 'knowledge'>, `/${string}`> = {
  tutorial: '/tutorial',
  cheatsheet: '/cheatsheet',
  'mental-math': '/mental-math',
  formula: '/formula',
  mastery: '/mastery',
  practice: '/practice',
  notes: '/notes',
  zizhi: '/zizhi',
  shiji: '/shiji',
  'ai-chat': '/ai-chat',
};

export function pathForView(view: ViewType): string {
  return view === 'knowledge' ? '/' : VIEW_PATHS[view];
}

export function viewFromPath(pathname: string): ViewType | null {
  if (pathname === '/') return 'knowledge';
  const entry = Object.entries(VIEW_PATHS).find(([, path]) => path === pathname);
  return entry ? (entry[0] as ViewType) : null;
}

export function isViewName(value: string): value is ViewType {
  return value === 'knowledge' || value in VIEW_PATHS;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/view-routes.test.ts`
Expected: PASS（4 tests）

- [ ] **Step 5: Commit**

```bash
git add src/view-routes.ts src/view-routes.test.ts
git commit -m "feat(routes): view <-> path mapping module"
```

---

### Task 2: Home/App 改为 URL 驱动（视图路径化 + 旧 query 重定向）

**Files:**
- Modify: `src/components/Home.tsx`（activeView 从 useState 改为 useLocation 派生；onViewChange 改为 navigate；旧 `?view=` 重定向）
- Modify: `src/App.tsx`（注册 10 个视图路由）
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: Task 1 的 `VIEW_PATHS`、`pathForView`、`viewFromPath`、`isViewName`；`Header` 现有 props `{ activeView: ViewType; onViewChange: (view: ViewType) => void }`（**不变**，NavMenu/MobileNav 零改动）
- Produces: 路由表 `/` + 10 个视图路径 + `/knowledge/:id`；`/?view=<name>&其他参数` 客户端 301 到 `/<name>?其他参数`

- [ ] **Step 1: Write the failing test**

`src/App.test.tsx`（用 `LocationProbe` 断言重定向后的 location，避免依赖视图内部文案）：

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

function renderApp(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe('App routes', () => {
  it('serves the knowledge view at /', () => {
    renderApp('/');
    expect(screen.getByTestId('location').textContent).toBe('/');
  });

  it('serves views at their own paths', () => {
    renderApp('/mental-math');
    expect(screen.getByTestId('location').textContent).toBe('/mental-math');
  });

  it('redirects legacy ?view=practice&kp=p-math-1 to /practice?kp=p-math-1', async () => {
    renderApp('/?view=practice&kp=p-math-1');
    expect(await screen.findByTestId('location')).toHaveTextContent('/practice?kp=p-math-1');
  });

  it('ignores unknown legacy view params', () => {
    renderApp('/?view=bogus');
    expect(screen.getByTestId('location').textContent).toBe('/?view=bogus');
  });
});
```

注意：若 `@testing-library/react` 不在 devDependencies，先 `npm install -D @testing-library/react @testing-library/dom`（happy-dom 环境下 `toHaveTextContent` 需要 `@testing-library/jest-dom`；如无则改用 `expect((await screen.findByTestId('location')).textContent).toBe('/practice?kp=p-math-1')`，优先用此无 jest-dom 写法）。

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — `/mental-math` 无匹配路由；`?view=practice` 不重定向

- [ ] **Step 3: Rewrite Home to be URL-driven**

`src/components/Home.tsx` 的改动（其余 JSX 不变）：

```tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
// ... 其余 import 不变；删除本地 ViewType 定义
import type { ViewType } from './Header/types';
import { isViewName, pathForView, viewFromPath } from '../view-routes';
// KNOWLEDGE_DATA / GradeLevel / Subject import 不变

export function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedGradeId, setSelectedGradeId] = useState<GradeLevel>('primary');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const activeView: ViewType = viewFromPath(location.pathname) ?? 'knowledge';

    // 旧链接 ?view=xxx 兼容：重定向到 /<view>，保留其余 query（如 kp）
    useEffect(() => {
        if (location.pathname !== '/') return;
        const view = searchParams.get('view');
        if (view && isViewName(view) && view !== 'knowledge') {
            const rest = new URLSearchParams(searchParams);
            rest.delete('view');
            const search = rest.toString();
            navigate({ pathname: pathForView(view), search: search ? `?${search}` : '' }, { replace: true });
        }
    }, [location.pathname, searchParams, navigate]);

    const currentGradeData = KNOWLEDGE_DATA.find(g => g.id === selectedGradeId)!;

    const handleGradeChange = (grade: GradeLevel) => {
        setSelectedGradeId(grade);
        setSelectedSubject(null);
    };

    return (
        // ... JSX 完全不变，仅 Header 行改为：
        // <Header activeView={activeView} onViewChange={(view) => navigate(pathForView(view))} />
    );
}
```

`src/App.tsx` 全量替换为：

```tsx
import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { KnowledgeDetail } from './components/KnowledgeDetail';
import { VIEW_PATHS } from './view-routes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {Object.values(VIEW_PATHS).map((path) => (
        <Route key={path} path={path} element={<Home />} />
      ))}
      <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
    </Routes>
  );
}

export default App;
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/App.test.tsx src/view-routes.test.ts`
Expected: PASS；随后 `npm test` 全量跑，修复因 Home 签名/行为变化挂掉的既有测试（预期少数 snapshot/查询参数相关用例）

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/components/Home.tsx
git commit -m "feat(routes): promote Home views to real URL paths"
```

---

### Task 3: SSR 环境守卫 `src/utils/storage.ts`

renderToString 在 Node 里执行，`localStorage`/`window` 不存在，所有 render 期直接读 localStorage 的模块会炸。统一收口到安全包装。

**Files:**
- Create: `src/utils/storage.ts`
- Test: `src/utils/storage.test.ts`
- Modify: `src/utils/jwt.ts`（localStorage.* → storage 助手）
- Modify: `src/hooks/useErrorBook.ts`、`src/hooks/useLearningProgress.ts`、`src/hooks/useTopicMastery.ts`、`src/data/mastery/progress.ts`、`src/services/chat-history.ts`、`src/services/ai/storage.ts`、`src/components/NotesView.tsx`（同上机械替换）

**Interfaces:**
- Produces:
  - `storageGet(key: string): string | null` — 无 window 或抛异常（隐私模式）时返回 `null`
  - `storageSet(key: string, value: string): void` — 失败静默
  - `storageRemove(key: string): void` — 失败静默

- [ ] **Step 1: Write the failing test**

`src/utils/storage.test.ts`：

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { storageGet, storageRemove, storageSet } from './storage';

describe('storage helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('round-trips values when localStorage is available', () => {
    storageSet('k', 'v');
    expect(storageGet('k')).toBe('v');
    storageRemove('k');
    expect(storageGet('k')).toBeNull();
  });

  it('returns null and never throws when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(storageGet('k')).toBeNull();
    expect(() => storageSet('k', 'v')).not.toThrow();
    expect(() => storageRemove('k')).not.toThrow();
  });

  it('returns null when localStorage throws (privacy mode)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    expect(storageGet('k')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/storage.test.ts`
Expected: FAIL — `Cannot find module './storage'`

- [ ] **Step 3: Implement storage helpers**

`src/utils/storage.ts`：

```ts
// renderToString（Node）与隐私模式下 localStorage 不可用/会抛 SecurityError，
// 所有 localStorage 访问必须经此收口，保证 SSR 渲染不炸。
function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function storageGet(key: string): string | null {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function storageSet(key: string, value: string): void {
  try {
    getStorage()?.setItem(key, value);
  } catch {
    // 静默：SSR / 隐私模式下写入失败不影响渲染
  }
}

export function storageRemove(key: string): void {
  try {
    getStorage()?.removeItem(key);
  } catch {
    // 同上
  }
}
```

- [ ] **Step 4: 机械替换全部 localStorage 直读点**

对下列文件把 `localStorage.getItem(X)` / `localStorage.setItem(X, Y)` / `localStorage.removeItem(X)` 替换为 `storageGet(X)` / `storageSet(X, Y)` / `storageRemove(X)`，并加 `import { storageGet, storageSet, storageRemove } from '<相对路径>/utils/storage';`（用到哪个导哪个）：

- `src/utils/jwt.ts`
- `src/hooks/useErrorBook.ts`
- `src/hooks/useLearningProgress.ts`
- `src/hooks/useTopicMastery.ts`
- `src/data/mastery/progress.ts`
- `src/services/chat-history.ts`
- `src/services/ai/storage.ts`
- `src/components/NotesView.tsx`

替换完成后验证无遗漏：

Run: `grep -rn "localStorage" src --include="*.ts" --include="*.tsx" | grep -v ".test." | grep -v "utils/storage.ts"`
Expected: 无输出（或仅剩注释）

- [ ] **Step 5: Run full test suite**

Run: `npx vitest run src/utils/storage.test.ts` 通过；然后 `npm test`
Expected: 全绿（行为等价替换，既有测试不应挂；如挂说明替换有误，修复之）

- [ ] **Step 6: Commit**

```bash
git add src/utils/storage.ts src/utils/storage.test.ts src/utils/jwt.ts src/hooks/ src/data/mastery/progress.ts src/services/ src/components/NotesView.tsx
git commit -m "feat(ssr): safe localStorage wrapper for server rendering"
```

---

### Task 4: SSR 入口 `src/entry-server.tsx` + hydrate 客户端入口

**Files:**
- Create: `src/entry-server.tsx`
- Test: `src/entry-server.test.tsx`
- Modify: `src/main.tsx`（createRoot → 有预渲染内容时 hydrateRoot）

**Interfaces:**
- Consumes: `App`（Task 2）、`AuthProvider`（`src/context/AuthContext.tsx`）、`KNOWLEDGE_DATA`（`src/data/knowledge.ts`）
- Produces:
  - `render(url: string): string` — 返回 `<div id="root">` 内的应用 HTML
  - 客户端入口规则：`#root` 有子节点 → `hydrateRoot`，否则 `createRoot().render()`

- [ ] **Step 1: Write the failing test**

`src/entry-server.test.tsx`（happy-dom 下 `renderToString` 可用；断言从 `KNOWLEDGE_DATA` 动态取第一个知识点，避免硬编码文案）：

```tsx
import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from './data/knowledge';
import { render } from './entry-server';

describe('entry-server render', () => {
  it('renders the home page with the site footer brand', () => {
    const html = render('/');
    expect(html).toContain('拾艺院');
  });

  it('renders a knowledge detail page with the point title', () => {
    const first = KNOWLEDGE_DATA[0].subjects[0].knowledgePoints[0];
    const html = render(`/knowledge/${first.id}`);
    expect(html).toContain(first.title);
  });

  it('renders a view route without throwing', () => {
    expect(() => render('/practice')).not.toThrow();
    expect(render('/practice').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/entry-server.test.tsx`
Expected: FAIL — `Cannot find module './entry-server'`

- [ ] **Step 3: Implement entry-server**

`src/entry-server.tsx`（**不要** import `./index.css`——CSS 由客户端 build 处理）：

```tsx
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { AuthProvider } from './context/AuthContext';

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StaticRouter>,
  );
}
```

- [ ] **Step 4: main.tsx 改为 hydrate 模式**

`src/main.tsx` 全量替换为：

```tsx
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)

if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/entry-server.test.tsx`
Expected: PASS（3 tests）。若知识点详情 render 抛 localStorage 相关错误，说明 Task 3 有遗漏文件，回去补齐。然后 `npm test` 全量。

- [ ] **Step 6: Commit**

```bash
git add src/entry-server.tsx src/entry-server.test.tsx src/main.tsx
git commit -m "feat(ssr): server render entry + hydrate client entry"
```

---

### Task 5: 预渲染管线 `src/prerender/*` + build 接线

**Files:**
- Create: `src/prerender/inject.ts`（纯函数：模板注入与输出路径）
- Create: `src/prerender/routes.ts`（预渲染路由清单）
- Create: `src/entry-prerender.ts`（Node 执行入口：遍历路由写文件）
- Test: `src/prerender/inject.test.ts`、`src/prerender/routes.test.ts`
- Modify: `package.json`（`build` 脚本接 SSR build + prerender）
- Modify: `index.html`（`lang="en"` → `lang="zh-CN"`）
- Modify: `.gitignore`（加 `dist-ssr/`）

**Interfaces:**
- Consumes: Task 4 `render(url)`；Task 1 `VIEW_PATHS`；`KNOWLEDGE_DATA`
- Produces:
  - `injectAppHtml(template: string, appHtml: string): string` — 替换 `<div id="root"></div>` 为带内容的 div
  - `outputFileFor(route: string): string` — `'/'` → `'index.html'`；`'/tutorial'` → `'tutorial/index.html'`
  - `PRERENDER_PATHS: string[]` — `'/'` + 10 视图路径 + 全部 `/knowledge/<id>`（276 条，去重）
  - build 后 `dist/` 下每个路由一份静态 HTML

- [ ] **Step 1: Write failing tests**

`src/prerender/inject.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { injectAppHtml, outputFileFor } from './inject';

describe('injectAppHtml', () => {
  it('replaces the root div with rendered app html', () => {
    const template = '<html><body><div id="root"></div><script src="/src/main.tsx"></script></body></html>';
    const result = injectAppHtml(template, '<h1>你好</h1>');
    expect(result).toBe('<html><body><div id="root"><h1>你好</h1></div><script src="/src/main.tsx"></script></body></html>');
  });

  it('throws when the root placeholder is missing', () => {
    expect(() => injectAppHtml('<html></html>', '<h1>x</h1>')).toThrow('root placeholder');
  });
});

describe('outputFileFor', () => {
  it('maps routes to directory index files', () => {
    expect(outputFileFor('/')).toBe('index.html');
    expect(outputFileFor('/tutorial')).toBe('tutorial/index.html');
    expect(outputFileFor('/knowledge/p-math-1')).toBe('knowledge/p-math-1/index.html');
  });
});
```

`src/prerender/routes.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { PRERENDER_PATHS } from './routes';

describe('PRERENDER_PATHS', () => {
  it('includes root, all view paths, and every knowledge point', () => {
    const kpCount = KNOWLEDGE_DATA.reduce(
      (sum, grade) => sum + grade.subjects.reduce((s, sub) => s + sub.knowledgePoints.length, 0),
      0,
    );
    expect(PRERENDER_PATHS).toContain('/');
    expect(PRERENDER_PATHS).toContain('/tutorial');
    expect(PRERENDER_PATHS).toContain('/ai-chat');
    expect(PRERENDER_PATHS.filter((p) => p.startsWith('/knowledge/'))).toHaveLength(kpCount);
    expect(PRERENDER_PATHS).toHaveLength(1 + 10 + kpCount);
  });

  it('has no duplicates', () => {
    expect(new Set(PRERENDER_PATHS).size).toBe(PRERENDER_PATHS.length);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/prerender/`
Expected: FAIL — modules not found

- [ ] **Step 3: Implement**

`src/prerender/inject.ts`：

```ts
export function injectAppHtml(template: string, appHtml: string): string {
  const placeholder = '<div id="root"></div>';
  if (!template.includes(placeholder)) {
    throw new Error('root placeholder not found in template');
  }
  return template.replace(placeholder, `<div id="root">${appHtml}</div>`);
}

export function outputFileFor(route: string): string {
  const dir = route.replace(/^\/+|\/+$/g, '');
  return dir === '' ? 'index.html' : `${dir}/index.html`;
}
```

`src/prerender/routes.ts`：

```ts
import { KNOWLEDGE_DATA } from '../data/knowledge';
import { VIEW_PATHS } from '../view-routes';

export const PRERENDER_PATHS: string[] = [
  '/',
  ...Object.values(VIEW_PATHS),
  ...KNOWLEDGE_DATA.flatMap((grade) =>
    grade.subjects.flatMap((subject) =>
      subject.knowledgePoints.map((kp) => `/knowledge/${kp.id}`),
    ),
  ),
];
```

`src/entry-prerender.ts`：

```ts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { render } from './entry-server';
import { injectAppHtml, outputFileFor } from './prerender/inject';
import { PRERENDER_PATHS } from './prerender/routes';

// 由 `vite build --ssr` 打包后在 Node 下执行：vite build 已产出 dist/index.html 作模板
const distDir = join(process.cwd(), 'dist');
const template = readFileSync(join(distDir, 'index.html'), 'utf8');

let written = 0;
for (const route of PRERENDER_PATHS) {
  const html = injectAppHtml(template, render(route));
  const outFile = join(distDir, outputFileFor(route));
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  written++;
}

console.log(`prerendered ${written} pages`);
```

`index.html`：`<html lang="en">` 改为 `<html lang="zh-CN">`。

`.gitignore`：追加一行 `dist-ssr/`。

`package.json` 的 `build` 改为：

```json
"build": "tsc -b && vite build && vite build --ssr src/entry-prerender.ts --outDir dist-ssr && node dist-ssr/entry-prerender.js",
```

- [ ] **Step 4: Run unit tests**

Run: `npx vitest run src/prerender/`
Expected: PASS

- [ ] **Step 5: 构建验证（端到端）**

Run: `npm run build`
Expected: 尾部输出 `prerendered 287 pages`（1 + 10 + 276；数量以 `PRERENDER_PATHS` 实际为准）

随后验证产物：

```bash
test -f dist/tutorial/index.html && echo OK-view
grep -c "拾艺院" dist/index.html
first_id=$(node -e "import('./dist-ssr/entry-prerender.js')" 2>/dev/null; grep -o '/knowledge/[a-z0-9-]*' dist/index.html | head -1)
ls dist/knowledge/ | wc -l   # 应为 276
grep "$(ls dist/knowledge/ | head -1)" dist/knowledge/$(ls dist/knowledge/ | head -1)/index.html >/dev/null && echo OK-kp
```

Expected: `dist/tutorial/index.html` 存在且非空；`dist/knowledge/` 下 276 个目录；抽查的知识点页 HTML 包含该知识点内容（body 非空壳）。

- [ ] **Step 6: Commit**

```bash
git add src/prerender/ src/entry-prerender.ts package.json index.html .gitignore
git commit -m "feat(ssr): prerender pipeline wired into build"
```

---

### Task 6: Worker — 多域名 301 + 目录 index.html 静态服务 + 旧 view 参数 301

**Files:**
- Create: `worker/lib/redirect.ts`
- Create: `worker/lib/static-paths.ts`
- Test: `worker/lib/redirect.test.ts`、`worker/lib/static-paths.test.ts`
- Modify: `worker/index.ts`（接入 301 与新的 serveStatic）
- Modify: `vitest.config.ts`（scripts project 的 include 加 `'worker/**/*.test.ts'`）

**Interfaces:**
- Consumes: 无前置 Task 产物（纯 Worker 侧）
- Produces:
  - `hostRedirect(url: URL): string | null` — host 为 `syy.mobi` / `www.syy.mobi` / `syy.one` / `www.syy.one` 时返回改写到 `syy.global` 的完整 URL（保留路径与 query），否则 `null`
  - `legacyViewRedirect(url: URL): string | null` — `pathname === '/'` 且 `?view=` 是已知视图名（非 `knowledge`）时返回 `/<view>?其余参数`，否则 `null`
  - `assetCandidates(pathname: string): string[]` — 含 `.` 的路径原样返回单元素；否则返回 `[<path>/index.html, '/index.html']`

- [ ] **Step 1: Write failing tests**

`worker/lib/redirect.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { hostRedirect, legacyViewRedirect } from './redirect';

describe('hostRedirect', () => {
  it('redirects mobi/one apex and www to syy.global preserving path and query', () => {
    expect(hostRedirect(new URL('https://syy.mobi/tutorial?kp=1'))).toBe('https://syy.global/tutorial?kp=1');
    expect(hostRedirect(new URL('https://www.syy.one/'))).toBe('https://syy.global/');
  });

  it('leaves canonical and api hosts alone', () => {
    expect(hostRedirect(new URL('https://syy.global/'))).toBeNull();
    expect(hostRedirect(new URL('https://api.syy.mobi/api/health'))).toBeNull();
  });
});

describe('legacyViewRedirect', () => {
  it('rewrites /?view=practice&kp=p1 to /practice?kp=p1', () => {
    expect(legacyViewRedirect(new URL('https://syy.global/?view=practice&kp=p1'))).toBe('https://syy.global/practice?kp=p1');
  });

  it('rewrites knowledge view to root', () => {
    expect(legacyViewRedirect(new URL('https://syy.global/?view=knowledge'))).toBeNull();
  });

  it('ignores non-root paths and unknown views', () => {
    expect(legacyViewRedirect(new URL('https://syy.global/tutorial?view=practice'))).toBeNull();
    expect(legacyViewRedirect(new URL('https://syy.global/?view=bogus'))).toBeNull();
    expect(legacyViewRedirect(new URL('https://syy.global/'))).toBeNull();
  });
});
```

`worker/lib/static-paths.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { assetCandidates } from './static-paths';

describe('assetCandidates', () => {
  it('serves file paths as-is', () => {
    expect(assetCandidates('/assets/index-abc.js')).toEqual(['/assets/index-abc.js']);
  });

  it('tries directory index.html then the SPA shell', () => {
    expect(assetCandidates('/tutorial')).toEqual(['/tutorial/index.html', '/index.html']);
    expect(assetCandidates('/')).toEqual(['/index.html']);
    expect(assetCandidates('/knowledge/p-math-1')).toEqual(['/knowledge/p-math-1/index.html', '/index.html']);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run worker/`
Expected: FAIL — modules not found（若 vitest 没匹配到文件，先完成 Step 4 的 vitest.config.ts include 改动再重跑确认 fail 原因是模块缺失）

- [ ] **Step 3: Implement worker libs**

`worker/lib/redirect.ts`：

```ts
export const CANONICAL_HOST = 'syy.global';

const REDIRECT_HOSTS = new Set(['syy.mobi', 'www.syy.mobi', 'syy.one', 'www.syy.one']);

const KNOWN_VIEWS = new Set([
  'tutorial', 'cheatsheet', 'mental-math', 'formula', 'mastery',
  'practice', 'notes', 'zizhi', 'shiji', 'ai-chat',
]);

export function hostRedirect(url: URL): string | null {
  if (!REDIRECT_HOSTS.has(url.host)) return null;
  const target = new URL(url.toString());
  target.host = CANONICAL_HOST;
  return target.toString();
}

export function legacyViewRedirect(url: URL): string | null {
  if (url.pathname !== '/') return null;
  const view = url.searchParams.get('view');
  if (!view || !KNOWN_VIEWS.has(view)) return null;
  const rest = new URLSearchParams(url.searchParams);
  rest.delete('view');
  const qs = rest.toString();
  return `${url.origin}/${view}${qs ? `?${qs}` : ''}`;
}
```

`worker/lib/static-paths.ts`：

```ts
export function assetCandidates(pathname: string): string[] {
  if (pathname.includes('.')) return [pathname];
  const dir = pathname.replace(/\/+$/, '');
  if (dir === '') return ['/index.html'];
  return [`${dir}/index.html`, '/index.html'];
}
```

- [ ] **Step 4: vitest include worker tests**

`vitest.config.ts` 中 scripts project 的 include 改为：

```ts
include: ['scripts/**/*.{test,spec}.ts', 'worker/**/*.test.ts'],
```

Run: `npx vitest run worker/`
Expected: PASS（6 tests）

- [ ] **Step 5: 接入 worker/index.ts**

在 `fetch` 最顶部（OPTIONS 处理之前）插入：

```ts
const redirect = hostRedirect(url) ?? (request.method === 'GET' ? legacyViewRedirect(url) : null);
if (redirect) {
  return Response.redirect(redirect, 301);
}
```

`serveStatic` 全量替换为：

```ts
async function serveStatic(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  for (const candidate of assetCandidates(url.pathname)) {
    try {
      const response = await env.ASSETS.fetch(new Request(url.origin + candidate, request));
      if (response.status !== 404) return response;
    } catch {
      // 尝试下一个候选
    }
  }
  return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
}
```

文件头部 import 增加：

```ts
import { hostRedirect, legacyViewRedirect } from './lib/redirect';
import { assetCandidates } from './lib/static-paths';
```

- [ ] **Step 6: 本地验证 + 全量测试**

```bash
npm test   # 全绿（含 worker 新测试）
npx wrangler dev worker/index.ts --port 8787 &
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:8787/?view=practice
# 本地 host 是 localhost，hostRedirect 不触发；view 重定向应 301 到 /practice
curl -s http://localhost:8787/tutorial | head -c 200   # 应为预渲染 HTML（需先 npm run build）
kill %1
```

注意：`wrangler dev` 验证需要在 Task 5 的 `npm run build` 产物存在后进行。

- [ ] **Step 7: Commit**

```bash
git add worker/ vitest.config.ts
git commit -m "feat(worker): canonical host 301 + directory index serving + legacy view redirect"
```

---

### Task 7: 端到端收尾验证

**Files:** 无新增（仅验证；如发现 bug 在对应文件修复）

- [ ] **Step 1: 全量检查**

```bash
npm test
npm run lint
npm run build
```

Expected: 164+ 既有测试 + 新增测试全绿；lint 无 error；build 尾部输出 prerender 页数

- [ ] **Step 2: 本地 dev 冒烟（SPA 交互回归）**

```bash
npm run dev
# 浏览器打开 http://localhost:5173
```

人工检查：
- Header 导航点击各视图，地址栏变为 `/tutorial`、`/practice` 等真实路径，视图正常切换
- 直接刷新 `/practice` 页面不丢视图
- 访问 `/?view=practice&kp=p-math-1` 跳转到 `/practice?kp=p-math-1`
- 进入任一知识点详情页，返回列表正常
- 登录/注册弹窗、AI 配置弹窗正常打开（AuthContext 改造未破坏）

- [ ] **Step 3: wrangler dev 冒烟（预渲染 + 301）**

```bash
npx wrangler dev worker/index.ts --port 8787
curl -s http://localhost:8787/knowledge/$(ls dist/knowledge/ | head -1) | grep -c "<h1\|<h2"   # > 0：body 有真实内容
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8787/nonexistent-path   # 200（回退 SPA 壳）
```

- [ ] **Step 4: 更新 CLAUDE.md 路由表**

`CLAUDE.md` 的「## 路由」一节更新为新路由表（`/` + 10 视图路径 + `/knowledge/:id`），并注明旧 `?view=` 参数会 301。「常用命令」中 `npm run build` 的描述更新为「TypeScript 类型检查 + 生产构建 + SSG 预渲染（输出到 dist/）」。

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update routing table and build description for SSG"
```

---

## Self-Review 记录

- **Spec 覆盖**：阶段一三项（路由改造→Task 1/2；预渲染管线→Task 3/4/5；多域名 301→Task 6）。spec 中的「旧 ?view= 301」由 Task 2（客户端）+ Task 6（Worker 服务端）双保险覆盖。阶段二及以后（i18n/翻译/SEO meta/AdSense）不在本计划范围。
- **类型一致性**：`VIEW_PATHS` / `pathForView` / `viewFromPath` / `isViewName` 在 Task 1 定义，Task 2/4/5 消费一致；`storageGet/Set/Remove` 在 Task 3 定义并消费；`render(url)` 在 Task 4 定义、Task 5 消费；`hostRedirect/legacyViewRedirect/assetCandidates` 在 Task 6 定义并消费。
- **已知边界**：Worker 的 `KNOWN_VIEWS` 与前端 `VIEW_PATHS` 是两份清单（Worker 无法 import 前端 TS），Task 6 测试锁定当前值；后续加视图时需同步两处——已在 Task 7 的 CLAUDE.md 更新中注明。

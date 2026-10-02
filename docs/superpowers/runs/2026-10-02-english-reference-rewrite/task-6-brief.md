## Task 6: 路由接线

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `ENGLISH_HOME`（Task 4）、`ENGLISH_CATEGORY_ROUTE`（Task 5）、`ENGLISH_REFERENCE_ROUTE`（Task 5）；`ReferenceIndex`（Task 5）、`ReferenceCategory`（Task 5）、`ReferencePage`（Task 5）
- Produces: 无（应用级接线）

`App.tsx` 里 `ENGLISH_REFERENCE_ROUTE` 是直接从路由表读的，所以 Task 5 已经把图表页路由切到新形状并生效。本任务只补学科 hub 那一条。

- [ ] **Step 1: 加 `App.test.tsx` 的 hub 用例**

在已有的英文用例之间插入：

```tsx
  it('serves an English category hub at /en/:category', () => {
    renderApp('/en/math');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Math');
  });
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — `/en/math` 无匹配路由

- [ ] **Step 3: 改 `App.tsx`**

```tsx
import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { KnowledgeDetail } from './components/KnowledgeDetail';
import { ReferenceCategory } from './components/reference/ReferenceCategory';
import { ReferenceIndex } from './components/reference/ReferenceIndex';
import { ReferencePage } from './components/reference/ReferencePage';
import {
  ENGLISH_CATEGORY_ROUTE,
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
} from './reference-routes';
import { VIEW_PATHS } from './view-routes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {Object.values(VIEW_PATHS).map((path) => (
        <Route key={path} path={path} element={<Home />} />
      ))}
      <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
      <Route path={ENGLISH_HOME} element={<ReferenceIndex />} />
      <Route path={ENGLISH_CATEGORY_ROUTE} element={<ReferenceCategory />} />
      <Route path={ENGLISH_REFERENCE_ROUTE} element={<ReferencePage />} />
    </Routes>
  );
}

export default App;
```

- [ ] **Step 4: 跑测试确认通过**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS（7 个用例）

- [ ] **Step 5: 全量测试、lint 与构建**

Run: `npm test`
Expected: 全绿

Run: `npm run lint`
Expected: 无错误

Run: `npm run build`
Expected: 结束于 `prerendered N pages (+ robots.txt, sitemap.xml)`

Run: `ls dist/en/ && ls dist/en/math/`
Expected: 第一行有 `index.html`、`math/`、`science/`、`english/`；第二行有 `index.html` 与 `multiplication-chart/`

Run: `grep -c "en/math/multiplication-chart" dist/sitemap.xml`
Expected: ≥ 1

Run: `grep -c "en/reference" dist/sitemap.xml`
Expected: 0

- [ ] **Step 6: 确认构建产物不进 git**

Run: `git status --short`
Expected: 只有源码改动与 `.gitignore`（`dist/`、`dist-ssr/`、`.superpowers/` 均已忽略）

- [ ] **Step 7: 提交**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "$(cat <<'EOF'
feat(reference): 学科 hub 路由接线到 App

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---


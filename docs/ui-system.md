# UI 设计系统

全站 UI 的唯一事实来源有两层：**决策**在根目录 `design.md`，**实现**在 `src/styles/`。新增或修改页面前先读这两处，再按本页的施工规则做。

## 文件

| 文件 | 作用 |
| --- | --- |
| `design.md` | 锁定系统：shape / genre / theme / axes / 控件 / 表面 / 动效 / 组件清单。改系统先改这里。 |
| `src/styles/tokens.css` | `@theme` token：OKLCH 色板、字体栈、字号、间距、圆角、阴影、动效、z-index、容器宽度 |
| `src/styles/base.css` | 画布层：body 底色与字体、`:focus-visible`、`::selection`、滚动条、标题换行、`prefers-reduced-motion` |
| `src/styles/ui.css` | 组件原语（`@layer components`）：页面骨架、控件、目录行、阅读排版、表格、聊天气泡等 |
| `src/index.css` | 入口：Hallmark stamp、`@import` 顺序（tailwindcss → tokens → base → ui）、少量 keyframes |
| `src/components/icons/` | 唯一图标集（`Icon.tsx`，79 枚 SVG）+ 数据 emoji 映射（`iconFor.ts`） |

## Token 规则

- 所有色值是 **OKLCH**，按语义命名，不写 hex/rgb，也不用 Tailwind 内置调色板。
- 语义族：`accent`（品牌蓝，只做主操作/选中/焦点）、`paper`（画布）、`card`（更高一层表面）、`well`、`ink`（四级文字）、`rule` / `divider`、`success` / `error` / `warning` / `info`（各有 fill / `-ink` / `-bg`）。
- 字号、间距、圆角、阴影、缓动、时长都在 `tokens.css`；新值先进 token，再使用。
- 页面底色是 `--color-paper`；成组次要内容用 `--color-well` / `bg-paper-2`。

## 表面阶梯（最重要的约束）

```
whitespace → 1px divider → paper-2 well → card
```

- 一行内容与下一行之间用 **1px divider**，不用盒子。
- 成组的次要内容用 **paper-2 well**（无边框）。
- `card` 只给真正独立、可交互的对象；**border 与 shadow 二选一，不同时上**。
- **不要卡片套卡片**；不要给内容卡片加阴影；一页只有一种主按钮样式。

## 页面骨架

```tsx
<div className="page-shell">
  <Header activeView="…" onViewChange={…} />
  <main id="main" tabIndex={-1} className="page-main">
    <div className="container-page pt-10">
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">页面名</h1>
          <p className="page-lead">一句话说明</p>
        </div>
        {/* 右侧控件，如 .seg */}
      </div>
      {/* 内容 */}
    </div>
  </main>
  <Footer />
</div>
```

- `.container-page`：最大 1200px，gutter 24 → 40px；**页面自带 `pt-10`，`.page-head` 不再加上边距**（否则各页标题高度不齐）。
- 列表页 / 目录页：`.index-head`（标题 + 计数）+ 行（`.kp-row`、目录行）+ `.section` 分区。
- 阅读页：`.detail-layout`（正文列 + 13rem `.detail-aside` 目录），正文 `.prose-body`，上限 68ch。

## 常用原语

`page-shell` · `container-page` · `page-main` · `page-head` · `page-title` · `page-lead` · `page-controls`
`seg` / `seg-btn`（分段控件）· `btn` + `btn-primary` / `btn-secondary` / `btn-ghost` · `icon-btn` · `tap-44`
`rail` / `rail-item` / `rail-count`（学科 / 章节栏）· `browse` / `browse__rail`
`index-head` / `index-title` / `index-meta` · `kp-row` / `kp-title` / `kp-desc` / `kp-fact` / `kp-ask`
`section` / `section-head` / `section-note` · `well` · `sheet` · `divider`
`prose-body`（Markdown 正文）· `toc` · `tag` · `breadcrumb` · `empty-state` · `table-basic` · `field` / `input`
`chat-layout` / `chat-list` / `composer` · `note-form` / `note-row` · `grid-tail-span`

新组件优先复用这些名字；需要新原语时加在 `ui.css` 的 `@layer components` 里，不要在各页面重复拼一套。

## Markdown 正文

项目**没有** `@tailwindcss/typography`，`prose` 类不起作用。所有 Markdown 输出（教程讲解、AI 生成、英文图表导语）放在 `.prose-body` 里，段落间距、列表符号、表格、代码块样式由 `ui.css` 统一提供。标题里的装饰 emoji 用 `src/utils/markdown.ts` 的 `stripHeadingEmoji()` 在渲染前剥掉，图标交给 `Icon`。

## 图标与 emoji

- 只用 `src/components/icons/Icon.tsx` 一套描边图标；数据层原有 emoji 通过 `iconFor()` 转成图标名。
- **不要用 emoji 当图标**，也不要在 Markdown 标题里留装饰 emoji。
- 装饰性 SVG 必须 `aria-hidden="true"`；承载含义时用 `label`。

## 动效

- 禁 `transition-all`；显式写 `transition-colors` / `transition-opacity` / `transition-transform`。
- 只动 `transform` 与 `opacity`；颜色过渡用 `--dur-micro`（120ms）。
- `base.css` 已统一 `prefers-reduced-motion: reduce`，不要绕过它。
- 不加无限装饰动画；加载指示用文字 + 状态（`role="status"`）。

## 施工检查清单

1. 新页面：`page-shell` + `Header` + `container-page pt-10` + `page-head` + `Footer`；标题层级 H1 → H2 → H3 不跳级。
2. 目录 / 列表：行用 1px divider 分隔，悬停只做背景变化；不要给行加卡片。
3. 状态：加载、空、错误、禁用四种都有文字说明；空状态给一个动作。
4. 响应式：320 / 375 / 768 / 1440 / 1920 无横向滚动；手机端表格在自身容器内横向滚动并给出提示。
5. 触控：控件 32–40px 高，手机命中区 44px。
6. 对比度：正文 ≥ 4.5:1，图标 / 焦点环 / 字段边 ≥ 3:1。
7. 文案：中文、句首大写式；不用「·」拼接 meta、不用箭头贴链接、不用 tracked caps 标签。
8. 提交前：`npm run lint`、`npm test`、`npm run build`。

## 常见陷阱

1. **`bg-[paper-2]` 这类写法是无效 CSS。** Tailwind v4 会把它编译成 `background-color: paper-2`（浏览器丢弃）。必须写主题工具类：`bg-paper-2`、`text-ink-2`、`border-divider`、`bg-accent-soft`。仓库历史上清理过 466 处这种类，别再写。
2. 自定义颜色 / 阴影 / 缓动必须进 `tokens.css`；不要在页面里写 hex、`oklch()` 字面量或 `font-family`。
3. 不要卡片套卡片，不要 border + 宽阴影同时上（F24）。
4. 不要第二套图标库、不要 emoji 图标、不要在标题里用装饰 emoji。
5. 古典文本（诗词 / 史记 / 资治通鉴）用 `font-serif`；其余页面不要用衬线。
6. 暗色模式**尚未实现**；`color-scheme` 固定为 light。
7. 英文站 `/en` 是刻意收窄的独立面（打印速查表），有自己的 header/footer 与路由表，改它先读 `src/reference-routes.ts`。

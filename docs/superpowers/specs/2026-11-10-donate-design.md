# 打赏功能设计

> 日期：2026-11-10
> 状态：待批准（brainstorming 完成）

## 概述

为 school-formula 增加一个**纯粹的感谢支持**入口：读者觉得内容有用时，可以扫码给作者打一笔小钱。不是会员体系，不解锁任何权益，不做激励引导。

**核心决策**（来自 brainstorming）：

| 维度 | 决策 |
|------|------|
| 目的 | 纯感谢，不绑定任何权益或状态 |
| 入口位置 | 页脚 + 知识点详情页正文底部 |
| 二维码呈现 | 支付宝与微信**并排**展示 |
| 触发方式 | 点击按钮，从按钮上方展开**轻量 Popover**，不遮挡整页 |
| 组件复用 | 单个组件，两处传不同样式变体 |

## 技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 组件形态 | Popover，非居中 Modal | 打赏是低打扰行为，不该让整页变暗 |
| 图片懒加载 | 首次打开才挂载 `img` | 两张图合计约 460KB，不该进首屏；也让预渲染 HTML 保持干净 |
| 关闭方式 | 点击外部 / 按 Esc / 再次点按钮 | 三种都支持，符合 Popover 的常规预期 |
| 焦点管理 | 打开时焦点移入，关闭时还给触发按钮 | 键盘用户不会丢失位置 |
| 图片位置 | `public/donate/` | 构建时原样复制，不需要 import，也不进 JS bundle |
| 图片尺寸 | 预处理缩放，不裁切 | 原始图 1708×2560 / 828×1124，显示区仅约 160px 宽，原图严重超标 |
| 样式变体 | `triggerVariant` 取 text 或 tag | 页脚要低调（文字链），详情页要稍微显眼（带图标的标签） |

## 架构

### 文件结构

```
public/
└── donate/                               ← 新增
    ├── alipay.jpg                        ← 由 zfb.jpeg 缩放而来
    └── wechat.jpg                        ← 由 wx.jpeg 缩放而来

src/
└── components/
    ├── DonatePopover.tsx                 ← 新增：组件本体
    ├── DonatePopover.test.tsx            ← 新增：交互测试
    ├── Footer.tsx                        ← 修改：加入口（text 变体）
    └── KnowledgeDetail/
        └── index.tsx                     ← 修改：加入口（tag 变体）
```

### 组件接口

```ts
interface DonatePopoverProps {
  /** 触发按钮的文字，如「赞赏支持」「赞赏」 */
  triggerLabel: string;
  /** 触发按钮的视觉变体，默认 'text' */
  triggerVariant?: 'text' | 'tag';
}
```

组件不自带外层定位，根节点是 `relative inline-block`，Popover 相对它绝对定位。调用方只管放在需要的位置。

### 内部结构

```
<div className="relative inline-block">          ← 定位锚点
  <button aria-expanded aria-haspopup="dialog">  ← 触发器（外观随 variant 变）
  {open && (
    <div role="dialog" aria-label="赞赏支持">      ← Popover 卡片
      <p>如果内容对您有帮助，欢迎扫码支持</p>
      <div className="flex items-start gap-4">     ← 两张码并排
        <figure>
          <img src="/donate/alipay.jpg" alt="支付宝收款码" />
          <figcaption>支付宝</figcaption>
        </figure>
        <figure>
          <img src="/donate/wechat.jpg" alt="微信收款码" />
          <figcaption>微信支付</figcaption>
        </figure>
      </div>
    </div>
  )}
</div>
```

### 状态与数据流

组件只持有一个状态 `open`。Popover 的内容（含两张二维码）只在 `open` 为 true 时挂载，这就是懒加载——关闭即卸载，再打开由浏览器缓存直接出图，不需要额外的 `hasOpened` 标记。

- `open` 由触发按钮点击、Esc、点击外部三处驱动
- 点击外部用 `document` 上的 `mousedown` 监听，判断目标是否在根节点内
- Esc 用 `keydown` 监听，仅在 `open` 为 true 时挂载
- 打开时把焦点移到 Popover 容器；关闭时把焦点还给触发按钮

没有网络请求，没有持久化，没有全局状态。

## 视觉规范

全部走项目既有 token（`src/styles/tokens.css`），不引入任何新色值：

| 部位 | 样式 |
|------|------|
| Popover 卡片 | `bg-card border border-rule rounded-xl shadow-pop p-4` |
| 卡片宽度 | `w-max`，但 `max-w-[calc(100vw-2rem)]` |
| 定位 | `absolute bottom-full left-0 mb-2 z-30` |
| 二维码图 | `w-[148px] sm:w-[168px] h-auto max-h-[260px] object-contain bg-white rounded-md border border-rule` |
| 图注 | `text-xs text-ink-2 text-center mt-1.5` |
| 顶部说明 | `text-xs text-ink-3 mb-2.5` |
| 触发器（text） | `text-sm text-ink-2 hover:text-accent transition-colors` |
| 触发器（tag） | `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rule bg-card text-sm text-ink-2 hover:border-accent hover:text-accent transition-colors` |

两张图并排总宽约 `148×2 + 16 + 32 = 344px`，在 390px 视口下放得下；320px 视口下靠 `max-w` 与 `object-contain` 收缩，不产生横向滚动。

`z-30` 而不是 `--z-*` token：项目里 `--z-*` 只是声明，Tailwind 不会据此生成工具类，现有代码一律用裸数值（`z-10` / `z-40` / `z-50`）。取 30 是为了高于页面内容、低于粘性顶栏的 `z-40`。

Popover 用 `left-0` 对齐触发器的左缘，所以**调用方要保证触发器左缘右侧有约 344px 的空间**（窄视口下由 `max-w` 收缩）。当前两个挂载点都满足：页脚链接从左排起，详情页入口在居中容器内。

`triggerVariant` 为 `tag` 时图标复用项目已有的 `Icon` 组件，取 `sparkle`。

## 交互规范

| 触发 | 行为 |
|------|------|
| 点击触发器 | 打开；再点同一按钮关闭 |
| 点击 Popover 外任意处 | 关闭 |
| 按 Esc | 关闭 |
| 打开时 | 焦点移入 Popover 容器（`tabIndex` 为 -1，调用 `focus()`） |
| 关闭时 | 焦点还给触发器 |

无障碍：触发器带 `aria-expanded`、`aria-haspopup`；Popover 带 `role` 为 dialog 与 `aria-label`；两张码的 `img` 各有描述性 `alt`。

## 图片处理

原始文件是竖版图（`zfb.jpeg` 1708×2560、`wx.jpeg` 828×1124，从比例看是手机截图而非纯二维码），直接放进站点既浪费带宽也显示不清。构建前用 macOS 自带的 `sips` 缩放一次，产物入库：

```bash
mkdir -p public/donate
sips --resampleWidth 720 --setProperty formatOptions 80 zfb.jpeg --out public/donate/alipay.jpg
sips --resampleWidth 720 --setProperty formatOptions 80 wx.jpeg  --out public/donate/wechat.jpg
```

只缩放、不裁切：组件用 `object-contain` 显示整张图，所以无论源图是什么比例都能完整呈现。若源截图里含二维码以外的界面元素，把图裁成二维码正方形再重新放入 `public/donate/` 即可，组件无需改动。

原始 `zfb.jpeg` / `wx.jpeg` 处理完从仓库根目录删除，不提交。

## 集成点

**页脚**（`Footer.tsx`）：在现有链接导航下方、版权行上方，加一行 `<DonatePopover triggerLabel="赞赏支持" />`。

**知识点详情页**（`KnowledgeDetail/index.tsx`）：在正文卡片内、「相关知识点」区块之后、`p-8` 容器的闭合标签之前，加一段分隔加居中入口：

```tsx
<div className="pt-8 border-t border-divider flex flex-col items-center gap-2">
  <p className="text-sm text-ink-3">这份内容帮到你了？</p>
  <DonatePopover triggerLabel="赞赏" triggerVariant="tag" />
</div>
```

知识点详情页本身已经渲染 `<Footer />`，所以页脚入口会自动出现在这里，无需重复添加。

## 边界与错误处理

- **图片加载失败**：`img` 加 `onError`，把该格替换为一行文字「二维码加载失败」，不显示破图图标。
- **键盘可达**：触发器是原生 button，Tab 可达，Enter 与 Space 可开。
- **预渲染与 hydration**：Popover 默认关闭且内容不渲染，SSR 输出只有触发按钮；客户端首帧一致，不产生 hydration 差异。
- **移动端**：Popover 向上展开，避免被视口底部裁掉；横向靠 max-w 限制，不产生横向滚动。

## 测试

新增 `src/components/DonatePopover.test.tsx`，用项目已有的 vitest 加 @testing-library/react 模式覆盖：

1. 初始不渲染二维码图片（懒加载生效）
2. 点击触发器后出现两张二维码与图注
3. 再次点击触发器关闭
4. 按 Esc 关闭
5. 点击外部关闭
6. `triggerVariant` 为 `tag` 时渲染图标，为 `text` 时不渲染

同时给 `Footer.test.tsx` 加一条：页脚存在「赞赏支持」按钮。

## 不做的事（YAGNI）

- 不做打赏金额选择、支付跳转、回调校验 —— 这是个人收款码，没有后端参与
- 不做打赏记录、统计、感谢名单
- 不做「已打赏」标记或任何解锁逻辑
- 不做悬浮按钮、不做自动弹出
- 不做 A/B 或埋点

## 验收标准

- [ ] 页脚出现「赞赏支持」入口，点击弹出含支付宝与微信两张码的 Popover
- [ ] 知识点详情页正文底部出现「赞赏」入口，行为一致
- [ ] 三种关闭方式（再点、点外部、Esc）都能关闭
- [ ] 首屏不加载二维码图片；打开后才请求
- [ ] 320px、390px、1440px 三个宽度下无横向滚动、Popover 不被裁切
- [ ] 键盘可完整操作，焦点不丢失
- [ ] `npm run build` 通过（1123 页预渲染），`npx tsc -b` 无错误，`npx eslint src/` 无错误，`npx vitest run` 全绿

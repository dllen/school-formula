# Design: 拾艺院 · 核心知识点库

The locked system. Every Hallmark run reads this first and pages share it.
Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Shape of the first page: app screen (a catalogue, not a landing page)
- Theme: brand (the project's own blue, re-expressed in OKLCH)
- Axes: paper / grotesk / cool · posture: Restrained

## Tokens
`src/styles/tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(0.982 0.004 258);  --color-paper-2: oklch(0.962 0.007 258);  --color-paper-3: oklch(0.932 0.010 258);
  --color-card: oklch(0.996 0.003 258);  --color-well: oklch(0.962 0.007 258);
  --color-ink: oklch(0.22 0.012 258);  --color-ink-2: oklch(0.42 0.014 258);  --color-ink-3: oklch(0.52 0.014 258);
  --color-rule: oklch(0.90 0.008 258);  --color-rule-strong: oklch(0.62 0.010 258);  --color-divider: oklch(0.935 0.006 258);
  --color-accent: oklch(0.50 0.19 258);  --color-accent-hover: oklch(0.44 0.185 258);  --color-accent-ink: oklch(0.99 0.005 258);
  --color-focus: oklch(0.50 0.21 258);
  --font-sans: "PingFang SC", …;  --font-serif: "Songti SC", … (classical texts only);  --font-mono: ui-monospace, …;
  --radius-card: 10px;  --radius-control: 8px;  --shadow-card: 0 1px 2px oklch(0.22 0.012 258 / 0.06);
}
```
The spacing scale, type scale, easings and durations live in `tokens.css`.
App scale: body 16px, item title 17px, section head 18px inside a reading page and
22px for a catalogue head, page title 28px, detail title 36px. No marketing display sizes.

## Controls
- Primary: accent fill · 8px radius · 36px (40px for a large action), 44px hit target on touch
- Secondary: card fill + 1px rule border, same radius and height
- Tertiary: text only, ink-2, paper-2 on hover
- Segmented control: paper-2 trough, active step card + shadow, 32px steps

## Surfaces
Climb the ladder: whitespace → hairline divider → paper-2 well → card (border, never
shadow, never both). No card inside a card. The page canvas is paper; a row is parted
from its neighbour by a 1px divider; a grouped secondary block is a well.

## Motion
- Character: calm; only named properties, never `transition-all`
- One hover signal per element (background or border colour); no lifts on cards
- `--dur-micro` for state, `--dur-short` for menus, `--dur-long` for disclosure
- Under reduced motion everything ends at once

## Components
Shared primitives live in `src/styles/ui.css` and are used by name:
`page-shell`, `container-page`, `page-head`, `page-title`, `page-lead`, `seg`,
`seg-btn`, `btn` + `btn-primary` / `btn-secondary` / `btn-ghost`, `icon-btn`,
`well`, `sheet`, `browse`, `rail`, `rail-item`, `index-head`, `kp-row`,
`section`, `section-head`, `prose-body`, `toc`, `tag`, `breadcrumb`,
`empty-state`, `table-basic`, `field`, `input`.
A new screen composes these; it does not invent a card.

## Writing
Chinese, the owner's own nouns. Section heads name what the reader gets, never a
category label. Labels are sentence case in the body face, never tracked caps.
No middle-dot meta strings, no arrows glued to link text, no emoji as icons.

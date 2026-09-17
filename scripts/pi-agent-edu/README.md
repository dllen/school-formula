# pi-agent-edu

交互式 CLI 工具，通过 pi agent SDK 生成中小学教育资源。

## 安装

```bash
cd scripts/pi-agent-edu
npm install
```

## 运行

```bash
# 新会话
npx tsx index.ts

# 恢复最近会话
npx tsx index.ts --continue

# 恢复指定会话
npx tsx index.ts --continue <session-id>

# 列出会话
npx tsx index.ts --sessions
```

## 配置

首次运行会自动引导配置 `~/.pi-edu/config.json`。

## 使用示例

```
> 生成初一数学第一章 TutorialUnit
> 生成 10 道初中物理练习题（easy:medium:hard = 4:4:2）
> 查看现有的小学英语 TutorialUnit
> 生成高中化学第二章知识点的练习题
```

## 工具确认

| 工具 | 默认行为 |
|------|---------|
| `read` | 自动放行 |
| `grep` | 自动放行 |
| `find` | 自动放行 |
| `bash` | 需确认 |
| `write` | 需确认 |
| `edit` | 需确认 |

确认时可输入：
- `y` — 执行
- `n` — 跳过
- `q` — 退出
- `a` — 全部确认（yes all）
- `b` — 全部拒绝（no all）

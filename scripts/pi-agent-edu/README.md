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

---

## 最佳实践

### 有效 Prompt 范例

**✅ 好的 Prompt**
```
生成【初中数学 - 初二 - 一次函数】的 TutorialUnit，包含10道练习题（easy:medium:hard = 4:4:2）
```

**❌ 不够好的 Prompt**
```
生成一次函数的练习题
```

**差异点：**
- 明确年段和学科
- 指定知识点而非章节名
- 明确难度分布

### 推荐工作流

1. **生成前先了解现有数据**
   ```
   > 读取 src/data/tutorials/index.ts 了解已有内容
   > 读取 src/data/tutorials/types.ts 了解格式要求
   > 读取 src/data/knowledge/ 了解知识点结构
   ```

2. **分步生成**
   - 先生成 1 个单元确认质量
   - 确认风格、格式无误后再批量生成

3. **生成后检查**
   - 用 `bash npx tsc` 检查类型错误
   - 用 `read` 验证输出格式
   - 用 `grep` 确认没有重复内容

### 工具使用策略

| 场景 | 推荐工具 | 示例 |
|------|----------|------|
| 查看数据格式 | `read` | `read src/data/tutorials/middle-math.ts` |
| 搜索相似内容 | `grep` | `grep "一次函数" src/data/tutorials/` |
| 确认文件存在 | `bash` | `bash ls src/data/tutorials/` |
| 写入新内容 | `write` | 先写临时文件，确认后移动 |
| 修改现有内容 | `edit` | 先 `read` 了解上下文 |

### 内容质量检查清单

生成内容后，按以下清单检查：

- [ ] **准确性**：计算题答案验算过，概念与课程标准一致
- [ ] **难度适切**：easy 题确实简单，hard 题有区分度
- [ ] **格式规范**：TypeScript 对象合法，id 全局唯一
- [ ] **教学价值**：题目有思维含量，不是纯记忆

### 常见问题

**Q: 生成的格式不合法怎么办？**
A: 分步生成，先确认结构再填充内容。先生成简单内容验证格式。

**Q: 内容与已有内容重复怎么办？**
A: 生成前先用 `grep` 搜索关键词，确认不存在再生成。

**Q: 题目难度不均衡怎么办？**
A: 明确指定 easy/medium/hard 各多少道，不要让 AI 自己决定。

---

## Prompt 模板参考

### TutorialUnit 生成

```bash
> 生成【初中数学 - 初一 - 有理数】TutorialUnit
> 生成【高中物理 - 必修一 - 匀变速直线运动】TutorialUnit
> 批量生成初中数学第一章5个单元
```

### 练习题生成

```bash
> 生成10道初中物理浮力练习题（easy:medium:hard = 4:4:2）
> 生成高中化学氧化还原练习题（选择题，8道）
> 生成初一数学第二章单元测试卷（45分钟）
```

### 错题分析

```bash
> 学生把幂的乘方和积的乘方公式混淆了，请分析并讲解
> 分析这道几何证明题的常见错误
```

### 学习规划

```bash
> 为期中考试生成数学复习计划（还有10天，每天1小时）
> 生成高考物理力学专题复习计划（还有1个月）
```

---

## 输出格式

系统提示词已内置接口定义，AI 输出格式如下：

### TutorialUnit

```typescript
{
  id: "m-math-7-1-1",        // 唯一标识：{学段}-{学科}-{年级}-{章节}-{单元}
  title: "有理数的认识",      // 标题
  order: 1,                   // 单元序号
  duration: "20分钟",         // 建议时长
  objectives: ["理解正负数的意义", ...],
  teach: {
    hook: "用温度计引入正负数概念",
    summary: "本单元我们将认识正负数，理解其在实际生活中的意义"
  },
  learn: {
    sections: [...],          // 知识点分节
    tips: ["正数大于0，负数小于0"]  // 学习技巧
  },
  practice: [...],            // 10道练习题
  aiContext: "为家庭辅导设计，适合家长指导孩子学习"
}
```

### Question

```typescript
{
  id: "q-m-math-7-1-1-1",
  type: "choice",             // choice | fill | truefalse | solve
  question: "下列各数中，哪些是正数？",
  options: ["+3", "-2", "0", "1/2"],
  answer: "+3, 1/2",
  explanation: "正数是大于0的数，+3和1/2都大于0",
  difficulty: "easy"          // easy | medium | hard
}
```

---

## 数据文件位置

```
src/data/
├── tutorials/          # 教程单元数据
│   ├── primary-*.ts   # 小学教程
│   ├── middle-*.ts     # 初教程
│   ├── high-*.ts       # 高中教程
│   └── types.ts        # 类型定义
├── knowledge/          # 知识点结构
├── questions/         # 额外题库
└── prompts/           # 提示词模板
```

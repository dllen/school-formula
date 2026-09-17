#!/bin/bash
# pi-agent-edu launcher
#
# Usage:
#   ./pi-agent-edu.sh              # interactive mode (new or resume)
#   ./pi-agent-edu.sh --sessions   # list saved sessions
#   ./pi-agent-edu.sh --continue   # resume last session
#   ./pi-agent-edu.sh --continue <id>  # resume specific session
#   ./pi-agent-edu.sh --new       # force new session
#   ./pi-agent-edu.sh --help       # show this help
#
# Requirements:
#   - Node.js 18+
#   - pi CLI installed (https://pi.dev)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check pi is available
if ! command -v pi &> /dev/null; then
    echo "Error: pi CLI not found in PATH"
    echo ""
    echo "Please install pi agent first:"
    echo "  npm install -g @pi-kit/pi"
    echo "  or visit https://pi.dev"
    exit 1
fi

# Show help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    cat << 'EOF'
pi-agent-edu - 教育智能体交互工具

用法:
  ./pi-agent-edu.sh              交互模式（新建或继续）
  ./pi-agent-edu.sh --sessions    列出所有会话
  ./pi-agent-edu.sh --continue    继续上次会话
  ./pi-agent-edu.sh --continue <id>  继续指定会话
  ./pi-agent-edu.sh --new         强制新建会话
  ./pi-agent-edu.sh --help        显示本帮助

交互命令:
  help, ?         显示帮助
  q, quit, exit   退出
  save            保存当前会话

工作流示例:

1. 生成 TutorialUnit（教程单元）
   > 生成【初中数学 - 初二 - 一次函数】TutorialUnit
   > 生成【高中物理 - 必修一 - 匀变速直线运动】TutorialUnit
   > 批量生成初中数学第一章5个单元

2. 生成练习题
   > 生成10道初中物理浮力练习题（easy:medium:hard = 4:4:2）
   > 生成高中化学氧化还原练习题（选择题，8道）
   > 生成初一数学第二章单元测试卷（45分钟）

3. 错题分析
   > 学生把幂的乘方和积的乘方公式混淆了，请分析并讲解
   > 分析这道几何证明题的常见错误

4. 学习规划
   > 为期中考试生成数学复习计划（还有10天，每天1小时）
   > 生成高考物理力学专题复习计划（还有1个月）

5. 了解现有数据后再生成
   > 先读取 src/data/tutorials/index.ts 了解已有内容
   > 先读取 src/data/tutorials/types.ts 了解格式要求
   > 先读取 src/data/knowledge/ 了解知识点结构

数据文件位置:
  src/data/tutorials/   - 教程单元数据
  src/data/knowledge/   - 知识点结构
  src/data/questions/   - 额外题库
  src/data/prompts/     - 提示词模板

最佳实践:
  - 明确年段和学科（初中数学、高中物理等）
  - 指定知识点而非章节名
  - 明确难度分布（easy/medium/hard）
  - 先生成1个单元确认质量，再批量生成
  - 生成后用 npx tsc 检查类型错误
EOF
    exit 0
fi

# Run the interactive CLI
cd "$SCRIPT_DIR"
exec npx tsx index.ts "$@"

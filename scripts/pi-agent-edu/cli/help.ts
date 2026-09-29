import { print } from '../io.js';

export function showHelp(): void {
  print(`pi-agent-edu CLI — 教育智能体交互工具

用法:
  node index.ts              启动新会话（引导模式）
  node index.ts --sessions   列出所有会话
  node index.ts --continue   继续上次会话
  node index.ts --continue <id>  继续指定会话
  node index.ts --new        强制新建会话
  node index.ts --help       显示本帮助

交互命令:
  help, ?         显示帮助
  q, quit, exit   退出
  退出            保存最近生成内容并退出
  save, 保存      保存最近生成内容到仓库（save <kind> 或 save <路径> 指定位置）
  btw <文字>      旁注：只对下一轮生效
  model, provider 切换 AI 模型
  thinking        切换思考级别
`, 'info');
}

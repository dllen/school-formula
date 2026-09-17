import readline from 'node:readline';

type Color = (text: string) => string;
const colors = {
  reset: (t: string) => `\x1b[0m${t}\x1b[0m`,
  dim: (t: string) => `\x1b[2m${t}\x1b[0m`,
  cyan: (t: string) => `\x1b[36m${t}\x1b[0m`,
  green: (t: string) => `\x1b[32m${t}\x1b[0m`,
  yellow: (t: string) => `\x1b[33m${t}\x1b[0m`,
  red: (t: string) => `\x1b[31m${t}\x1b[0m`,
  magenta: (t: string) => `\x1b[35m${t}\x1b[0m`,
};

export function print(msg: string, type: 'info' | 'success' | 'warn' | 'error' | 'thinking' | 'dim' = 'info') {
  const prefix: Record<string, string> = {
    info: '  ',
    success: '✅',
    warn: '⚠️',
    error: '❌',
    thinking: '🤔',
    dim: '  ',
  };
  const colorFn: Record<string, Color> = {
    info: colors.reset,
    success: colors.green,
    warn: colors.yellow,
    error: colors.red,
    thinking: colors.magenta,
    dim: colors.dim,
  };
  console.log(`${prefix[type] ?? '  '} ${(colorFn[type] ?? colors.reset)(msg)}`);
}

export async function prompt(message: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function confirm(message: string): Promise<boolean> {
  const answer = await prompt(`${message} (y/n) `);
  return answer.toLowerCase() === 'y';
}

export async function toolConfirm(tool: string, args: object): Promise<'y' | 'n' | 'q' | 'a' | 'b'> {
  const argsStr = JSON.stringify(args, null, 2).slice(0, 200);
  const answer = await prompt(
    `\n${colors.cyan('🔧')} ${colors.reset('工具调用:')} ${colors.yellow(tool)}\n${colors.dim(argsStr)}\n${colors.reset('[y/n/q/a(yes all)/b(no all)]? ')}`
  );
  return answer.toLowerCase() as 'y' | 'n' | 'q' | 'a' | 'b';
}

export async function pager(lines: string[], limit = 30): Promise<void> {
  if (lines.length <= limit) {
    console.log(lines.join('\n'));
    return;
  }
  for (let i = 0; i < lines.length; i += limit) {
    console.log(lines.slice(i, i + limit).join('\n'));
    if (i + limit < lines.length) {
      const ans = await prompt(colors.dim('-- More -- (q to quit) '));
      if (ans.toLowerCase() === 'q') break;
    }
  }
}

export async function selectOption<T>(
  message: string,
  options: readonly T[],
  format: (opt: T) => string = String,
): Promise<T> {
  const lines = options.map((opt, i) => `  [${i + 1}] ${format(opt)}`);
  const promptMsg = `${message}\n${lines.join('\n')}\n> `;

  while (true) {
    const answer = await prompt(promptMsg);
    const idx = parseInt(answer, 10) - 1;
    if (idx >= 0 && idx < options.length) {
      return options[idx];
    }
    print(`请输入 1-${options.length} 之间的数字`, 'warn');
  }
}

export function clearLine(): void {
  process.stdout.write('\x1b[2K\r');
}

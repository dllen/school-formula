// scripts/extract-data/index.ts
import { parseCliArgs } from './cli/args.js';
import { showHelp } from './cli/help.js';
import { listAdapters, getAdapter, runAdapter, runInspect } from './core/runner.js';

async function main(): Promise<void> {
  const args = parseCliArgs(process.argv.slice(2));

  if (args.flags.help) {
    showHelp();
    process.exit(0);
  }
  if (args.flags.version) {
    console.log('extract-data 0.1.0');
    process.exit(0);
  }
  if (args.errors.length > 0) {
    for (const e of args.errors) console.error(`Error: ${e}`);
    process.exit(2);
  }

  // New: --inspect takes precedence over adapter positional
  if (args.flags.inspect) {
    try {
      await runInspect(args.flags.inspect, args.flags, { root: process.cwd() });
      process.exit(0);
    } catch (err) {
      console.error(`[extract-data] inspect fatal: ${(err as Error).message}`);
      process.exit(1);
    }
  }

  if (args.flags.list) {
    for (const a of listAdapters()) {
      console.log(`${a.kind.padEnd(10)}  ${a.name}  — ${a.description}`);
    }
    process.exit(0);
  }
  if (!args.flags.adapterName) {
    console.error('Error: 缺少 adapter 名（--list 查看可用）');
    process.exit(2);
  }
  const adapter = getAdapter(args.flags.adapterName);
  if (!adapter) {
    console.error(`Error: 未知 adapter: ${args.flags.adapterName}`);
    console.error('运行 --list 查看可用 adapter');
    process.exit(2);
  }
  try {
    await runAdapter(adapter, args.flags, { root: process.cwd() });
    process.exit(0);
  } catch (err) {
    console.error(`[extract-data] fatal: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();

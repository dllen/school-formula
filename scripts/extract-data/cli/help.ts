// scripts/extract-data/cli/help.ts

export const HELP_TEXT = `extract-data — 外部数据源抽取工具

用法:
  extract [adapter] [flags]

子命令:
  <adapter>           跑指定 adapter（必填，或用 --list 查看）

Flags:
  --list, -l          列出所有 adapter
  --dry-run           抓 + 解析但不写盘，结果打到 stdout
  --no-cache          忽略本地缓存强制重新抓
  --partial-ok        接受部分页面失败
  --url <single>      只抓单个 URL（调试）
  --cache-ttl <days>  覆盖默认 7 天缓存 TTL
  --help, -h          显示本帮助
  --version, -V       显示版本

环境变量:
  EXTRACT_MIN_INTERVAL_MS    请求间隔（ms），默认 500

输出:
  staging/<kind>/extracted-<ISO8601>.json
  staging/<kind>/FAILED-<ISO8601>.txt   (--partial-ok 失败时)

示例:
  extract --list
  extract shiji-kb --dry-run
  extract shiji-kb --partial-ok

下一步:
  npm run ingest -- --kind shiji   把抽取结果合并进 src/data/
`;

export function showHelp(): void {
  process.stdout.write(HELP_TEXT);
}

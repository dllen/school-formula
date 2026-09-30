// scripts/extract-data/cli/args.ts

export interface CliFlags {
  list: boolean;
  help: boolean;
  version: boolean;
  dryRun: boolean;
  noCache: boolean;
  partialOk: boolean;
  url?: string;
  cacheTtlDays?: number;
  adapterName?: string;
  /** New: URL to inspect (dev tool, mutually exclusive with adapterName) */
  inspect?: string;
  /** New: save fixture when --inspect (default true) */
  save: boolean;
  /** New: heading print limit (default 20) */
  maxHeadings?: number;
}

export interface ParsedArgs {
  flags: CliFlags;
  errors: string[];
}

export function parseCliArgs(argv: string[]): ParsedArgs {
  const flags: CliFlags = {
    list: false,
    help: false,
    version: false,
    dryRun: false,
    noCache: false,
    partialOk: false,
    save: true,
  };
  const errors: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    switch (a) {
      case '--list':
      case '-l':
        flags.list = true;
        break;
      case '--help':
      case '-h':
        flags.help = true;
        break;
      case '--version':
      case '-V':
        flags.version = true;
        break;
      case '--dry-run':
        flags.dryRun = true;
        break;
      case '--no-cache':
        flags.noCache = true;
        break;
      case '--partial-ok':
        flags.partialOk = true;
        break;
      case '--url':
        flags.url = argv[++i];
        if (!flags.url) errors.push('--url 需要值');
        break;
      case '--cache-ttl': {
        const v = argv[++i];
        const n = Number(v);
        if (!Number.isFinite(n) || n < 0) errors.push(`--cache-ttl 需要非负数字（传入: ${v}）`);
        else flags.cacheTtlDays = n;
        break;
      }
      case '--inspect':
        flags.inspect = argv[++i];
        if (!flags.inspect) errors.push('--inspect 需要值');
        break;
      case '--no-slot':
        flags.save = false;
        break;
      case '--max-headings': {
        const v2 = argv[++i];
        const n2 = Number(v2);
        if (!Number.isFinite(n2) || n2 < 1) errors.push(`--max-headings 需要正整数（传入: ${v2}）`);
        else flags.maxHeadings = n2;
        break;
      }
      default:
        if (a.startsWith('-')) {
          errors.push(`未知 flag: ${a}`);
        } else if (!flags.adapterName) {
          flags.adapterName = a;
        } else {
          errors.push(`多余位置参数: ${a}`);
        }
    }
  }

  return { flags, errors };
}

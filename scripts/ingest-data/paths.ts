// paths.ts
import { fileURLToPath } from 'node:url';

/** 仓库根：本文件在 <root>/scripts/ingest-data/paths.ts。 */
export function getRoot(): string {
  return fileURLToPath(new URL('../..', import.meta.url));
}

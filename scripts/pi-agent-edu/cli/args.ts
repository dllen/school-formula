import { parseArgs } from 'node:util';

export interface CliArgs {
  sessions: boolean;
  continue: string | null;
  new: boolean;
}

export function parseCliArgs(): CliArgs {
  const { values } = parseArgs({
    options: {
      sessions: { type: 'boolean', short: 'l' },
      continue: { type: 'string', short: 'c' },
      new: { type: 'boolean', short: 'n' },
    },
  });

  return {
    sessions: values.sessions === true,
    continue: values.continue ?? null,
    new: values.new === true,
  };
}

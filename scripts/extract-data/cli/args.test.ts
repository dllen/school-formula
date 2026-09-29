import { describe, it, expect } from 'vitest';
import { parseCliArgs } from './args.js';

describe('parseCliArgs', () => {
  it('parses adapter name as first positional', () => {
    const { flags, errors } = parseCliArgs(['shiji-kb']);
    expect(errors).toEqual([]);
    expect(flags.adapterName).toBe('shiji-kb');
  });

  it('parses --list / -l', () => {
    expect(parseCliArgs(['--list']).flags.list).toBe(true);
    expect(parseCliArgs(['-l']).flags.list).toBe(true);
  });

  it('parses --dry-run', () => {
    expect(parseCliArgs(['shiji-kb', '--dry-run']).flags.dryRun).toBe(true);
  });

  it('parses --no-cache', () => {
    expect(parseCliArgs(['shiji-kb', '--no-cache']).flags.noCache).toBe(true);
  });

  it('parses --partial-ok', () => {
    expect(parseCliArgs(['shiji-kb', '--partial-ok']).flags.partialOk).toBe(true);
  });

  it('parses --url with value', () => {
    const { flags, errors } = parseCliArgs(['shiji-kb', '--url', 'https://x.com/page']);
    expect(errors).toEqual([]);
    expect(flags.url).toBe('https://x.com/page');
  });

  it('errors on --url without value', () => {
    const { errors } = parseCliArgs(['shiji-kb', '--url']);
    expect(errors.some(e => e.includes('--url 需要值'))).toBe(true);
  });

  it('parses --cache-ttl with number', () => {
    const { flags, errors } = parseCliArgs(['shiji-kb', '--cache-ttl', '14']);
    expect(errors).toEqual([]);
    expect(flags.cacheTtlDays).toBe(14);
  });

  it('errors on negative --cache-ttl', () => {
    const { errors } = parseCliArgs(['shiji-kb', '--cache-ttl', '-1']);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('errors on unknown flag', () => {
    const { errors } = parseCliArgs(['shiji-kb', '--bogus']);
    expect(errors.some(e => e.includes('未知 flag'))).toBe(true);
  });

  it('errors on multiple positional args', () => {
    const { errors } = parseCliArgs(['shiji-kb', 'other']);
    expect(errors.some(e => e.includes('多余位置参数'))).toBe(true);
  });
});

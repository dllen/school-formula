import { describe, expect, it } from 'vitest';
import { ZH } from '../i18n/languages';
import { resolvePageContent } from './content';

function contentFor(path: string) {
  return resolvePageContent(path);
}

describe('小学语文 SEO 内容', () => {
  it('首页', () => {
    const content = contentFor('/yuwen/');
    expect(content.title).toContain('小学语文');
    expect(content.breadcrumbs.map((b) => b.name)).toEqual(['首页', '小学语文']);
  });

  it('册页', () => {
    const content = contentFor('/yuwen/book/1a/');
    expect(content.title).toContain('一年级上册');
    expect(content.title).toContain('41 课');
    expect(content.breadcrumbs.at(-1)?.path).toBe('/yuwen/book/1a');
  });

  it('课页', () => {
    const content = contentFor('/yuwen/lesson/G1A01/');
    expect(content.title).toContain('识字1：天地人');
    expect(content.breadcrumbs.map((b) => b.name)).toEqual(['首页', '小学语文', '一年级上册', '识字1：天地人']);
  });

  it('单字页（中文路径）', () => {
    const content = contentFor('/yuwen/char/' + encodeURIComponent('天') + '/');
    expect(content.title).toContain('天');
    expect(content.title).toContain('tiān');
    expect(content.breadcrumbs.at(-1)?.name).toBe('天');
  });

  it('韵母页与多音字页', () => {
    expect(contentFor('/yuwen/pinyin/a/').title).toContain('拼音表');
    expect(contentFor('/yuwen/duoyin/').title).toContain('多音字');
  });

  it('中文语言下 brand 取自站点配置', () => {
    expect(contentFor('/yuwen/').title).toContain('拾艺院');
    expect(ZH.code).toBe('zh-CN');
  });
});

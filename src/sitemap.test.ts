import { describe, expect, it } from 'vitest';
import { allYuwenRoutePaths } from './yuwen/paths';
import { PRERENDER_PATHS, XML_SITEMAP_PATHS } from './prerender/routes';
import {
  buildHtmlSitemap,
  flattenSitemap,
  HTML_SITEMAP_PATH,
} from './sitemap';

describe('HTML sitemap', () => {
  it('exposes every prerender path except itself with no duplicates', () => {
    const groups = buildHtmlSitemap();
    const allPaths = flattenSitemap(groups);

    expect(new Set(allPaths).size).toBe(allPaths.length);
    expect(allPaths).not.toContain(HTML_SITEMAP_PATH);

    // /yuwen 有 3878 条预渲染路由，但 HTML 站点地图只保留 13 个入口
    // （首页 + 拼音表 + 多音字 + 10 册），不逐字/逐课展开；其余路由仍全部覆盖。
    const yuwenEntryCount = 13;
    const expected = PRERENDER_PATHS.filter(
      (path) => !path.startsWith('/yuwen') && path !== HTML_SITEMAP_PATH,
    );
    for (const path of expected) {
      expect(allPaths).toContain(path);
    }
    expect(allPaths.filter((path) => path.startsWith('/yuwen'))).toHaveLength(yuwenEntryCount);
    expect(allPaths).toHaveLength(
      PRERENDER_PATHS.length - 1 - (allYuwenRoutePaths().length - yuwenEntryCount),
    );
    for (const path of allPaths) {
      expect(PRERENDER_PATHS).toContain(path);
    }
  });
});

describe('XML sitemap paths', () => {
  it('excludes /sitemap and keeps it in PRERENDER_PATHS', () => {
    expect(XML_SITEMAP_PATHS).not.toContain(HTML_SITEMAP_PATH);
    expect(PRERENDER_PATHS).toContain(HTML_SITEMAP_PATH);
  });
});
describe('HTML 站点地图的小学语文分组', () => {
  it('列出 10 册与两个工具页，不逐字展开', () => {
    const group = buildHtmlSitemap().find((g) => g.title === '小学语文');
    expect(group).toBeDefined();
    expect(group!.links).toHaveLength(13);
    expect(group!.links[0].path).toBe('/yuwen');
    expect(group!.links.map((l) => l.path)).toContain('/yuwen/book/1a');
    expect(group!.links.map((l) => l.path)).toContain('/yuwen/pinyin');
    expect(group!.links.map((l) => l.path)).toContain('/yuwen/duoyin');
  });
});

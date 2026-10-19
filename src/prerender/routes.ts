import { KNOWLEDGE_DATA } from '../data/knowledge';
import { ALL_POEMS } from '../data/poems';
import { ENGLISH_ROUTE_PATHS } from '../reference-routes';
import { HTML_SITEMAP_PATH } from '../sitemap';
import { VIEW_PATHS } from '../view-routes';

export const PRERENDER_PATHS: string[] = [
  '/',
  ...Object.values(VIEW_PATHS),
  ...KNOWLEDGE_DATA.flatMap((grade) =>
    grade.subjects.flatMap((subject) =>
      subject.knowledgePoints.map((kp) => `/knowledge/${kp.id}`),
    ),
  ),
  ...ENGLISH_ROUTE_PATHS,
  ...ALL_POEMS.map((p) => `/poetry/${p.id}`),
  HTML_SITEMAP_PATH,
];

/**
 * 用于生成 `dist/sitemap.xml` 的路径列表。HTML 站点地图本身不出现在 XML sitemap 里——
 * 它已经链向站内所有其他页面，无需再次声明。
 */
export const XML_SITEMAP_PATHS: string[] = PRERENDER_PATHS.filter(
  (path) => path !== HTML_SITEMAP_PATH,
);

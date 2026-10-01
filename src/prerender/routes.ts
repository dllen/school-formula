import { KNOWLEDGE_DATA } from '../data/knowledge';
import { ENGLISH_REFERENCE_PATHS } from '../seo/content';
import { VIEW_PATHS } from '../view-routes';

export const PRERENDER_PATHS: string[] = [
  '/',
  ...Object.values(VIEW_PATHS),
  ...KNOWLEDGE_DATA.flatMap((grade) =>
    grade.subjects.flatMap((subject) =>
      subject.knowledgePoints.map((kp) => `/knowledge/${kp.id}`),
    ),
  ),
  ...ENGLISH_REFERENCE_PATHS,
];

import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HtmlSitemap } from './components/HtmlSitemap';
import { LegalPage } from './components/legal/LegalPage';
import { ROUTE_COMPONENTS } from './routing/route-modules';
import {
  ENGLISH_CATEGORY_ROUTE,
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
} from './reference-routes';
import { HTML_SITEMAP_PATH } from './sitemap';
import { INITIAL_VIEW_PATHS } from './view-routes';

const {
  home: Home,
  knowledgeDetail: KnowledgeDetail,
  poemDetail: PoemDetail,
  referenceIndex: ReferenceIndex,
  referenceCategory: ReferenceCategory,
  referencePage: ReferencePage,
  yuwenIndex: YuwenIndex,
  yuwenBook: YuwenBook,
  yuwenLesson: YuwenLesson,
  yuwenReview: YuwenReview,
  yuwenTingxie: YuwenTingxie,
  yuwenChar: YuwenChar,
  yuwenPinyinIndex: YuwenPinyinIndex,
  yuwenPinyinStem: YuwenPinyinStem,
  yuwenDuoyin: YuwenDuoyin,
} = ROUTE_COMPONENTS;

function App() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-paper-2" data-testid="route-suspense-fallback" />}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        {INITIAL_VIEW_PATHS.map((path) => (
          <Route key={path} path={path} element={<Home />} />
        ))}
        <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
        <Route path="/poetry/:id" element={<PoemDetail />} />
        <Route path="/yuwen" element={<YuwenIndex />} />
        <Route path="/yuwen/book/:bookId" element={<YuwenBook />} />
        <Route path="/yuwen/lesson/:lessonId" element={<YuwenLesson />} />
        <Route path="/yuwen/review/:bookId/:unitNo" element={<YuwenReview />} />
        <Route path="/yuwen/tingxie/:bookId/:unitNo" element={<YuwenTingxie />} />
        <Route path="/yuwen/char/:ch" element={<YuwenChar />} />
        <Route path="/yuwen/pinyin" element={<YuwenPinyinIndex />} />
        <Route path="/yuwen/pinyin/:stem" element={<YuwenPinyinStem />} />
        <Route path="/yuwen/duoyin" element={<YuwenDuoyin />} />
        <Route path={HTML_SITEMAP_PATH} element={<HtmlSitemap />} />
        <Route path={ENGLISH_HOME} element={<ReferenceIndex />} />
        <Route path={ENGLISH_CATEGORY_ROUTE} element={<ReferenceCategory />} />
        <Route path={ENGLISH_REFERENCE_ROUTE} element={<ReferencePage />} />
        <Route path="/privacy" element={<LegalPage />} />
        <Route path="/terms" element={<LegalPage />} />
        <Route path="/about" element={<LegalPage />} />
        <Route path="/contact" element={<LegalPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;

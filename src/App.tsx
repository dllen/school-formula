import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { KnowledgeDetail } from './components/KnowledgeDetail';
import { ReferenceCategory } from './components/reference/ReferenceCategory';
import { ReferenceIndex } from './components/reference/ReferenceIndex';
import { ReferencePage } from './components/reference/ReferencePage';
import {
  ENGLISH_CATEGORY_ROUTE,
  ENGLISH_HOME,
  ENGLISH_REFERENCE_ROUTE,
} from './reference-routes';
import { VIEW_PATHS } from './view-routes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {Object.values(VIEW_PATHS).map((path) => (
        <Route key={path} path={path} element={<Home />} />
      ))}
      <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
      <Route path={ENGLISH_HOME} element={<ReferenceIndex />} />
      <Route path={ENGLISH_CATEGORY_ROUTE} element={<ReferenceCategory />} />
      <Route path={ENGLISH_REFERENCE_ROUTE} element={<ReferencePage />} />
    </Routes>
  );
}

export default App;

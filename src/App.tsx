import { Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { KnowledgeDetail } from './components/KnowledgeDetail';
import { ReferenceIndex } from './components/reference/ReferenceIndex';
import { ReferencePage } from './components/reference/ReferencePage';
import { VIEW_PATHS } from './view-routes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {Object.values(VIEW_PATHS).map((path) => (
        <Route key={path} path={path} element={<Home />} />
      ))}
      <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
      <Route path="/en" element={<ReferenceIndex />} />
      <Route path="/en/reference/:slug" element={<ReferencePage />} />
    </Routes>
  );
}

export default App;

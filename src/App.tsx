import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { KnowledgeDetail } from './components/KnowledgeDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
    </Routes>
  );
}

export default App;

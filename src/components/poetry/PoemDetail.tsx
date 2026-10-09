import { Link, useParams } from 'react-router-dom';
import { getPoemById } from '../../data/poems';
import { PoemContent } from './PoemContent';

export function PoemDetail() {
  const { id } = useParams<{ id: string }>();
  const poem = id ? getPoemById(id) : undefined;

  if (!poem) {
    return <NotFound />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F0F1F2]">
      <div className="px-4 sm:px-6 pt-6">
        <Link
          to="/poetry"
          className="inline-flex items-center text-[#646A73] hover:text-[#1F2329] transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回诗词列表
        </Link>
      </div>
      <PoemContent poem={poem} />
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
      <div className="text-6xl grayscale opacity-30">📜</div>
      <h1 className="text-2xl font-bold text-[#1F2329]">未找到这首诗</h1>
      <p className="text-sm text-[#646A73]">这首诗可能尚未收录，或链接已失效。</p>
      <Link to="/poetry" className="inline-block text-[#3370FF] hover:underline">
        返回诗词列表
      </Link>
    </div>
  );
}
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPoemById } from '../../data/poems';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { pathForView } from '../../view-routes';
import { PoemContent } from './PoemContent';
import { Icon } from '../icons/Icon';

export function PoemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const poem = id ? getPoemById(id) : undefined;

  const openView = (view: Parameters<typeof pathForView>[0]) => navigate(pathForView(view));

  if (!poem) {
    return <NotFound onNavigate={openView} />;
  }

  return (
    <div className="page-shell">
      <Header activeView="poetry" onViewChange={openView} />
      <main id="main" tabIndex={-1} className="page-main">
        <div className="container-page py-8">
          <div className="mx-auto w-full max-w-[68ch]">
            <Link to="/poetry" className="btn btn-ghost -ml-2 inline-flex items-center gap-1">
              <Icon name="arrow-left" className="h-4 w-4" />
              返回诗词列表
            </Link>
            <PoemContent poem={poem} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function NotFound({ onNavigate }: { onNavigate: (view: Parameters<typeof pathForView>[0]) => void }) {
  return (
    <div className="page-shell">
      <Header activeView="poetry" onViewChange={onNavigate} />
      <main id="main" tabIndex={-1} className="page-main">
        <div className="container-page py-16">
          <div className="empty-state">
            <Icon name="scroll" className="h-10 w-10 text-ink-3" />
            <h1 className="text-section font-semibold text-ink">未找到这首诗</h1>
            <p className="text-body-s text-ink-2">这首诗可能尚未收录，或链接已失效。</p>
            <Link to="/poetry" className="btn btn-secondary">
              返回诗词列表
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

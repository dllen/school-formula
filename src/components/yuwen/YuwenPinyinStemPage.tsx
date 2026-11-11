// src/components/yuwen/YuwenPinyinStemPage.tsx
import { Link, useParams } from 'react-router-dom';
import { stemByStem } from '../../data/yuwen';
import { charPath, pinyinPath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

export function YuwenPinyinStemPage() {
  const { stem: stemParam } = useParams();
  const stem = stemParam ? stemByStem(stemParam) : undefined;

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> ›{' '}
        <Link to={pinyinPath()}>拼音表</Link> › {stemParam}
      </p>

      {!stem ? (
        <div className="empty-state">
          <p>没有这个韵母。</p>
          <Link className="btn btn-primary" to={pinyinPath()}>
            回到拼音表
          </Link>
        </div>
      ) : (
        <>
          <div className="page-head">
            <h1 className="page-title">{stem.stem}</h1>
          </div>
          {stem.rows.map((row) => (
            <section key={row.py} className="yuwen-section">
              <h2 className="section-head">{row.py}</h2>
              <div className="yuwen-units">
                {row.chars.map((ch) => (
                  <Link key={ch} className="chip" to={charPath(ch)}>
                    {ch}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </YuwenPageShell>
  );
}

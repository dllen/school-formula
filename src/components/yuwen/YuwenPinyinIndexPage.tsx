// src/components/yuwen/YuwenPinyinIndexPage.tsx
import { Link } from 'react-router-dom';
import { YUWEN_STEMS } from '../../data/yuwen';
import { pinyinPath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

export function YuwenPinyinIndexPage() {
  const charCount = YUWEN_STEMS.reduce(
    (sum, stem) => sum + stem.rows.reduce((s, row) => s + row.chars.length, 0),
    0,
  );

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> › 拼音表
      </p>
      <div className="page-head">
        <h1 className="page-title">拼音表</h1>
        <p className="page-lead">
          按韵母与声调排列的全部生字，共 {YUWEN_STEMS.length} 个韵母条目、{charCount} 个字次。
        </p>
      </div>
      <div className="yuwen-units">
        {YUWEN_STEMS.map((stem) => (
          <Link key={stem.stem} className="chip" to={pinyinPath(stem.stem)}>
            {stem.stem}
          </Link>
        ))}
      </div>
    </YuwenPageShell>
  );
}

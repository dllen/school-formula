// src/components/yuwen/YuwenTingxiePage.tsx
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { YUWEN_LESSONS, bookById, charByChar, unitOf } from '../../data/yuwen';
import { reviewPath } from '../../yuwen/paths';
import { deterministicShuffle } from './tingxie-shuffle';
import { YuwenPageShell } from './YuwenPageShell';

interface TingxieChar {
  ch: string;
  py: string;
  word?: string;
}

export function YuwenTingxiePage() {
  const { bookId, unitNo } = useParams();
  const [params, setParams] = useSearchParams();
  const book = bookId ? bookById(bookId) : undefined;
  const no = Number(unitNo);
  const unit = book ? unitOf(book.id, no) : undefined;

  const shuffle = params.get('shuffle') === '1';
  const hint = params.get('hint') === '1';
  const withAnswers = params.get('answers') !== '0';

  const lessons =
    unit && book ? YUWEN_LESSONS.filter((l) => l.bookId === book.id && l.unitNo === no) : [];

  const items: TingxieChar[] = [];
  const seen = new Set<string>();
  for (const lesson of lessons) {
    for (const ch of lesson.chars) {
      if (seen.has(ch)) continue;
      seen.add(ch);
      const info = charByChar(ch);
      const py = info?.readings[0]?.py ?? '';
      const word = info?.words[0];
      items.push(word ? { ch, py, word } : { ch, py });
    }
  }
  const ordered = shuffle ? deterministicShuffle(items) : items;

  const setFlag = (key: string, value: boolean) => {
    const next = new URLSearchParams(params);
    if (key === 'answers') {
      if (value) next.delete('answers');
      else next.set('answers', '0');
    } else if (value) {
      next.set(key, '1');
    } else {
      next.delete(key);
    }
    setParams(next, { replace: true });
  };

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> ›{' '}
        {book ? <Link to={'/yuwen/book/' + book.id}>{book.title}</Link> : null} ›{' '}
        {book && unit ? <Link to={reviewPath(book.id, no)}>第 {no} 单元复习</Link> : null} › 听写单
      </p>

      {!book || !unit ? (
        <div className="empty-state">
          <p>没有这个单元。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="tx-controls">
            <label>
              顺序{' '}
              <select value={shuffle ? '1' : '0'} onChange={(event) => setFlag('shuffle', event.target.value === '1')}>
                <option value="0">课本顺序</option>
                <option value="1">打乱</option>
              </select>
            </label>
            <label>
              提示{' '}
              <select value={hint ? '1' : '0'} onChange={(event) => setFlag('hint', event.target.value === '1')}>
                <option value="0">只给拼音</option>
                <option value="1">拼音和词语</option>
              </select>
            </label>
            <label>
              答案{' '}
              <select value={withAnswers ? '1' : '0'} onChange={(event) => setFlag('answers', event.target.value === '1')}>
                <option value="1">另页附答案</option>
                <option value="0">不附答案</option>
              </select>
            </label>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              打印
            </button>
          </div>

          <div className="tx-sheet">
            <h1 className="page-title">听写单</h1>
            <p className="text-ink-3 text-sm">
              {book.title} · 第 {no} 单元 · 共 {ordered.length} 个字
            </p>
            <p className="tx-py">{'姓名＿＿＿＿　日期＿＿＿＿　得分＿＿＿＿'}</p>
            <ol className="tx-grid">
              {ordered.map((item, index) => (
                <li key={item.ch} className="tx-item">
                  <span className="tx-py">
                    {index + 1}. {item.py}
                  </span>
                  {hint && item.word ? (
                    <span className="tx-py" title={'提示：' + item.word}>
                      {item.word}
                    </span>
                  ) : null}
                  <span className="tx-box" />
                </li>
              ))}
            </ol>
          </div>

          {withAnswers ? (
            <section className="tx-answers yuwen-section">
              <h2 className="section-head">答案</h2>
              <ol className="tx-key">
                {ordered.map((item, index) => (
                  <li key={item.ch}>
                    {index + 1}. <strong>{item.ch}</strong> <span className="text-ink-3">{item.py}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </>
      )}
    </YuwenPageShell>
  );
}

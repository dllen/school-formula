// src/components/yuwen/YuwenIndexPage.tsx
import { Link } from 'react-router-dom';
import { YUWEN_BOOKS } from '../../data/yuwen';
import { bookPath, duoyinPath, pinyinPath, reviewPath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

export function YuwenIndexPage() {
  return (
    <YuwenPageShell>
      <div className="page-head">
        <p className="breadcrumb">
          <Link to="/">首页</Link> › 小学语文
        </p>
        <h1 className="page-title">人教版小学语文 · 生字</h1>
        <p className="page-lead">按课文学生字：读音、同音字、形近字和组词，只用学过的字。</p>
      </div>

      <div className="yuwen-units yuwen-tools">
        <Link className="btn btn-secondary" to={pinyinPath()}>
          拼音表
        </Link>
        <Link className="btn btn-secondary" to={duoyinPath()}>
          多音字
        </Link>
      </div>

      <div className="yuwen-book-grid">
        {YUWEN_BOOKS.map((book) => (
          <section key={book.id} className="yuwen-book-card">
            <h2 className="section-head">
              <Link to={bookPath(book.id)}>{book.title}</Link>
            </h2>
            <p className="text-ink-3 text-sm">
              {book.lessonCount} 课 · {book.charCount} 个生字
            </p>
            <p className="yuwen-label">单元生字复习</p>
            <div className="yuwen-units">
              {book.units.map((unit) => (
                <Link key={unit.no} className="btn btn-secondary" to={reviewPath(book.id, unit.no)}>
                  {unit.no}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="yuwen-source">
        生字与课文数据来源：<a href="http://yuwen.muduo.org/">yuwen.muduo.org</a>（人教版小学语文）
      </p>
    </YuwenPageShell>
  );
}

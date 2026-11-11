// src/components/yuwen/YuwenReviewPage.tsx
import { Link, useParams } from 'react-router-dom';
import { YUWEN_LESSONS, bookById, charByChar, unitOf } from '../../data/yuwen';
import { lessonPath, tingxiePath } from '../../yuwen/paths';
import { PinyinToggle } from './PinyinToggle';
import { YuwenPageShell } from './YuwenPageShell';
import { ZiGrid } from './ZiGrid';

export function YuwenReviewPage() {
  const { bookId, unitNo } = useParams();
  const book = bookId ? bookById(bookId) : undefined;
  const no = Number(unitNo);
  const unit = book ? unitOf(book.id, no) : undefined;
  const lessons =
    unit && book ? YUWEN_LESSONS.filter((l) => l.bookId === book.id && l.unitNo === no) : [];

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> ›{' '}
        {book ? <Link to={'/yuwen/book/' + book.id}>{book.title}</Link> : null} › 第 {unitNo} 单元
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
          <div className="page-head">
            <h1 className="page-title">生字复习</h1>
            <p className="page-lead">
              {book.title} · 第 {no} 单元（共 {unit.chars.length} 个生字）
            </p>
          </div>

          <div className="yuwen-units yuwen-tools">
            <Link className="btn btn-primary" to={tingxiePath(book.id, no)}>
              打印听写单
            </Link>
            <PinyinToggle />
          </div>

          {lessons.map((lesson) => (
            <section key={lesson.id} className="yuwen-section">
              <h2 className="section-head">
                <Link to={lessonPath(lesson.id)}>{lesson.title}</Link>
              </h2>
              <ZiGrid
                size="lg"
                items={lesson.chars.map((ch) => ({
                  ch,
                  py: charByChar(ch)?.readings[0]?.py,
                }))}
              />
            </section>
          ))}
        </>
      )}
    </YuwenPageShell>
  );
}

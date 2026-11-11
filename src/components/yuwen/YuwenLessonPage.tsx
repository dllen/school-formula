// src/components/yuwen/YuwenLessonPage.tsx
import { Link, useParams } from 'react-router-dom';
import { YUWEN_LESSONS, bookById, charByChar, lessonById } from '../../data/yuwen';
import { charPath, lessonPath, reviewPath, tingxiePath } from '../../yuwen/paths';
import { PinyinToggle } from './PinyinToggle';
import { WordList } from './WordList';
import { YuwenPageShell } from './YuwenPageShell';
import { ZiGrid } from './ZiGrid';

export function YuwenLessonPage() {
  const { lessonId } = useParams();
  const lesson = lessonId ? lessonById(lessonId) : undefined;
  const book = lesson ? bookById(lesson.bookId) : undefined;

  const siblings = lesson ? YUWEN_LESSONS.filter((l) => l.bookId === lesson.bookId) : [];
  const index = lesson ? siblings.findIndex((l) => l.id === lesson.id) : -1;
  const prev = index > 0 ? siblings[index - 1] : undefined;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined;

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> ›{' '}
        {book ? <Link to={'/yuwen/book/' + book.id}>{book.title}</Link> : null} ›{' '}
        {lesson ? lesson.title : '未找到'}
      </p>

      {!lesson || !book ? (
        <div className="empty-state">
          <p>没有这一课。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="page-head">
            <h1 className="page-title">{lesson.title}</h1>
            <p className="page-lead">
              {book.title} · 第 {lesson.unitNo} 单元 · 本课 {lesson.chars.length} 个生字
            </p>
          </div>

          <div className="yuwen-units yuwen-tools">
            <Link className="btn btn-secondary" to={tingxiePath(book.id, lesson.unitNo)}>
              听写单
            </Link>
            <Link className="btn btn-secondary" to={reviewPath(book.id, lesson.unitNo)}>
              本单元生字复习
            </Link>
            <PinyinToggle />
          </div>

          <section className="yuwen-section">
            <h2 className="section-head">本课生字</h2>
            <ZiGrid
              size="lg"
              items={lesson.chars.map((ch) => ({
                ch,
                py: charByChar(ch)?.readings[0]?.py,
              }))}
            />
          </section>

          <section className="yuwen-section">
            <h2 className="section-head">组词</h2>
            {lesson.chars.map((ch) => (
              <div key={ch} className="word-row">
                <Link className="chip" to={charPath(ch)}>
                  {ch}
                </Link>
                <WordList words={charByChar(ch)?.words ?? []} />
              </div>
            ))}
          </section>

          <nav className="pager" aria-label="课文翻页">
            {prev ? <Link to={lessonPath(prev.id)}>‹ 上一课：{prev.title}</Link> : <span />}
            {next ? <Link to={lessonPath(next.id)}>下一课：{next.title} ›</Link> : <span />}
          </nav>
        </>
      )}
    </YuwenPageShell>
  );
}

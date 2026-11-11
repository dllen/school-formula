// src/components/yuwen/YuwenBookPage.tsx
import { Link, useParams } from 'react-router-dom';
import type { YuwenLesson } from '../../data/yuwen';
import { bookById, lessonById } from '../../data/yuwen';
import { lessonPath, reviewPath, tingxiePath } from '../../yuwen/paths';
import { YuwenPageShell } from './YuwenPageShell';

function lessonsOf(ids: string[]): YuwenLesson[] {
  const out: YuwenLesson[] = [];
  for (const id of ids) {
    const lesson = lessonById(id);
    if (lesson) out.push(lesson);
  }
  return out;
}

export function YuwenBookPage() {
  const { bookId } = useParams();
  const book = bookId ? bookById(bookId) : undefined;

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> › {book ? book.title : '未找到'}
      </p>

      {!book ? (
        <div className="empty-state">
          <p>没有这册课本。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="page-head">
            <h1 className="page-title">{book.title}</h1>
            <p className="page-lead">
              {book.lessonCount} 课 · {book.charCount} 个生字
            </p>
          </div>

          {book.units.map((unit) => {
            const lessons = lessonsOf(unit.lessonIds);
            return (
              <section key={unit.no} className="section">
                <div className="section-head">
                  <h2>第 {unit.no} 单元</h2>
                  <div className="yuwen-units">
                    <Link className="btn btn-secondary" to={reviewPath(book.id, unit.no)}>
                      生字复习
                    </Link>
                    <Link className="btn btn-secondary" to={tingxiePath(book.id, unit.no)}>
                      听写单
                    </Link>
                  </div>
                </div>
                <ul className="lesson-list">
                  {lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <Link to={lessonPath(lesson.id)}>
                        <span className="lesson-list__title">{lesson.title}</span>
                        <span className="lesson-list__preview">{lesson.preview}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </>
      )}
    </YuwenPageShell>
  );
}

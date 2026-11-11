// src/components/yuwen/YuwenDuoyinPage.tsx
import { Link } from 'react-router-dom';
import { YUWEN_DUOYIN, lessonById } from '../../data/yuwen';
import { charPath, lessonPath } from '../../yuwen/paths';
import { SpeakButton } from './SpeakButton';
import { WordList } from './WordList';
import { YuwenPageShell } from './YuwenPageShell';

export function YuwenDuoyinPage() {
  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> › 多音字
      </p>
      <div className="page-head">
        <h1 className="page-title">多音字</h1>
        <p className="page-lead">
          共 {YUWEN_DUOYIN.length} 个多音字。每个读音后面是这个读音的词。
        </p>
      </div>

      {YUWEN_DUOYIN.map((entry) => (
        <section key={entry.ch} className="yuwen-section">
          <h2 className="section-head">
            <Link className="chip" to={charPath(entry.ch)}>
              {entry.ch}
            </Link>
          </h2>
          {entry.readings.map((reading) => {
            const lesson = reading.lessonId ? lessonById(reading.lessonId) : undefined;
            return (
              <div key={reading.py} className="yuwen-reading">
                <p>
                  <span className="chip">{reading.py}</span>
                  <SpeakButton text={reading.words[0] ?? entry.ch} />
                  {lesson ? (
                    <span className="text-ink-3 text-sm">
                      {' '}
                      学于 <Link to={lessonPath(lesson.id)}>{lesson.title}</Link>
                    </span>
                  ) : null}
                </p>
                <WordList words={reading.words} emptyLabel="这一读音暂无词" />
              </div>
            );
          })}
        </section>
      ))}
    </YuwenPageShell>
  );
}

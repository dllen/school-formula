// src/components/yuwen/YuwenCharPage.tsx
import { Link, useParams } from 'react-router-dom';
import type { YuwenRadical } from '../../data/yuwen';
import { YUWEN_RADICALS, charByChar, homophonesOf, lessonById } from '../../data/yuwen';
import { lessonPath } from '../../yuwen/paths';
import { BishunSection } from './BishunSection';
import { CharChips } from './CharChips';
import { SpeakButton } from './SpeakButton';
import { WordList } from './WordList';
import { YuwenPageShell } from './YuwenPageShell';

function radicalOf(name: string): YuwenRadical | undefined {
  return YUWEN_RADICALS.find((radical) => radical.name === name);
}

export function YuwenCharPage() {
  const { ch } = useParams();
  const item = ch ? charByChar(ch) : undefined;

  return (
    <YuwenPageShell>
      <p className="breadcrumb">
        <Link to="/">首页</Link> › <Link to="/yuwen">小学语文</Link> › {item ? item.ch : '未找到'}
      </p>

      {!item ? (
        <div className="empty-state">
          <p>没有这个字。</p>
          <Link className="btn btn-primary" to="/yuwen">
            回到小学语文
          </Link>
        </div>
      ) : (
        <>
          <div className="yuwen-hero">
            <span className="yuwen-hero__ch">{item.ch}</span>
            <div>
              <p className="yuwen-hero__py">{item.readings.map((reading) => reading.py).join(' · ')}</p>
              {item.readings.length > 1 ? <p className="text-ink-3 text-sm">多音字</p> : null}
            </div>
          </div>

          <BishunSection ch={item.ch} />

          <section className="yuwen-section">
            <h2 className="section-head">读音</h2>
            {item.readings.map((reading) => {
              const lesson = reading.lessonId ? lessonById(reading.lessonId) : undefined;
              return (
                <div key={reading.py} className="yuwen-reading">
                  <p>
                    <Link className="chip" to={'/yuwen/pinyin/' + reading.stem}>
                      {reading.py}
                    </Link>
                    <SpeakButton text={reading.words[0] ?? item.ch} />
                    {lesson ? (
                      <span className="text-ink-3 text-sm">
                        {' '}
                        学于 <Link to={lessonPath(lesson.id)}>{lesson.title}</Link>
                      </span>
                    ) : null}
                  </p>
                  <WordList words={reading.words} emptyLabel="这一读音暂无词" />
                  {homophonesOf(item.ch, reading.py).length ? (
                    <>
                      <p className="yuwen-label">同音字</p>
                      <CharChips chars={homophonesOf(item.ch, reading.py)} current={item.ch} />
                    </>
                  ) : null}
                </div>
              );
            })}
          </section>

          {item.radicals.length ? (
            <section className="yuwen-section">
              <h2 className="section-head">字形</h2>
              {item.radicals.map((name) => {
                const radical = radicalOf(name);
                if (!radical) return null;
                return (
                  <div key={name} className="yuwen-reading">
                    <p className="yuwen-label">
                      含 <Link to={'/yuwen/char/' + encodeURIComponent(name)}>{name}</Link>
                      {radical.label ? '（' + radical.label + '）' : ''} 的字
                    </p>
                    <CharChips chars={radical.chars} current={item.ch} />
                  </div>
                );
              })}
            </section>
          ) : null}

          <section className="yuwen-section">
            <h2 className="section-head">组词</h2>
            <WordList words={item.words} />
          </section>
        </>
      )}
    </YuwenPageShell>
  );
}

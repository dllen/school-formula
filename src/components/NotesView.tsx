import React, { useEffect, useMemo, useState } from 'react';
import { storageGet, storageSet } from '../utils/storage';
import { Icon } from './icons/Icon';

const STORAGE_KEY = 'school_formula_notes';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

function loadNotes(): Note[] {
  try {
    const raw = storageGet(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Note =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Note).id === 'string' &&
        typeof (item as Note).title === 'string' &&
        typeof (item as Note).content === 'string' &&
        typeof (item as Note).createdAt === 'number' &&
        typeof (item as Note).updatedAt === 'number',
    );
  } catch {
    return [];
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    storageSet(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
    [notes],
  );

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId
            ? { ...note, title: trimmedTitle, content: trimmedContent, updatedAt: Date.now() }
            : note,
        ),
      );
    } else {
      const now = Date.now();
      const newNote: Note = {
        id: `note-${now}-${Math.random().toString(36).slice(2, 8)}`,
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [...prev, newNote]);
    }
    resetForm();
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div>
      <div className="page-head">
        <div className="page-head__text">
          <h1 className="page-title">学习笔记</h1>
          <p className="page-lead">记录学习心得，数据保存在本地浏览器中</p>
        </div>
      </div>

      <section aria-label="写笔记">
        <form
          className="note-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="field">
            <label className="field__label" htmlFor="note-title">
              标题
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="笔记标题"
              className="input"
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="note-content">
              内容
            </label>
            <textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="记录你的学习心得、易错点或疑问……"
              rows={4}
              className="input"
            />
          </div>

          <div className="flex justify-end gap-3">
            {editingId && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                取消编辑
              </button>
            )}
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="btn btn-primary"
            >
              {editingId ? '保存修改' : '添加笔记'}
            </button>
          </div>
        </form>
      </section>

      <section className="section" aria-labelledby="notes-heading">
        <div className="index-head">
          <h2 id="notes-heading" className="index-title">
            笔记
          </h2>
          <span className="index-meta">共 {sortedNotes.length} 条笔记</span>
        </div>

        {sortedNotes.length > 0 ? (
          <ul className="note-list">
            {sortedNotes.map((note) => (
              <li key={note.id} className="note-row">
                <div className="min-w-0">
                  <h3 className="text-title font-semibold text-ink break-words">{note.title}</h3>
                  <p className="mt-0.5 text-caption text-ink-3">更新于 {formatTime(note.updatedAt)}</p>
                  <p className="mt-2 whitespace-pre-line text-body-s text-ink-2">{note.content}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => handleEdit(note)} className="btn btn-ghost">
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(note.id)}
                    className="btn btn-ghost text-error-ink"
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state mt-4">
            <Icon name="book" className="h-8 w-8" />
            <p className="text-body-s">还没有笔记</p>
            <p className="text-caption">在上方添加第一条学习笔记吧</p>
          </div>
        )}
      </section>
    </div>
  );
};

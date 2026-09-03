import React, { useEffect, useMemo, useState } from 'react';

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
    const raw = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">学习笔记</h2>
        <p className="text-sm text-gray-500">记录学习心得，数据保存在本地浏览器中</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="笔记标题"
          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-gray-700 placeholder:text-gray-400 focus:border-indigo-300"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="记录你的学习心得、易错点或疑问……"
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-gray-700 placeholder:text-gray-400 focus:border-indigo-300 resize-y"
        />
        <div className="flex justify-end gap-3">
          {editingId && (
            <button
              onClick={resetForm}
              className="px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all"
            >
              取消编辑
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingId ? '保存修改' : '添加笔记'}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        共 {sortedNotes.length} 条笔记
      </div>

      {sortedNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-full flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-lg font-bold text-gray-900 break-all">{note.title}</h3>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  更新于 {formatTime(note.updatedAt)}
                </p>
              </div>
              <div className="p-6 flex-1">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="text-6xl mb-4 grayscale opacity-30">📒</div>
          <p className="text-lg text-gray-400">还没有笔记</p>
          <p className="text-sm text-gray-400 mt-1">在上方添加第一条学习笔记吧</p>
        </div>
      )}
    </div>
  );
};

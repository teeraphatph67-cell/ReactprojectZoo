// ตัวอย่างแบบง่ายใน App.jsx
import { useEffect, useState } from 'react';
import { listTodos, createTodo, updateTodo, deleteTodo } from './api';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try { setLoading(true); setTodos(await listTodos()); setError(null); }
    catch (e) { setError(e.message || 'โหลดข้อมูลไม่ได้'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!title.trim()) return;
    try { await createTodo(title.trim()); setTitle(''); load(); }
    catch (e) { setError(e.message || 'เพิ่มไม่สำเร็จ'); }
  }

  return (
    <div className="min-h-dvh bg-gray-50 p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="เพิ่มงานใหม่…"
            onKeyDown={e => e.key === 'Enter' && add()}
          />
          <button onClick={add} className="rounded bg-gray-900 px-3 py-2 text-white">
            เพิ่ม
          </button>
        </div>

        {loading && <div className="text-sm text-gray-500">กำลังโหลด…</div>}
        {error && <div className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{error}</div>}

        <ul className="space-y-2">
          {todos.map(t => (
            <li key={t.id} className="flex items-center justify-between rounded border bg-white p-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => updateTodo(t.id, { completed: !t.completed }).then(load)}
                />
                <span className={t.completed ? 'line-through text-gray-400' : ''}>{t.title}</span>
              </label>
              <button onClick={() => deleteTodo(t.id).then(load)} className="text-xs text-red-600 hover:underline">
                ลบ
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const fetchProjects = async () => { const res = await fetch('/api/projects'); setProjects(await res.json()); };
  const addProject = async (e: React.FormEvent) => { e.preventDefault(); await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, category: 'design', tags: [], link: '#' }) }); setTitle(''); fetchProjects(); };
  useEffect(() => { fetchProjects(); }, []);
  return (<div className="p-6 text-white"><h1 className="text-2xl font-bold mb-4">المشاريع</h1><form onSubmit={addProject} className="mb-6 flex gap-2"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان المشروع" className="p-2 bg-black/50 rounded flex-1" /><button type="submit" className="bg-indigo-600 px-4 py-2 rounded">إضافة</button></form><ul>{projects.map(p=><li key={p._id} className="border-b py-2">{p.title}</li>)}</ul></div>);
}

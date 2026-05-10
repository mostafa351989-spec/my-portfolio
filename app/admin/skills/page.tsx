'use client';
import { useEffect, useState } from 'react';
export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState('');
  const fetchSkills = async () => { const res = await fetch('/api/skills'); setSkills(await res.json()); };
  const addSkill = async (e) => { e.preventDefault(); await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) }); setName(''); fetchSkills(); };
  useEffect(() => { fetchSkills(); }, []);
  return (<div className="p-6 text-white"><h1 className="text-2xl font-bold mb-4">المهارات</h1><form onSubmit={addSkill} className="mb-6 flex gap-2"><input value={name} onChange={e=>setName(e.target.value)} placeholder="اسم المهارة" className="p-2 bg-black/50 rounded flex-1" /><button type="submit" className="bg-indigo-600 px-4 py-2 rounded">إضافة</button></form><div className="flex flex-wrap gap-2">{skills.map(s=><span key={s._id} className="px-3 py-1 bg-white/10 rounded">{s.name}</span>)}</div></div>);
}

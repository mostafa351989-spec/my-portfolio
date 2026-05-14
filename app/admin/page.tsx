'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, skills: 0 });
  useEffect(() => { fetch('/api/stats').then(r=>r.json()).then(setStats); }, []);
  return (<div className="p-6 text-white"><h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="bg-white/10 p-6 rounded-xl"><h2 className="text-2xl font-bold text-indigo-400">{stats.projects}</h2><p>المشاريع</p><Link href="/admin/projects" className="text-sm text-indigo-300 mt-2 block">إدارة</Link></div><div className="bg-white/10 p-6 rounded-xl"><h2 className="text-2xl font-bold text-indigo-400">{stats.messages}</h2><p>الرسائل</p><Link href="/admin/messages" className="text-sm text-indigo-300 mt-2 block">عرض</Link></div><div className="bg-white/10 p-6 rounded-xl"><h2 className="text-2xl font-bold text-indigo-400">{stats.skills}</h2><p>المهارات</p><Link href="/admin/skills" className="text-sm text-indigo-300 mt-2 block">إدارة</Link></div></div></div>);
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

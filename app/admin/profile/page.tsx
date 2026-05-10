'use client';
import { useEffect, useState } from 'react';
export default function AdminProfile() {
  const [profile, setProfile] = useState({ name: 'مصطفى محمود عيسى', title: 'مصمم مواقع', whatsapp: '01044907363' });
  useEffect(() => { fetch('/api/profile').then(r=>r.json()).then(setProfile); }, []);
  const update = async (e) => { e.preventDefault(); await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) }); alert('تم التحديث'); };
  return (<div className="p-6 text-white"><h1 className="text-2xl font-bold mb-4">الملف الشخصي</h1><form onSubmit={update} className="space-y-4"><input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} className="w-full p-2 bg-black/50 rounded" /><input value={profile.title} onChange={e=>setProfile({...profile,title:e.target.value})} className="w-full p-2 bg-black/50 rounded" /><input value={profile.whatsapp} onChange={e=>setProfile({...profile,whatsapp:e.target.value})} className="w-full p-2 bg-black/50 rounded" /><button type="submit" className="bg-indigo-600 px-6 py-2 rounded">حفظ</button></form></div>);
}

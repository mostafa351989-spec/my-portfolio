import { MongoClient } from 'mongodb';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
async function getSkills() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const skills = await client.db().collection('skills').find().toArray();
    client.close();
    return skills.map(s => ({_id: s._id.toString(), name: s.name || '', level: s.level || 0}));
  } catch { return []; }
}
export default async function SkillsPage() {
  const skills = await getSkills();
  return <div className="p-8 bg-black min-h-screen text-white"><div className="flex justify-between mb-6"><h1 className="text-2xl font-bold">المهارات</h1><Link href="/admin/skills/new" className="bg-white text-black px-4 py-2 rounded">+ إضافة</Link></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{skills.map(s => <div key={s._id} className="bg-zinc-900 p-4 rounded-xl text-center"><div className="font-bold">{s.name}</div><div className="text-sm text-zinc-400">{s.level}%</div></div>)}</div></div>
}

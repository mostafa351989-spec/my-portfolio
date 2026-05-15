import { MongoClient } from 'mongodb';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db();
    const projects = await db.collection('projects').countDocuments();
    const messages = await db.collection('messages').countDocuments();
    const skills = await db.collection('skills').countDocuments();
    await client.close();
    return { projects, messages, skills };
  } catch (e) {
    return { projects: 0, messages: 0, skills: 0 };
  }
}

export default async function AdminDashboard() {
  const { projects, messages, skills } = await getStats();
  const stats = [
    { label: 'المشاريع', value: projects, href: '/admin/projects' },
    { label: 'المهارات', value: skills, href: '/admin/skills' },
    { label: 'الرسائل', value: messages, href: '/admin/messages' },
  ];

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800 border border-zinc-800">
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-zinc-400 text-sm mt-1">{s.label}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

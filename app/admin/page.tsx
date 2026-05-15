import { MongoClient } from 'mongodb';
import Link from 'next/link';

async function getStats() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();
  const projects = await db.collection('projects').countDocuments();
  const messages = await db.collection('messages').countDocuments();
  const skills = await db.collection('skills').countDocuments();
  client.close();
  return { projects, messages, skills };
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <form action="/api/logout" method="POST">
          <button className="bg-zinc-800 px-4 py-2 rounded text-sm">تسجيل خروج</button>
        </form>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="bg-zinc-900 p-6 rounded-xl hover:bg-zinc-800">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-zinc-400 text-sm">{s.label}</div>
          </Link>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="font-bold mb-4">إجراءات سريعة</h2>
          <div className="space-y-2">
            <Link href="/admin/projects/new" className="block bg-white text-black px-4 py-2 rounded text-center">+ مشروع جديد</Link>
            <Link href="/admin/skills/new" className="block bg-zinc-800 px-4 py-2 rounded text-center">+ مهارة جديدة</Link>
          </div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl">
          <h2 className="font-bold mb-4">روابط سريعة</h2>
          <div className="space-y-2 text-sm">
            <Link href="/admin/profile" className="block text-zinc-400 hover:text-white">تعديل البروفايل</Link>
            <a href="/" target="_blank" className="block text-zinc-400 hover:text-white">عرض الموقع</a>
          </div>
        </div>
      </div>
    </div>
  )
}

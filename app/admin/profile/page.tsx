import { MongoClient } from 'mongodb';
export const dynamic = 'force-dynamic';
async function getProfile() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const profile = await client.db().collection('profile').findOne({});
    client.close();
    return { name: profile?.name || '', title: profile?.title || '', bio: profile?.bio || '', github: profile?.github || '', linkedin: profile?.linkedin || '' };
  } catch { return { name: '', title: '', bio: '', github: '', linkedin: '' }; }
}
export default async function ProfilePage() {
  const p = await getProfile();
  return <div className="p-8 bg-black min-h-screen text-white max-w-2xl mx-auto"><h1 className="text-2xl font-bold mb-6">البروفايل</h1><form action="/api/profile" method="POST" className="space-y-4"><input name="name" defaultValue={p.name} placeholder="الاسم" className="w-full p-3 bg-zinc-900 rounded"/><input name="title" defaultValue={p.title} placeholder="المسمى" className="w-full p-3 bg-zinc-900 rounded"/><textarea name="bio" defaultValue={p.bio} placeholder="نبذة" className="w-full p-3 bg-zinc-900 rounded h-32"/><button className="bg-white text-black px-6 py-3 rounded font-bold w-full">حفظ</button></form></div>
}

import { MongoClient } from 'mongodb';

async function getProfile() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const profile = await client.db().collection('profile').findOne({});
  client.close();
  return profile;
}

export default async function ProfilePage() {
  const profile = await getProfile() || {};
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل البروفايل</h1>
      <form action="/api/profile" method="POST" className="space-y-4">
        <input name="name" defaultValue={profile.name} placeholder="الاسم" className="w-full p-3 bg-zinc-900 rounded" />
        <input name="title" defaultValue={profile.title} placeholder="المسمى الوظيفي" className="w-full p-3 bg-zinc-900 rounded" />
        <textarea name="bio" defaultValue={profile.bio} placeholder="نبذة عنك" className="w-full p-3 bg-zinc-900 rounded h-32" />
        <input name="github" defaultValue={profile.github} placeholder="GitHub" className="w-full p-3 bg-zinc-900 rounded" />
        <input name="linkedin" defaultValue={profile.linkedin} placeholder="LinkedIn" className="w-full p-3 bg-zinc-900 rounded" />
        <button className="bg-white text-black px-6 py-3 rounded font-bold w-full">حفظ التعديلات</button>
      </form>
    </div>
  )
}

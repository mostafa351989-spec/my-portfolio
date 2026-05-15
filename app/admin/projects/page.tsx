import { MongoClient } from 'mongodb';
import Link from 'next/link';
import { ObjectId } from 'mongodb';

async function getProjects() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const projects = await client.db().collection('projects').find().sort({createdAt:-1}).toArray();
  client.close();
  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المشاريع</h1>
        <Link href="/admin/projects/new" className="bg-white text-black px-4 py-2 rounded">+ إضافة</Link>
      </div>
      {projects.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-xl text-center text-zinc-500">مفيش مشاريع لسه</div>
      ) : (
        <div className="space-y-3">
          {projects.map((p:any) => (
            <div key={p._id} className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center">
              <div>
                <div className="font-bold">{p.title}</div>
                <div className="text-sm text-zinc-400">{p.tech?.join(', ')}</div>
              </div>
              <div className="flex gap-3">
                <Link href={`/admin/projects/${p._id}/edit`} className="text-blue-400 text-sm">تعديل</Link>
                <form action={`/api/projects/${p._id}`} method="POST">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button className="text-red-400 text-sm">حذف</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

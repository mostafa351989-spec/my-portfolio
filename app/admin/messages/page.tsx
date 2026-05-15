import { MongoClient } from 'mongodb';

async function getMessages(filter: string) {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const query = filter === 'unread' ? { read: { $ne: true } } : {};
  const msgs = await client.db().collection('messages').find(query).sort({createdAt:-1}).toArray();
  client.close();
  return msgs;
}

export default async function Messages({ searchParams }: { searchParams: { filter?: string } }) {
  const filter = searchParams.filter || 'all';
  const messages = await getMessages(filter);
  
  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الرسائل ({messages.length})</h1>
        <div className="flex gap-2 text-sm">
          <a href="/admin/messages" className={`px-3 py-1 rounded ${filter==='all'?'bg-white text-black':'bg-zinc-800'}`}>الكل</a>
          <a href="/admin/messages?filter=unread" className={`px-3 py-1 rounded ${filter==='unread'?'bg-white text-black':'bg-zinc-800'}`}>غير مقروء</a>
        </div>
      </div>
      <div className="space-y-3">
        {messages.map((m:any)=>(
          <div key={m._id} className={`bg-zinc-900 p-4 rounded-xl ${!m.read ? 'border border-blue-500' : ''}`}>
            <div className="flex justify-between mb-2">
              <strong>{m.name} {!m.read && <span className="text-blue-500 text-xs">جديد</span>}</strong>
              <span className="text-zinc-500 text-xs">{new Date(m.createdAt).toLocaleString('ar-EG')}</span>
            </div>
            <a href={`mailto:${m.email}`} className="text-blue-400 text-sm">{m.email}</a>
            <p className="mt-2 text-zinc-300">{m.message}</p>
            {!m.read && (
              <form action={`/api/messages/${m._id}/read`} method="POST" className="mt-3">
                <button className="text-xs bg-zinc-800 px-3 py-1 rounded">تحديد كمقروء</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

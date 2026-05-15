import { MongoClient } from 'mongodb';
export const dynamic = 'force-dynamic';
async function getMessages() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const msgs = await client.db().collection('messages').find().sort({createdAt:-1}).toArray();
    client.close();
    return msgs.map(m => ({_id: m._id.toString(), name: m.name || '', email: m.email || '', message: m.message || ''}));
  } catch { return []; }
}
export default async function Messages() {
  const messages = await getMessages();
  return <div className="p-8 bg-black min-h-screen text-white"><h1 className="text-2xl font-bold mb-6">الرسائل ({messages.length})</h1><div className="space-y-3">{messages.map(m => <div key={m._id} className="bg-zinc-900 p-4 rounded-xl"><strong>{m.name}</strong><p className="text-zinc-300 mt-2">{m.message}</p></div>)}</div></div>
}

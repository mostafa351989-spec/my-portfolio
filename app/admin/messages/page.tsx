'use client';
import { useEffect, useState } from 'react';
export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  useEffect(() => { fetch('/api/messages').then(r=>r.json()).then(setMessages); }, []);
  return (<div className="p-6 text-white"><h1 className="text-2xl font-bold mb-4">الرسائل</h1><ul>{messages.map(m=><li key={m._id} className="border-b py-2"><strong>{m.email}</strong><p>{m.message}</p></li>)}</ul></div>);
}

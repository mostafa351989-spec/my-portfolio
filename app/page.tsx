'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

const skills = ['Next.js', 'Tailwind CSS', 'Three.js', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'UI/UX'];
const projects = [
  { title: 'منصة تسوق إلكتروني', category: 'design', link: '#' },
  { title: 'عالم ثلاثي الأبعاد تفاعلي', category: '3d', link: '#' },
  { title: 'لوحة تحكم إدارة', category: 'ui', link: '#' },
  { title: 'موقع شخصي بتأثيرات GSAP', category: 'design', link: '#' },
];

export default function Home() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <main className="relative z-10 text-white p-6 md:p-16 max-w-6xl mx-auto bg-black min-h-screen">
      <section className="mb-20 text-center md:text-right">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">مصطفى محمود عيسى</h1>
        <p className="text-xl md:text-2xl mt-2 text-gray-300">مصمم مواقع - ثلاثي الأبعاد</p>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto md:mx-0">أحوِّل الأفكار إلى تجارب بصرية تفاعلية باستخدام أحدث التقنيات.</p>
        <div className="mt-6 flex gap-4 justify-center md:justify-start">
          <a href="#" className="px-6 py-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition">السيرة الذاتية</a>
          <a href="https://wa.me/201044907363" target="_blank" className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition">واتساب: 01044907363</a>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-6 text-center md:text-right">المهارات</h2>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          {skills.map(s => <span key={s} className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm">{s}</span>)}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center md:text-right">المشاريع (27)</h2>
        <div className="flex gap-4 mb-8 justify-center md:justify-start border-b border-gray-800 pb-4">
          {['all','design','3d','ui'].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)} className={`px-4 py-2 rounded-full transition ${filter === tab ? 'bg-indigo-600' : 'text-gray-400 hover:text-white'}`}>{tab === 'all' ? 'الكل' : tab}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10 hover:border-indigo-500 transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <a href={p.link} className="inline-block mt-4 text-indigo-400">عرض المشروع →</a>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold mb-6 text-center">تواصل معي</h2>
        <form className="max-w-xl mx-auto space-y-4" onSubmit={(e: React.FormEvent) => { e.preventDefault(); toast.success('تم الإرسال (تجريبي)'); }}>
          <input type="email" placeholder="بريدك الإلكتروني" className="w-full p-3 bg-black/50 rounded-lg border border-gray-700 focus:border-indigo-500 outline-none" />
          <textarea placeholder="أخبرني عن مشروعك..." rows={4} className="w-full p-3 bg-black/50 rounded-lg border border-gray-700 focus:border-indigo-500 outline-none"></textarea>
          <button type="submit" className="w-full md:w-auto px-6 py-3 bg-indigo-600 rounded-full hover:bg-indigo-500">إرسال</button>
        </form>
        <p className="mt-4 text-center text-gray-400">أو عبر واتساب: <a href="https://wa.me/201044907363" className="text-green-400">01044907363</a></p>
      </section>
    </main>
  );
}

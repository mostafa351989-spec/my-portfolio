'use client'
import ThreeBackground from '@/components/ThreeBackground'
export default function Home() {
  return (
    <>
      <ThreeBackground />
      <main className="relative z-10 text-white p-8 max-w-5xl mx-auto">
        <h1 className="text-6xl font-bold">مصطفى محمود عيسى</h1>
        <p className="text-2xl mt-2">مصمم مواقع - ثلاثي الأبعاد</p>
        <p className="mt-4 text-gray-300">أحوِّل الأفكار إلى تجارب بصرية تفاعلية.</p>
        <a href="https://wa.me/201044907363" className="inline-block mt-6 px-6 py-2 bg-indigo-600 rounded-full">واتساب: 01044907363</a>
      </main>
    </>
  )
}

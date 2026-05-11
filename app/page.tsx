import LightThreeBackground from '@/components/LightThreeBackground'

export default function Home() {
  return (
    <main>
      <LightThreeBackground />
      
      {/* المحتوى بتاعك هنا - عدل الأقسام دي براحتك */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-6xl font-bold mb-4">Mostafa</h1>
        <p className="text-xl text-gray-300 mb-8">Full Stack Developer</p>
        
        <section id="about" className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl bg-black/30 backdrop-blur-md p-8 rounded-2xl">
            <h2 className="text-4xl font-bold mb-4">About Me</h2>
            <p className="text-lg">اكتب نبذة عنك هنا...</p>
          </div>
        </section>

        <section id="projects" className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl bg-black/30 backdrop-blur-md p-8 rounded-2xl">
            <h2 className="text-4xl font-bold mb-4">Projects</h2>
            <p className="text-lg">حط مشاريعك هنا...</p>
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl bg-black/30 backdrop-blur-md p-8 rounded-2xl">
            <h2 className="text-4xl font-bold mb-4">Contact</h2>
            <p className="text-lg">بيانات التواصل...</p>
          </div>
        </section>
      </div>
    </main>
  )
}

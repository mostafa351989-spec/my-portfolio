import LightThreeBackground from '@/components/LightThreeBackground'

export default function Home() {
  return (
    <main className="relative">
      <LightThreeBackground />
      
      <div className="relative z-10 text-white">
        {/* 1. Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            مصطفى محمود عيسى
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-gray-300">
            مصمم مواقع - ثلاثي الأبعاد
          </p>
          <p className="max-w-2xl mt-6 text-gray-400 leading-relaxed">
            أحول الأفكار إلى تجارب بصرية تفاعلية باستخدام أحدث التقنيات. متخصص في Three.js و Next.js.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <a href="https://wa.me/201044907363" className="px-6 py-3 border border-white/30 rounded-full hover:bg-white/10 transition">
              واتساب: 01044907363
            </a>
            <a href="#projects" className="px-6 py-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition">
              شوف شغلي
            </a>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">المهارات</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
              {['Next.js', 'React', 'Three.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB', 'GSAP', 'UI/UX', 'Figma'].map((skill) => (
                <span key={skill} className="px-4 py-2 bg-white/10 backdrop-blur rounded-full border border-white/20 text-sm hover:border-indigo-500/50 transition">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Services Section */}
        <section className="min-h-screen px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">خدماتي</h2>
            <p className="text-center text-gray-400 mb-16">حلول تقنية متكاملة لمشروعك</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🌐', title: 'مواقع 3D تفاعلية', desc: 'تصميم مواقع بتقنية Three.js وتجربة مستخدم فريدة تبهر زوارك' },
                { icon: '⚡', title: 'تطوير Full Stack', desc: 'بناء مواقع متكاملة من الواجهة لقواعد البيانات بأحدث التقنيات' },
                { icon: '🎨', title: 'تصميم UI/UX', desc: 'واجهات عصرية سريعة ومتجاوبة مع كل الأجهزة وتجربة سلسة' }
              ].map((service) => (
                <div key={service.title} className="bg-black/30 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition group">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-400 transition">{service.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Stats Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '27+', label: 'مشروع منجز' },
              { num: '15+', label: 'عميل سعيد' },
              { num: '3+', label: 'سنين خبرة' },
              { num: '100%', label: 'التزام بالمواعيد' }
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-black/30 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{stat.num}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. How I Work Section */}
        <section className="min-h-screen px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">طريقة الشغل</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'نتناقش', desc: 'نتكلم عن فكرتك والمتطلبات' },
                { step: '02', title: 'أصمم', desc: 'بعمل التصميم الأولي وأوريك' },
                { step: '03', title: 'أبرمج', desc: 'بكود الموقع بأحدث التقنيات' },
                { step: '04', title: 'نطلق', desc: 'بنرفع الموقع ونتابع معاك' }
              ].map((item) => (
                <div key={item.step} className="bg-black/30 backdrop-blur-lg p-6 rounded-3xl border border-white/10">
                  <div className="text-5xl font-bold text-indigo-500/30 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Projects Section */}
        <section id="projects" className="min-h-screen px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">أحدث المشاريع</h2>
            <p className="text-center text-gray-400 mb-12">مجموعة من أفضل أعمالي</p>
            
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
              <button className="px-6 py-2 bg-indigo-600 rounded-full">الكل</button>
              <button className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition">3D</button>
              <button className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition">Design</button>
              <button className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition">Web App</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'منصة تسوق إلكتروني', tech: 'Next.js + Stripe + MongoDB', desc: 'متجر كامل مع دفع أونلاين' },
                { name: 'عالم ثلاثي الأبعاد تفاعلي', tech: 'Three.js + React Three Fiber', desc: 'تجربة VR على الويب' }, 
                { name: 'لوحة تحكم إدارة', tech: 'React + Node.js', desc: 'Dashboard كامل لإدارة البيانات' },
                { name: 'موقع شخصي بتأثيرات GSAP', tech: 'GSAP + Tailwind', desc: 'أنيميشن احترافي وسلس' }
              ].map((project) => (
                <div key={project.name} className="bg-black/30 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition group">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition">{project.name}</h3>
                  <p className="text-sm text-indigo-400 mb-3">{project.tech}</p>
                  <p className="text-gray-400 mb-4">{project.desc}</p>
                  <a href="#" className="text-indigo-400 hover:text-indigo-300 group-hover:mr-2 transition-all inline-block">عرض المشروع →</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Experience Section */}
        <section className="min-h-screen px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">الخبرات</h2>
            <div className="space-y-8">
              {[
                { year: '2023 - الآن', title: 'Full Stack Developer', company: 'Freelance', desc: 'بناء مواقع وتطبيقات ويب متكاملة للعملاء من مصر والخليج باستخدام Next.js و Three.js' },
                { year: '2022 - 2023', title: 'Frontend Developer', company: 'شركة تقنية', desc: 'تطوير واجهات مستخدم تفاعلية وسريعة مع التركيز على تجربة المستخدم' }
              ].map((exp) => (
                <div key={exp.title} className="bg-black/30 backdrop-blur-lg p-8 rounded-3xl border border-white/10 hover:border-indigo-500/50 transition">
                  <div className="flex flex-wrap justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold">{exp.title}</h3>
                    <span className="text-indigo-400 bg-indigo-500/10 px-4 py-1 rounded-full text-sm">{exp.year}</span>
                  </div>
                  <p className="text-gray-400 mb-3">{exp.company}</p>
                  <p className="text-gray-300 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Certificates Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">الشهادات</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Meta Front-End Developer', org: 'Coursera', year: '2024' },
                { title: 'Three.js Journey', org: 'Bruno Simon', year: '2023' },
                { title: 'Advanced React', org: 'Udemy', year: '2023' }
              ].map((cert) => (
                <div key={cert.title} className="bg-black/30 backdrop-blur-lg p-6 rounded-2xl border border-white/10 text-center hover:border-indigo-500/50 transition">
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="text-lg font-bold mb-2">{cert.title}</h3>
                  <p className="text-gray-400 text-sm">{cert.org} • {cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Testimonials Section */}
        <section className="min-h-screen px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">آراء العملاء</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'أحمد محمد', role: 'صاحب متجر', text: 'مصطفى محترف جداً، سلمني الموقع قبل المعاد والشغل فوق الممتاز' },
                { name: 'سارة خالد', role: 'مصممة', text: 'أفضل مطور اتعاملت معاه، فهم فكرتي ونفذها أحسن ما تخيلت' }
              ].map((testimonial) => (
                <div key={testimonial.name} className="bg-black/30 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
                  <p className="text-gray-300 mb-6 leading-relaxed text-lg">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Blog Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">آخر المقالات</h2>
            <p className="text-center text-gray-400 mb-16">بشارك خبرتي ومعلومات مفيدة</p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'ليه Three.js مستقبل الويب؟', date: '15 مايو 2026', read: '5 دقائق' },
                { title: 'Next.js 15: أهم المميزات الجديدة', date: '10 مايو 2026', read: '7 دقائق' },
                { title: 'نصائح لتحسين أداء موقعك', date: '5 مايو 2026', read: '4 دقائق' }
              ].map((post) => (
                <div key={post.title} className="bg-black/30 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden hover:border-indigo-500/50 transition group">
                  <div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-600"></div>
                  <div className="p-6">
                    <div className="flex gap-4 text-xs text-gray-400 mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.read}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition">{post.title}</h3>
                    <a href="#" className="text-indigo-400 hover:text-indigo-300">اقرأ المزيد →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. FAQ Section */}
        <section className="px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">أسئلة شائعة</h2>
            <div className="space-y-4">
              {[
                { q: 'كم مدة تنفيذ المشروع؟', a: 'حسب حجم المشروع، عادة من أسبوعين لشهر. المواقع البسيطة أسبوع، المعقدة شهر أو أكتر.' },
                { q: 'بتشتغل على مشاريع خارج مصر؟', a: 'أيوه بشتغل مع عملاء من كل مكان أونلاين. التواصل زووم أو واتساب.' },
                { q: 'إيه طرق الدفع المتاحة؟', a: 'تحويل بنكي، PayPal، Instapay، أو Wise. الدفع على دفعات: 50% مقدم و 50% عند التسليم.' },
                { q: 'بتقدم دعم بعد التسليم؟', a: 'أكيد، بديك شهر دعم مجاني لأي تعديلات بسيطة أو مشاكل.' }
              ].map((item) => (
                <div key={item.q} className="bg-black/30 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold mb-2">{item.q}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Contact Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="max-w-2xl w-full bg-black/40 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">تواصل معي</h2>
            <p className="text-center text-gray-400 mb-8">عندك فكرة مشروع؟ خلينا نتكلم</p>
            <form className="space-y-6">
              <input 
                type="text" 
                placeholder="اسمك" 
                className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition"
              />
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition"
              />
              <textarea 
                placeholder="أخبرني عن مشروعك..." 
                rows={5}
                className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-lg font-bold transition"
              >
                إرسال الرسالة
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-right">
              <div>
                <h3 className="text-xl font-bold mb-4">مصطفى محمود</h3>
                <p className="text-gray-400">مصمم ومطور مواقع ثلاثية الأبعاد</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
                <div className="space-y-2">
                  <a href="#projects" className="block text-gray-400 hover:text-white transition">المشاريع</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition">الخدمات</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition">المدونة</a>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">تواصل</h3>
                <div className="space-y-2">
                  <a href="https://wa.me/201044907363" className="block text-gray-400 hover:text-white transition">واتساب</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition">LinkedIn</a>
                  <a href="#" className="block text-gray-400 hover:text-white transition">GitHub</a>
                </div>
              </div>
            </div>
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-gray-400">© 2026 مصطفى محمود. جميع الحقوق محفوظة</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

'use client';
import { useState } from 'react';
import IntroLoader from '@/components/IntroLoader';
import LightThreeBackground from '@/components/LightThreeBackground';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded? (
        <IntroLoader onFinish={() => setLoaded(true)} />
      ) : (
        <>
          <LightThreeBackground />
          
          {/* محتوى موقعك الأساسي - حطه هنا */}
          <main style={{
            position: 'relative', 
            zIndex: 10, 
            color: 'white',
            minHeight: '100vh',
            padding: '40px 20px'
          }}>
            
            <section style={{textAlign: 'center', paddingTop: '100px'}}>
              <h1 style={{fontSize: '48px', marginBottom: '20px'}}>مصطفى</h1>
              <p style={{fontSize: '20px', color: '#C084FC', marginBottom: '40px'}}>
                متخصص في Next.js و Three.js
              </p>
              
              <a href="https://wa.me/201044907363" style={{
                background: '#D4AF37',
                color: '#000',
                padding: '12px 30px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                واتساب: 01044907363
              </a>
            </section>

            <section style={{marginTop: '100px', textAlign: 'center'}}>
              <h2 style={{fontSize: '36px', marginBottom: '30px', color: '#D4AF37'}}>المهارات</h2>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', maxWidth: '800px', margin: '0 auto'}}>
                {['Three.js', 'React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'GSAP', 'MongoDB', 'Node.js'].map(skill => (
                  <span key={skill} style={{
                    border: '1px solid #D4AF37',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    color: '#fff'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>

          </main>
        </>
      )}
    </>
  );
}

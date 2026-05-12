'use client';
import { useState } from 'react';
import IntroLoader from '@/components/IntroLoader';
import LightThreeBackground from '@/components/LightThreeBackground';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && <IntroLoader onFinish={() => setShowIntro(false)} />}
      <LightThreeBackground />
      <main style={{position: 'relative', zIndex: 10, color: 'white', minHeight: '100vh', padding: '40px 20px'}}>
        <section style={{textAlign: 'center', paddingTop: '100px'}}>
          <h1 style={{fontSize: '48px', marginBottom: '20px'}}>MOSTAFA</h1>
          <p style={{fontSize: '20px', color: '#C084FC', marginBottom: '40px'}}>
            Next.js & Three.js Developer
          </p>
          <a href="https://wa.me/201044907363" style={{
            background: '#D4AF37',
            color: '#000',
            padding: '12px 30px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            WhatsApp: 01044907363
          </a>
        </section>
      </main>
    </>
  );
}

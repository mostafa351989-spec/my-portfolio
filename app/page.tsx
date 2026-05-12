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
          {/* محتوى موقعك الأساسي يبدأ من هنا */}
          <main style={{position: 'relative', zIndex: 10, color: 'white'}}>
            {/* حط كود صفحتك هنا */}
          </main>
        </>
      )}
    </>
  );
}

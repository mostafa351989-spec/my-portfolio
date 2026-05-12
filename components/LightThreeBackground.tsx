'use client';

export default function LightThreeBackground() {
  return (
    <div 
      className="fixed inset-0 z-0"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2111')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.6) sepia(0.3) hue-rotate(10deg)'
      }}
    >
      {/* طبقة تعتيم عشان النص يبان */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* نجوم متحركة خفيفة */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

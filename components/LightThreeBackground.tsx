'use client';

export default function LightThreeBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden bg-black">
      {/* نجوم */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 60px 70px, white, transparent), radial-gradient(1px 1px at 50px 50px, white, transparent), radial-gradient(1px 1px at 130px 80px, white, transparent), radial-gradient(2px 2px at 90px 10px, white, transparent)',
        backgroundSize: '200px 200px',
        opacity: 0.3
      }} />

      {/* المجرة - SVG مايل */}
      <svg 
        className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2"
        style={{ transform: 'translate(-50%, -50%) rotateX(60deg)' }}
        viewBox="0 0 1200 1200"
      >
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFA500" stopOpacity="1" />
            <stop offset="40%" stopColor="#FF8C00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="earthGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#4a7a9d" stopOpacity="1" />
            <stop offset="60%" stopColor="#2a5a7d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1a3a5d" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* الحلقات الذهبية */}
        {[180, 220, 260, 320, 380, 440, 500].map((r, i) => (
          <circle 
            key={i}
            cx="600" 
            cy="600" 
            r={r} 
            fill="none" 
            stroke="#D4AF37" 
            strokeWidth="1.5" 
            opacity="0.4"
          />
        ))}

        {/* الأرض في النص */}
        <circle cx="600" cy="600" r="80" fill="url(#earthGlow)" filter="url(#glow)" />
        <circle cx="600" cy="600" r="65" fill="#4a7a9d" />
        <circle cx="600" cy="600" r="68" fill="none" stroke="#6a9abd" strokeWidth="2" opacity="0.6" />

        {/* الشمس فوق */}
        <circle cx="600" cy="200" r="40" fill="url(#sunGlow)" filter="url(#glow)" />
        <circle cx="600" cy="200" r="25" fill="#FFA500" />

        {/* الكواكب - ألوان بس */}
        <circle cx="720" cy="350" r="12" fill="#8C8C8C" /> {/* عطارد */}
        <circle cx="480" cy="340" r="18" fill="#E6C588" /> {/* الزهرة */}
        <circle cx="780" cy="450" r="16" fill="#CD5C5C" /> {/* المريخ */}
        <circle cx="400" cy="480" r="30" fill="#DAA520" /> {/* المشتري */}
        <circle cx="850" cy="650" r="25" fill="#F4E4BC" /> {/* زحل */}
        <ellipse cx="850" cy="650" rx="45" ry="15" fill="none" stroke="#DDD3B3" strokeWidth="3" opacity="0.7" />
        <circle cx="350" cy="700" r="20" fill="#4FD0E7" /> {/* أورانوس */}
        <circle cx="900" cy="750" r="20" fill="#4B70DD" /> {/* نبتون */}
        
        {/* القمر */}
        <circle cx="520" cy="580" r="10" fill="#aaaaaa" />
      </svg>

      {/* توهج أصفر من فوق */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-yellow-900/20 to-transparent" />
    </div>
  );
}

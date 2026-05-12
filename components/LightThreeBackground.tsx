'use client';
import { useEffect, useState } from 'react';

export default function LightThreeBackground() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const planets = [
    { size: 12, color: '#8C8C8C', orbit: 140, speed: 1.6, angle: 45 }, // عطارد
    { size: 18, color: '#E6C588', orbit: 170, speed: 1.2, angle: 30 }, // الزهرة 
    { size: 16, color: '#CD5C5C', orbit: 200, speed: 1, angle: 80 }, // المريخ
    { size: 32, color: '#DAA520', orbit: 240, speed: 0.7, angle: 120 }, // المشتري
    { size: 28, color: '#F4E4BC', orbit: 290, speed: 0.5, angle: 220, ring: true }, // زحل
    { size: 22, color: '#4FD0E7', orbit: 340, speed: 0.3, angle: 260 }, // أورانوس
    { size: 22, color: '#4B70DD', orbit: 390, speed: 0.2, angle: 290 }, // نبتون
    { size: 10, color: '#aaaaaa', orbit: 430, speed: 0.15, angle: 310 } // القمر
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">
      {/* نجوم */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `radial-gradient(1px 1px at 25px 5px, white, transparent),
                         radial-gradient(1px 1px at 50px 25px, white, transparent),
                         radial-gradient(2px 2px at 125px 20px, white, transparent),
                         radial-gradient(1px 1px at 50px 75px, white, transparent),
                         radial-gradient(2px 2px at 15px 125px, white, transparent),
                         radial-gradient(1px 1px at 110px 80px, white, transparent)`,
        backgroundSize: '200px 200px'
      }} />

      {/* توهج أصفر من فوق */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-yellow-900/30 via-orange-900/10 to-transparent" />

      {/* المجرة - container مايل */}
      <div 
        className="absolute top-1/2 left-1/2 w-[900px] h-[900px]"
        style={{ 
          transform: 'translate(-50%, -50%) perspective(1000px) rotateX(65deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* الحلقات الذهبية */}
        {[140, 170, 200, 240, 290, 340, 390, 430].map((r, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full border border-yellow-600/30"
            style={{
              width: r * 2,
              height: r * 2,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)'
            }}
          />
        ))}

        {/* الشمس فوق */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ transform: `translate(-50%, calc(-50% - 320px)) rotateX(-65deg)` }}
        >
          <div className="w-10 h-10 rounded-full bg-orange-400 shadow-[0_0_40px_10px_rgba(255,165,0,0.8)]" />
        </div>

        {/* الأرض في النص */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div 
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 shadow-[0_0_60px_15px_rgba(59,130,246,0.6)]"
            style={{ transform: 'rotateX(-65deg)' }}
          />
        </div>

        {/* الكواكب */}
        {planets.map((planet, i) => {
          const currentAngle = (rotation * planet.speed + planet.angle) % 360;
          const x = Math.cos(currentAngle * Math.PI / 180) * planet.orbit;
          const y = Math.sin(currentAngle * Math.PI / 180) * planet.orbit;
          
          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              <div 
                className="rounded-full"
                style={{
                  width: planet.size,
                  height: planet.size,
                  backgroundColor: planet.color,
                  boxShadow: `0 0 20px ${planet.color}80`,
                  transform: 'rotateX(-65deg)'
                }}
              />
              {planet.ring && (
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-200/60"
                  style={{
                    width: planet.size * 2.5,
                    height: planet.size * 0.8,
                    transform: 'translate(-50%, -50%) rotateX(-65deg) rotateZ(20deg)'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

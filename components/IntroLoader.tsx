'use client';
import { useState, useEffect } from 'react';

export default function IntroLoader({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <>
      <style jsx global>{`
      .intro-screen{
            position:fixed;inset:0;z-index:9999;
            background:#000;
            display:flex;flex-direction:column;justify-content:center;align-items:center;
            font-family:Arial,sans-serif;
        }

      .intro-name{
            font-size:48px;color:#C084FC;letter-spacing:10px;
            margin-bottom:40px;text-transform:uppercase;
            text-shadow:0 0 30px rgba(192,132,252,0.8), 0 0 60px rgba(168,85,247,0.6);
        }
      .intro-progress{
            width:300px;height:3px;background:rgba(192,132,252,0.2);
            position:relative;overflow:hidden;border-radius:2px;
        }
      .intro-bar{
            height:100%;background:#A855F7;
            box-shadow:0 0 20px #A855F7, 0 0 40px #9333EA;
            transition:width 0.1s linear;
        }
      .intro-percent{
            color:#C084FC;font-size:14px;margin-top:15px;
            letter-spacing:4px;
            text-shadow:0 0 15px rgba(192,132,252,0.6);
        }
        @media (max-width:768px){
        .intro-name{font-size:32px;letter-spacing:6px;}
        }
      `}</style>
      <div className="intro-screen">
        <div className="intro-name">مصطفى</div>
        <div className="intro-progress">
          <div className="intro-bar" style={{width: `${progress}%`}}></div>
        </div>
        <div className="intro-percent">{progress}%</div>
      </div>
    </>
  );
}

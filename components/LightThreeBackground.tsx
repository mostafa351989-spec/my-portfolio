'use client';
import { useState, useEffect } from 'react';

export default function LightThreeBackground() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        
        .intro-screen{
            position:fixed;inset:0;z-index:9999;
            background:#000;
            display:flex;flex-direction:column;justify-content:center;align-items:center;
            font-family:Arial,sans-serif;
            transition:opacity 0.5s ease-out;
        }
        .intro-screen.hide{opacity:0;pointer-events:none;}
        
        .intro-name{
            font-size:48px;color:#D4AF37;letter-spacing:8px;
            margin-bottom:40px;text-transform:uppercase;
            text-shadow:0 0 20px rgba(212,175,55,0.5);
        }
        .intro-progress{
            width:300px;height:2px;background:rgba(212,175,55,0.2);
            position:relative;overflow:hidden;
        }
        .intro-bar{
            height:100%;background:#D4AF37;
            box-shadow:0 0 10px #D4AF37;
            transition:width 0.1s linear;
        }
        .intro-percent{
            color:#D4AF37;font-size:14px;margin-top:15px;
            letter-spacing:3px;
        }

        .solar-wrapper{
            width:100%;height:100vh;overflow:hidden;
            background:#000;
            display:flex;justify-content:center;align-items:center;
            position:fixed;top:0;left:0;z-index:0;
            perspective:1500px;
            opacity:${loading ? 0 : 1};
            transition:opacity 0.8s ease-in;
        }

        .solar-system{
            position:relative;width:1000px;height:1000px;
            transform:rotateX(70deg);
            transform-style:preserve-3d;
        }

        .sun{
            position:absolute;top:50%;left:50%;
            width:60px;height:60px;
            transform:translate(-50%, calc(-50% - 420px));
            border-radius:50%;
            background:radial-gradient(circle, #FFD700 0%, #FF8C00 40%, #FF4500 100%);
            box-shadow:0 0 80px 30px rgba(255,140,0,1), 0 0 140px 60px rgba(255,69,0,0.5);
            z-index:30;
        }

        .earth{
            position:absolute;top:50%;left:50%;width:380px;height:380px;
            transform:translate(-50%,-50%);border-radius:50%;overflow:hidden;
            background:url('https://i.imgur.com/8tBQQ4d.jpg') center/cover;
            box-shadow:0 0 100px rgba(79,195,255,0.8), 
                       inset -50px -50px 100px rgba(0,0,0,0.9);
            z-index:20;
        }

        .earth::after{
            content:'';position:absolute;bottom:55px;left:50%;
            transform:translateX(-50%);width:45px;height:45px;
            background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="%23D4AF37" stroke="%23D4AF37" stroke-width="2"><path d="M50 5 L52 48 L50 95 L48 48 Z"/><path d="M5 50 L48 52 L95 50 L48 48 Z"/><circle cx="50" cy="50" r="4" fill="none"/></g></svg>') center/contain no-repeat;
        }

        .orbit{
            position:absolute;border:1.5px solid rgba(212,175,55,0.6);
            border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);
            box-shadow:0 0 20px rgba(212,175,55,0.2);
        }

        .planet{
            position:absolute;border-radius:50%;top:50%;left:50%;
        }

        .orbit1{width:480px;height:480px;animation:spin 10s linear infinite;}
        .mercury{width:22px;height:22px;top:-11px;left:50%;transform:translateX(-50%);background:#8C7853;box-shadow:0 0 20px rgba(255,255,255,0.7);}

        .orbit2{width:560px;height:560px;animation:spin 15s linear infinite;}
        .venus{width:32px;height:32px;top:-16px;left:50%;transform:translateX(-50%);background:#E6C588;box-shadow:0 0 25px rgba(255,179,71,0.8);}

        .orbit3{width:640px;height:640px;animation:spin 20s linear infinite;}
        .mars{width:28px;height:28px;top:-14px;left:50%;transform:translateX(-50%);background:#C1440E;box-shadow:0 0 25px rgba(209,74,40,0.8);}

        .orbit4{width:740px;height:740px;animation:spin 35s linear infinite;}
        .jupiter{width:85px;height:85px;top:-42px;left:50%;transform:translateX(-50%);background:linear-gradient(180deg,#D8CA9D,#A67C52,#D8CA9D);box-shadow:0 0 40px rgba(216,162,109,0.9);}

        .orbit5{width:860px;height:860px;animation:spin 50s linear infinite;}
        .saturn{width:75px;height:75px;top:-37px;left:50%;transform:translateX(-50%);background:#EAD6A9;box-shadow:0 0 40px rgba(231,194,127,0.9);}
        .saturn::after{content:'';position:absolute;width:130px;height:32px;border:3px solid rgba(255,220,150,0.8);border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%) rotateX(75deg);}

        .orbit6{width:520px;height:520px;animation:spin 12s linear infinite;}
        .moon{width:22px;height:22px;top:-11px;left:50%;transform:translateX(-50%);background:#C0C0C0;box-shadow:0 0 20px rgba(255,255,255,0.6);}

        .orbit7{width:980px;height:980px;animation:spin 65s linear infinite;}
        .uranus{width:55px;height:55px;top:-27px;left:50%;transform:translateX(-50%);background:#4FD1C5;box-shadow:0 0 30px rgba(79,209,197,0.8);}

        .orbit8{width:1100px;height:1100px;animation:spin 80s linear infinite;}
        .neptune{width:55px;height:55px;top:-27px;left:50%;transform:translateX(-50%);background:#2B6CB0;box-shadow:0 0 30px rgba(43,108,176,0.8);}

        @keyframes spin{
            from{transform:translate(-50%,-50%) rotate(0deg);}
            to{transform:translate(-50%,-50%) rotate(360deg);}
        }

        @media (max-width:768px){
          .solar-system{transform:rotateX(70deg) scale(0.35);}
          .intro-name{font-size:32px;letter-spacing:4px;}
        }
      `}</style>

      {loading && (
        <div className={`intro-screen ${progress >= 100 ? 'hide' : ''}`}>
          <div className="intro-name">AHMED</div>
          <div className="intro-progress">
            <div className="intro-bar" style={{width: `${progress}%`}}></div>
          </div>
          <div className="intro-percent">{progress}%</div>
        </div>
      )}

      <div className="solar-wrapper">
        <div className="solar-system">
            <div className="sun"></div>
            <div className="earth"></div>
            
            <div className="orbit orbit1"><div className="planet mercury"></div></div>
            <div className="orbit orbit2"><div className="planet venus"></div></div>
            <div className="orbit orbit3"><div className="planet mars"></div></div>
            <div className="orbit orbit4"><div className="planet jupiter"></div></div>
            <div className="orbit orbit5"><div className="planet saturn"></div></div>
            <div className="orbit orbit6"><div className="planet moon"></div></div>
            <div className="orbit orbit7"><div className="planet uranus"></div></div>
            <div className="orbit orbit8"><div className="planet neptune"></div></div>
        </div>
      </div>
    </>
  );
}

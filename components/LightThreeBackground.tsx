'use client';

export default function LightThreeBackground() {
  return (
    <>
      <style jsx global>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        
        .solar-wrapper{
            width:100%;height:100vh;overflow:hidden;
            background:#000 url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013') center/cover;
            display:flex;justify-content:center;align-items:center;
            font-family:'Times New Roman',serif;
            position:fixed;top:0;left:0;z-index:0;
            perspective:1500px;
        }

        .solar-system{
            position:relative;width:1100px;height:1100px;
            transform:rotateX(70deg) rotateZ(0deg);
            transform-style:preserve-3d;
        }

        /* الشمس */
        .sun{
            position:absolute;top:50%;left:50%;
            width:80px;height:80px;
            transform:translate(-50%, calc(-50% - 450px));
            border-radius:50%;
            background:radial-gradient(circle, #FFD700 0%, #FF8C00 30%, #FF4500 70%);
            box-shadow:0 0 100px 40px rgba(255,140,0,1), 0 0 180px 80px rgba(255,69,0,0.6);
            z-index:30;
        }
        .sun-label{
            position:absolute;top:50%;left:50%;
            transform:translate(-50%, calc(-50% - 500px));
            color:#D4AF37;font-size:12px;letter-spacing:4px;
        }

        /* الأرض - خريطة قديمة */
        .earth{
            position:absolute;top:50%;left:50%;width:400px;height:400px;
            transform:translate(-50%,-50%);border-radius:50%;overflow:hidden;
            background:url('https://i.imgur.com/8tBQQ4d.jpg') center/cover;
            box-shadow:0 0 120px rgba(79,195,255,0.8), 
                       inset -50px -50px 100px rgba(0,0,0,0.95),
                       inset 50px 50px 100px rgba(255,255,255,0.1);
            z-index:15;
        }

        /* خطوط الطول والعرض */
        .earth::before{
            content:'';position:absolute;inset:0;
            background:
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.3) 39px, rgba(0,0,0,0.3) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.3) 39px, rgba(0,0,0,0.3) 40px);
            border-radius:50%;
        }

        /* البوصلة */
        .earth::after{
            content:'';position:absolute;bottom:60px;left:50%;
            transform:translateX(-50%);width:50px;height:50px;
            background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="%23D4AF37"><path d="M50 5 L52 48 L50 95 L48 48 Z"/><path d="M5 50 L48 52 L95 50 L48 48 Z"/><circle cx="50" cy="50" r="3"/></g></svg>') center/contain no-repeat;
        }

        /* الحلقات الذهبية */
        .orbit{
            position:absolute;border:1.5px solid rgba(212,175,55,0.5);
            border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);
            box-shadow:0 0 25px rgba(212,175,55,0.2);
        }
        .orbit::before{
            content:'';position:absolute;width:8px;height:8px;
            background:#D4AF37;border-radius:50%;top:-4px;left:50%;
            transform:translateX(-50%);box-shadow:0 0 15px #D4AF37;
        }

        .planet{
            position:absolute;border-radius:50%;top:50%;left:50%;
        }
        .planet-name{
            position:absolute;top:130%;left:50%;transform:translateX(-50%);
            color:#D4AF37;font-size:11px;letter-spacing:3px;
            white-space:nowrap;text-transform:uppercase;font-weight:300;
        }

        /* عطارد */
        .orbit1{width:500px;height:500px;animation:spin 10s linear infinite;}
        .mercury{
            width:25px;height:25px;top:-12px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/JzV6Q1z.jpg') center/cover;
            box-shadow:0 0 20px rgba(255,255,255,0.7);
        }

        /* الزهرة */
        .orbit2{width:600px;height:600px;animation:spin 15s linear infinite;}
        .venus{
            width:35px;height:35px;top:-17px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/8fJQQ3H.jpg') center/cover;
            box-shadow:0 0 25px rgba(255,179,71,0.8);
        }

        /* المريخ */
        .orbit3{width:700px;height:700px;animation:spin 20s linear infinite;}
        .mars{
            width:32px;height:32px;top:-16px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/Q3Q3Q3Q.jpg') center/cover;
            box-shadow:0 0 25px rgba(209,74,40,0.8);
        }

        /* المشتري */
        .orbit4{width:820px;height:820px;animation:spin 35s linear infinite;}
        .jupiter{
            width:90px;height:90px;top:-45px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/3qQZQ9E.jpg') center/cover;
            box-shadow:0 0 40px rgba(216,162,109,0.9);
        }

        /* زحل */
        .orbit5{width:940px;height:940px;animation:spin 50s linear infinite;}
        .saturn{
            width:80px;height:80px;top:-40px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/9fJ3Q3H.jpg') center/cover;
            box-shadow:0 0 40px rgba(231,194,127,0.9);
        }
        .saturn::after{
            content:'';position:absolute;width:140px;height:35px;
            border:4px solid rgba(255,220,150,0.8);border-radius:50%;
            top:50%;left:50%;transform:translate(-50%,-50%) rotateX(75deg);
            box-shadow:0 0 25px rgba(255,220,150,0.6);
        }

        /* القمر */
        .orbit6{width:550px;height:550px;animation:spin 12s linear infinite;}
        .moon{
            width:25px;height:25px;top:-12px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/3Q3Q3Q3.jpg') center/cover;
            box-shadow:0 0 20px rgba(255,255,255,0.6);
        }

        /* اورانوس */
        .orbit7{width:1060px;height:1060px;animation:spin 65s linear infinite;}
        .uranus{
            width:60px;height:60px;top:-30px;left:50%;transform:translateX(-50%);
            background:radial-gradient(circle at 30% 30%, #4FD1C5, #2C7A7B);
            box-shadow:0 0 30px rgba(79,209,197,0.8);
        }

        /* نبتون */
        .orbit8{width:1180px;height:1180px;animation:spin 80s linear infinite;}
        .neptune{
            width:60px;height:60px;top:-30px;left:50%;transform:translateX(-50%);
            background:radial-gradient(circle at 30% 30%, #2B6CB0, #1A365D);
            box-shadow:0 0 30px rgba(43,108,176,0.8);
        }

        /* بلوتو */
        .orbit9{width:1240px;height:1240px;animation:spin 90s linear infinite;}
        .pluto{
            width:20px;height:20px;top:-10px;left:50%;transform:translateX(-50%);
            background:#8B7355;box-shadow:0 0 15px rgba(139,115,85,0.6);
        }

        @keyframes spin{
            from{transform:translate(-50%,-50%) rotate(0deg);}
            to{transform:translate(-50%,-50%) rotate(360deg);}
        }

        @media (max-width:768px){
          .solar-system{transform:rotateX(70deg) scale(0.3);}
        }
      `}</style>

      <div className="solar-wrapper">
        <div className="solar-system">
            <div className="sun"></div>
            <div className="sun-label">SUN</div>
            <div className="earth"></div>
            
            <div className="orbit orbit1">
                <div className="planet mercury"><span className="planet-name">MERCURY</span></div>
            </div>
            <div className="orbit orbit2">
                <div className="planet venus"><span className="planet-name">VENUS</span></div>
            </div>
            <div className="orbit orbit3">
                <div className="planet mars"><span className="planet-name">MARS</span></div>
            </div>
            <div className="orbit orbit4">
                <div className="planet jupiter"><span className="planet-name">JUPITER</span></div>
            </div>
            <div className="orbit orbit5">
                <div className="planet saturn"><span className="planet-name">SATURN</span></div>
            </div>
            <div className="orbit orbit6">
                <div className="planet moon"><span className="planet-name">MOON</span></div>
            </div>
            <div className="orbit orbit7">
                <div className="planet uranus"><span className="planet-name">URANUS</span></div>
            </div>
            <div className="orbit orbit8">
                <div className="planet neptune"><span className="planet-name">NEPTUNE</span></div>
            </div>
            <div className="orbit orbit9">
                <div className="planet pluto"><span className="planet-name">PLUTO</span></div>
            </div>
        </div>
      </div>
    </>
  );
}

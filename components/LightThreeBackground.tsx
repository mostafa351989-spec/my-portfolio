'use client';

export default function LightThreeBackground() {
  return (
    <>
      <style jsx global>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        
        .solar-wrapper{
            width:100%;height:100vh;overflow:hidden;
            background:#000 url('https://i.imgur.com/3fJ3Q3H.jpg') center/cover;
            display:flex;justify-content:center;align-items:center;
            font-family:'Times New Roman',serif;
            position:fixed;top:0;left:0;z-index:0;
            perspective:1000px;
        }

        /* النجوم */
        .stars{
            position:absolute;width:100%;height:100%;
            background-image:
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, #fff, transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent);
            background-size:200px 200px;opacity:0.5;
        }

        /* النظام مايل */
        .solar-system{
            position:relative;width:900px;height:900px;
            transform:rotateX(65deg);transform-style:preserve-3d;
        }

        /* الشمس */
        .sun{
            position:absolute;top:50%;left:50%;
            width:50px;height:50px;
            transform:translate(-50%, calc(-50% - 320px));
            border-radius:50%;
            background:radial-gradient(circle, #FFD700, #FF8C00, #FF4500);
            box-shadow:0 0 60px 20px rgba(255,140,0,0.8), 0 0 100px 40px rgba(255,69,0,0.4);
            z-index:20;
        }
        .sun::after{
            content:'SUN';position:absolute;top:-25px;left:50%;
            transform:translateX(-50%);color:#D4AF37;font-size:10px;letter-spacing:2px;
        }

        /* الأرض - خريطة قديمة */
        .earth{
            position:absolute;top:50%;left:50%;width:320px;height:320px;
            transform:translate(-50%,-50%);border-radius:50%;overflow:hidden;
            box-shadow:0 0 80px rgba(79,195,255,0.6), inset 0 0 60px rgba(0,0,0,0.8);
            background:
            radial-gradient(circle at 30% 30%, transparent 40%, rgba(0,0,0,0.4) 100%),
            url('https://i.imgur.com/8tBQQ4d.jpg');
            background-size:cover;background-position:center;z-index:10;
        }

        /* بوصلة على الأرض */
        .earth::after{
            content:'★';position:absolute;bottom:40px;left:50%;
            transform:translateX(-50%);color:#D4AF37;font-size:24px;
        }

        /* الحلقات الذهبية */
        .orbit{
            position:absolute;border:1px solid rgba(212,175,55,0.5);
            border-radius:50%;top:50%;left:50%;transform:translate(-50%,-50%);
            box-shadow:0 0 10px rgba(212,175,55,0.2);
        }
        .orbit::before{
            content:'';position:absolute;width:4px;height:4px;
            background:#D4AF37;border-radius:50%;top:-2px;left:50%;
            transform:translateX(-50%);box-shadow:0 0 6px #D4AF37;
        }

        .planet{
            position:absolute;border-radius:50%;top:50%;left:50%;
            transform-style:preserve-3d;
        }
        .planet-name{
            position:absolute;top:100%;left:50%;transform:translateX(-50%);
            color:#D4AF37;font-size:9px;letter-spacing:1px;margin-top:8px;
            white-space:nowrap;text-transform:uppercase;
        }

        /* عطارد */
        .orbit1{width:400px;height:400px;animation:spin 15s linear infinite;}
        .mercury{
            width:20px;height:20px;top:-10px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/JzV6Q1z.jpg') center/cover;
            box-shadow:0 0 15px rgba(255,255,255,0.5);
        }

        /* الزهرة */
        .orbit2{width:500px;height:500px;animation:spin 22s linear infinite;}
        .venus{
            width:28px;height:28px;top:-14px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/8fJQQ3H.jpg') center/cover;
            box-shadow:0 0 18px rgba(255,179,71,0.6);
        }

        /* المريخ */
        .orbit3{width:600px;height:600px;animation:spin 30s linear infinite;}
        .mars{
            width:26px;height:26px;top:-13px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/Q3Q3Q3Q.jpg') center/cover;
            box-shadow:0 0 18px rgba(209,74,40,0.6);
        }

        /* المشتري */
        .orbit4{width:720px;height:720px;animation:spin 45s linear infinite;}
        .jupiter{
            width:75px;height:75px;top:-37px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/3qQZQ9E.jpg') center/cover;
            box-shadow:0 0 30px rgba(216,162,109,0.7);
        }

        /* زحل */
        .orbit5{width:840px;height:840px;animation:spin 60s linear infinite;}
        .saturn{
            width:65px;height:65px;top:-32px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/9fJ3Q3H.jpg') center/cover;
            box-shadow:0 0 30px rgba(231,194,127,0.7);
        }
        .saturn::after{
            content:'';position:absolute;width:110px;height:25px;
            border:3px solid rgba(255,220,150,0.6);border-radius:50%;
            top:50%;left:50%;transform:translate(-50%,-50%) rotateX(75deg);
            box-shadow:0 0 15px rgba(255,220,150,0.4);
        }

        /* القمر */
        .orbit6{width:460px;height:460px;animation:spin 18s linear infinite;}
        .moon{
            width:18px;height:18px;top:-9px;left:50%;transform:translateX(-50%);
            background:url('https://i.imgur.com/3Q3Q3Q3.jpg') center/cover;
            box-shadow:0 0 12px rgba(255,255,255,0.4);
        }

        /* اورانوس */
        .orbit7{width:960px;height:960px;animation:spin 70s linear infinite;}
        .uranus{
            width:45px;height:45px;top:-22px;left:50%;transform:translateX(-50%);
            background:radial-gradient(circle, #4FD1C5, #2C7A7B);
            box-shadow:0 0 20px rgba(79,209,197,0.6);
        }

        /* نبتون */
        .orbit8{width:1080px;height:1080px;animation:spin 80s linear infinite;}
        .neptune{
            width:45px;height:45px;top:-22px;left:50%;transform:translateX(-50%);
            background:radial-gradient(circle, #2B6CB0, #1A365D);
            box-shadow:0 0 20px rgba(43,108,176,0.6);
        }

        @keyframes spin{
            from{transform:translate(-50%,-50%) rotate(0deg);}
            to{transform:translate(-50%,-50%) rotate(360deg);}
        }

        @media (max-width:768px){
          .solar-system{transform:rotateX(65deg) scale(0.4);}
        }
      `}</style>

      <div className="solar-wrapper">
        <div className="stars"></div>
        <div className="solar-system">
            <div className="sun"></div>
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
        </div>
      </div>
    </>
  );
}

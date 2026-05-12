'use client';

export default function LightThreeBackground() {
  return (
    <>
      <style jsx global>{`
        *{
            margin:0;
            padding:0;
            box-sizing:border-box;
        }

        .solar-wrapper{
            width:100%;
            height:100vh;
            overflow:hidden;
            background:
            radial-gradient(circle at center, #0b1d3a 0%, #02030a 70%);
            display:flex;
            justify-content:center;
            align-items:center;
            font-family:Arial;
            position:fixed;
            top:0;
            left:0;
            z-index:0;
        }

        /* النجوم */
        .stars{
            position:absolute;
            width:100%;
            height:100%;
            background-image:
            radial-gradient(white 1px, transparent 1px),
            radial-gradient(white 1px, transparent 1px),
            radial-gradient(white 2px, transparent 2px);
            background-size:120px 120px, 180px 180px, 250px 250px;
            opacity:0.6;
        }

        /* النظام الكامل */
        .solar-system{
            position:relative;
            width:900px;
            height:900px;
        }

        /* الأرض */
        .earth{
            position:absolute;
            top:50%;
            left:50%;
            width:280px;
            height:280px;
            transform:translate(-50%,-50%);
            border-radius:50%;
            overflow:hidden;
            box-shadow:
            0 0 60px #4fc3ff,
            0 0 120px #2d7cff;
            background:
            url('https://upload.wikimedia.org/wikipedia/commons/8/80/Earthmap1000x500compac.jpg');
            background-size:cover;
            background-position:center;
            z-index:10;
        }

        /* خطوط المدارات */
        .orbit{
            position:absolute;
            border:1px solid rgba(255,255,255,0.2);
            border-radius:50%;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
        }

        /* الكوكب */
        .planet{
            position:absolute;
            border-radius:50%;
            top:50%;
            left:50%;
        }

        /* عطارد */
        .orbit1{
            width:380px;
            height:380px;
            animation:spin 15s linear infinite;
        }
        .mercury{
            width:18px;
            height:18px;
            background:#b7b7b7;
            position:absolute;
            top:-9px;
            left:50%;
            transform:translateX(-50%);
            box-shadow:0 0 15px #ffffff;
        }

        /* الزهرة */
        .orbit2{
            width:500px;
            height:500px;
            animation:spin 22s linear infinite;
        }
        .venus{
            width:26px;
            height:26px;
            background:#e3b66b;
            position:absolute;
            top:-13px;
            left:50%;
            transform:translateX(-50%);
            box-shadow:0 0 18px #ffb347;
        }

        /* المريخ */
        .orbit3{
            width:620px;
            height:620px;
            animation:spin 30s linear infinite;
        }
        .mars{
            width:24px;
            height:24px;
            background:#d14a28;
            position:absolute;
            top:-12px;
            left:50%;
            transform:translateX(-50%);
            box-shadow:0 0 18px #ff5e3a;
        }

        /* المشتري */
        .orbit4{
            width:760px;
            height:760px;
            animation:spin 45s linear infinite;
        }
        .jupiter{
            width:70px;
            height:70px;
            background:
            linear-gradient(
            180deg,
            #d9b38c,
            #b97a56,
            #d9b38c
            );
            position:absolute;
            top:-35px;
            left:50%;
            transform:translateX(-50%);
            box-shadow:0 0 25px #d8a26d;
        }

        /* زحل */
        .orbit5{
            width:900px;
            height:900px;
            animation:spin 60s linear infinite;
        }
        .saturn{
            width:60px;
            height:60px;
            background:#cfa96b;
            position:absolute;
            top:-30px;
            left:50%;
            transform:translateX(-50%);
            box-shadow:0 0 25px #e7c27f;
        }

        .saturn::after{
            content:'';
            position:absolute;
            width:100px;
            height:20px;
            border:4px solid rgba(255,220,150,0.7);
            border-radius:50%;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%) rotate(20deg);
        }

        /* الحركة */
        @keyframes spin{
            from{
                transform:translate(-50%,-50%) rotate(0deg);
            }
            to{
                transform:translate(-50%,-50%) rotate(360deg);
            }
        }

        /* بوصلة زخرفية */
        .compass{
            position:absolute;
            bottom:40px;
            left:50%;
            transform:translateX(-50%);
            width:120px;
            height:120px;
            border:2px solid rgba(255,255,255,0.3);
            border-radius:50%;
            box-shadow:0 0 20px rgba(255,255,255,0.2);
        }

        .compass::before,
        .compass::after{
            content:'';
            position:absolute;
            background:white;
        }

        .compass::before{
            width:2px;
            height:100%;
            left:50%;
            top:0;
        }

        .compass::after{
            width:100%;
            height:2px;
            top:50%;
            left:0;
        }
      `}</style>

      <div className="solar-wrapper">
        <div className="stars"></div>

        <div className="solar-system">
            <div className="earth"></div>

            <div className="orbit orbit1">
                <div className="planet mercury"></div>
            </div>

            <div className="orbit orbit2">
                <div className="planet venus"></div>
            </div>

            <div className="orbit orbit3">
                <div className="planet mars"></div>
            </div>

            <div className="orbit orbit4">
                <div className="planet jupiter"></div>
            </div>

            <div className="orbit orbit5">
                <div className="planet saturn"></div>
            </div>

            <div className="compass"></div>
        </div>
      </div>
    </>
  );
}

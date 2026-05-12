'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 13); // رجعناها ورا

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // النجوم
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 6000;
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 300;
      starsPos[i + 1] = (Math.random() - 0.5) * 300;
      starsPos[i + 2] = (Math.random() - 0.5) * 300;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, opacity: 0.8 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const textureLoader = new THREE.TextureLoader();

    // الأرض - صغرناها ونزلناها تحت
    const earthGroup = new THREE.Group();
    earthGroup.position.y = -4.5; // نزلناها تحت عشان متغطيش المحتوى
    scene.add(earthGroup);

    const earthGeometry = new THREE.SphereGeometry(2.5, 64, 64); // صغرناها من 4 لـ 2.5
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBump = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
    
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 0.1,
      metalness: 0.2,
      roughness: 0.8,
      emissive: 0x223344,
      emissiveIntensity: 0.3 // بتلمع شوية
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // هالة خفيفة
    const glowGeometry = new THREE.SphereGeometry(2.7, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.6 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 2.0 ); gl_FragColor = vec4( 0.3, 0.6, 1.0, 0.6 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    earthGroup.add(glow);

    // السحب
    const cloudsGeometry = new THREE.SphereGeometry(2.55, 64, 64);
    const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png');
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    earthGroup.add(clouds);

    // القمر
    const moonGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg');
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      emissive: 0x333333,
      emissiveIntensity: 0.5 // بينور
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 4;
    earthGroup.add(moonOrbit);

    // الكواكب - تكستشر خفيف + emissive عشان تنور
    const planets: any[] = [];
    const planetData = [
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury_1024.jpg', size: 0.3, distance: 7, speed: 0.01, color: 0x8B7D6B },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus_1024.jpg', size: 0.4, distance: 8.5, speed: 0.008, color: 0xE6C588 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1024.jpg', size: 0.35, distance: 10, speed: 0.006, color: 0xCD5C5C },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter_1024.jpg', size: 0.7, distance: 12, speed: 0.004, color: 0xDAA520 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn_1024.jpg', size: 0.65, distance: 14.5, speed: 0.003, hasRing: true, color: 0xF4E4BC },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus_1024.jpg', size: 0.5, distance: 16.5, speed: 0.002, color: 0x4FD0E7 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune_1024.jpg', size: 0.5, distance: 18.5, speed: 0.0015, color: 0x4B70DD }
    ];

    planetData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.size, 64, 64);
      const planetTexture = textureLoader.load(data.url);
      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.5 // الحل بتاع السواد - بتنور لوحدها
      });
      const planet = new THREE.Mesh(geometry, material);

      if (data.hasRing) {
        const ringGeometry = new THREE.RingGeometry(data.size * 1.4, data.size * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xDDD3B3,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.5;
        planet.add(ring);
      }

      const orbit = new THREE.Object3D();
      orbit.add(planet);
      planet.position.x = data.distance;
      planet.position.y = -4.5; // نفس مستوى الأرض

      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let j = 0; j <= 64; j++) {
        const angle = (j / 64) * Math.PI * 2;
        orbitPoints.push(Math.cos(angle) * data.distance, -4.5, Math.sin(angle) * data.distance);
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.15 });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      scene.add(orbit);
      planets.push({ orbit, planet, speed: data.speed });
    });

    // الإضاءة - أقوى بكتير
    const ambientLight = new THREE.AmbientLight(0x404060, 1.5); // أقوى
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 4); // أقوى 4x
    sunLight.position.set(15, 10, 10);
    scene.add(sunLight);

    const fillLight = new THREE.PointLight(0x6699ff, 1.5, 50);
    fillLight.position.set(-10, 5, 5);
    scene.add(fillLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 1 + 1 - camera.position.y) * 0.02;
      camera.lookAt(0, -2, 0);

      earth.rotation.y += 0.001;
      clouds.rotation.y += 0.0012;
      glow.rotation.y += 0.001;

      moonOrbit.rotation.y += 0.008;
      moon.rotation.y += 0.004;

      planets.forEach((p) => {
        p.orbit.rotation.y += p.speed;
        p.planet.rotation.y += p.speed * 1.2;
      });

      stars.rotation.y += 0.00003;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full z-0" />;
}

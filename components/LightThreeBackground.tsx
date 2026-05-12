'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 6);
    camera.lookAt(0, -0.5, 0);

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

    // نجوم
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 4000;
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 100;
      starsPos[i + 1] = (Math.random() - 0.5) * 100;
      starsPos[i + 2] = (Math.random() - 0.5) * 100;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, opacity: 0.5 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // السيستم مايل
    const solarSystem = new THREE.Group();
    solarSystem.rotation.x = 1.0; // مايل 57 درجة
    solarSystem.position.y = -1;
    scene.add(solarSystem);

    // الأرض - من غير تكستشر، ألوان بس عشان تشتغل
    const earthGeometry = new THREE.SphereGeometry(1.2, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a7a9d,
      metalness: 0.1,
      roughness: 0.8,
      emissive: 0x0a1a3a,
      emissiveIntensity: 0.2
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    solarSystem.add(earth);

    // هالة زرقاء خفيفة
    const glowGeometry = new THREE.SphereGeometry(1.35, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.6 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 2.0 ); gl_FragColor = vec4( 0.2, 0.5, 1.0, 0.6 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    solarSystem.add(glow);

    // الشمس صغيرة فوق
    const sunGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 4, 0);
    
    const sunGlowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sunGlowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.6 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 1.5 ); gl_FragColor = vec4( 1.0, 0.6, 0.0, 0.8 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sun.add(sunGlow);
    solarSystem.add(sun);

    // الكواكب - ألوان بس من غير تكستشر عشان تشتغل مضمون
    const planets: any[] = [];
    const planetData = [
      { color: 0x8C8C8C, size: 0.15, distance: 2, angle: 0.3 },
      { color: 0xE6C588, size: 0.22, distance: 2.4, angle: 0.15 },
      { color: 0xCD5C5C, size: 0.2, distance: 2.8, angle: 0.55 },
      { color: 0xDAA520, size: 0.4, distance: 3.3, angle: 0.85 },
      { color: 0xF4E4BC, size: 0.35, distance: 4, angle: 1.45, hasRing: true },
      { color: 0x4FD0E7, size: 0.28, distance: 4.7, angle: 1.7 },
      { color: 0x4B70DD, size: 0.28, distance: 5.4, angle: 1.9 }
    ];

    planetData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        metalness: 0.3,
        roughness: 0.6
      });
      const planet = new THREE.Mesh(geometry, material);

      if (data.hasRing) {
        const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xDDD3B3,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.3;
        planet.add(ring);
      }

      const orbit = new THREE.Object3D();
      orbit.add(planet);
      planet.position.x = data.distance;
      
      // حلقات ذهبية خفيفة
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let j = 0; j <= 128; j++) {
        const angle = (j / 128) * Math.PI * 2;
        orbitPoints.push(Math.cos(angle) * data.distance, 0, Math.sin(angle) * data.distance);
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.4
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      solarSystem.add(orbitLine);

      orbit.rotation.y = data.angle;
      solarSystem.add(orbit);
      planets.push({ orbit, planet, speed: 0.001 });
    });

    // القمر
    const moonGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 1.8;
    moonOrbit.rotation.y = 0.7;
    solarSystem.add(moonOrbit);
    planets.push({ orbit: moonOrbit, planet: moon, speed: 0.004 });

    // الإضاءة - طبيعية
    const ambientLight = new THREE.AmbientLight(0x505060, 8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.set(0, 10, 5);
    scene.add(sunLight);

    const animate = () => {
      requestAnimationFrame(animate);

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.2 + 4 - camera.position.y) * 0.02;
      camera.lookAt(0, -1, 0);

      earth.rotation.y += 0.0005;
      glow.rotation.y += 0.0005;

      planets.forEach((p) => {
        p.orbit.rotation.y += p.speed;
        p.planet.rotation.y += p.speed * 2;
      });

      sun.rotation.y += 0.001;
      stars.rotation.y += 0.00001;

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

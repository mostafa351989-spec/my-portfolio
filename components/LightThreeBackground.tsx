'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 7);
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
    const starsCount = 6000;
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 200;
      starsPos[i + 1] = (Math.random() - 0.5) * 200;
      starsPos[i + 2] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, opacity: 0.7 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    // السيستم مايل جامد زي الصورة
    const solarSystem = new THREE.Group();
    solarSystem.rotation.x = 1.1; // مايل 65 درجة
    solarSystem.position.y = -1;
    scene.add(solarSystem);

    // الأرض - ألوان طبيعية
    const earthGeometry = new THREE.SphereGeometry(1.5, 128, 128);
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBump = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
    
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 0.05,
      metalness: 0.1,
      roughness: 1,
      emissive: 0x112244,
      emissiveIntensity: 0.15 // خفيفة خالص
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    solarSystem.add(earth);

    // هالة الأرض زرقاء
    const glowGeometry = new THREE.SphereGeometry(1.65, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.5 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 2.0 ); gl_FragColor = vec4( 0.1, 0.4, 1.0, 1.0 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    solarSystem.add(glow);

    // الشمس فوق
    const sunGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFA500 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 5, 0);
    
    const sunGlowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunGlowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.6 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 1.5 ); gl_FragColor = vec4( 1.0, 0.6, 0.0, 1.0 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sun.add(sunGlow);
    solarSystem.add(sun);

    // الكواكب - تكستشر سريع + أماكن مظبوطة
    const planets: any[] = [];
    const planetData = [
      { url: 'https://threejs.org/examples/textures/planets/mercury_1024.jpg', size: 0.18, distance: 2.5, angle: 0.3, color: 0x8C8C8C },
      { url: 'https://threejs.org/examples/textures/planets/venus_1024.jpg', size: 0.25, distance: 2.9, angle: 0.15, color: 0xE6C588 },
      { url: 'https://threejs.org/examples/textures/planets/mars_1024.jpg', size: 0.23, distance: 3.3, angle: 0.55, color: 0xCD5C5C },
      { url: 'https://threejs.org/examples/textures/planets/jupiter_1024.jpg', size: 0.5, distance: 3.8, angle: 0.85, color: 0xDAA520 },
      { url: 'https://threejs.org/examples/textures/planets/saturn_1024.jpg', size: 0.45, distance: 4.5, angle: 1.45, hasRing: true, color: 0xF4E4BC },
      { url: 'https://threejs.org/examples/textures/planets/uranus_1024.jpg', size: 0.32, distance: 5.2, angle: 1.7, color: 0x4FD0E7 },
      { url: 'https://threejs.org/examples/textures/planets/neptune_1024.jpg', size: 0.32, distance: 5.9, angle: 1.9, color: 0x4B70DD }
    ];

    planetData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.size, 64, 64);
      const planetTexture = textureLoader.load(data.url);
      
      // مفيش emissive عالي - التكستشر يبان
      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        metalness: 0.1,
        roughness: 0.9
      });
      const planet = new THREE.Mesh(geometry, material);

      if (data.hasRing) {
        const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2.4, 64);
        const ringTexture = textureLoader.load('https://threejs.org/examples/textures/planets/saturn_ring.png');
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.5;
        planet.add(ring);
      }

      const orbit = new THREE.Object3D();
      orbit.add(planet);
      planet.position.x = data.distance;
      
      // حلقات ذهبية سميكة زي الصورة
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
        opacity: 0.8,
        linewidth: 2
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      solarSystem.add(orbitLine);

      orbit.rotation.y = data.angle;
      solarSystem.add(orbit);
      planets.push({ orbit, planet, speed: 0.001 });
    });

    // القمر
    const moonGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const moonTexture = textureLoader.load('https://threejs.org/examples/textures/planets/moon_1024.jpg');
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 1
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 2.2;
    moonOrbit.rotation.y = 0.65;
    solarSystem.add(moonOrbit);
    planets.push({ orbit: moonOrbit, planet: moon, speed: 0.005 });

    // الإضاءة - طبيعية مش صفرا
    const ambientLight = new THREE.AmbientLight(0x404060, 6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 8);
    sunLight.position.set(0, 20, 5);
    scene.add(sunLight);

    const fillLight = new THREE.PointLight(0x6a8fff, 2, 50);
    fillLight.position.set(0, 0, 0);
    solarSystem.add(fillLight);

    const animate = () => {
      requestAnimationFrame(animate);

      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.3 + 5 - camera.position.y) * 0.02;
      camera.lookAt(0, -1, 0);

      earth.rotation.y += 0.001;
      glow.rotation.y += 0.001;

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

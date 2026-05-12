'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 10);
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

    // الخلفية - نجوم + سديم
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 15000;
    const starsPos = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 120;
      starsPos[i + 1] = (Math.random() - 0.5) * 120;
      starsPos[i + 2] = (Math.random() - 0.5) * 120;
      
      const c = Math.random();
      if (c < 0.7) {
        starsColors[i] = 1; starsColors[i+1] = 1; starsColors[i+2] = 1;
      } else if (c < 0.85) {
        starsColors[i] = 0.6; starsColors[i+1] = 0.7; starsColors[i+2] = 1;
      } else {
        starsColors[i] = 1; starsColors[i+1] = 0.8; starsColors[i+2] = 0.6;
      }
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    const starsMaterial = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const textureLoader = new THREE.TextureLoader();

    // جروب السيستم كله - مايل بزاوية زي الصورة
    const solarSystem = new THREE.Group();
    solarSystem.rotation.x = 0.5; // الميلان المهم
    solarSystem.position.y = -0.5;
    scene.add(solarSystem);

    // الأرض في النص
    const earthGroup = new THREE.Group();
    solarSystem.add(earthGroup);

    const earthGeometry = new THREE.SphereGeometry(2.5, 128, 128);
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      metalness: 0.2,
      roughness: 0.7,
      emissive: 0x0a2a5a,
      emissiveIntensity: 1.5
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // هالة الأرض
    const glowGeometry = new THREE.SphereGeometry(2.75, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.4 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 1.8 ); gl_FragColor = vec4( 0.2, 0.5, 1.0, 1.0 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    earthGroup.add(glow);

    // الشمس فوق - زي الصورة بالظبط
    const sunGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 6.5, 0);
    
    const sunGlowGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunGlowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.5 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 1.5 ); gl_FragColor = vec4( 1.0, 0.6, 0.0, 1.0 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sun.add(sunGlow);
    solarSystem.add(sun);

    // الكواكب - أماكنها بالظبط زي الصورة
    const planets: any[] = [];
    const planetData = [
      { name: 'MERCURY', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury_1024.jpg', size: 0.28, distance: 3.5, angle: Math.PI * 0.25, color: 0x8C8C8C },
      { name: 'VENUS', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus_1024.jpg', size: 0.35, distance: 4, angle: Math.PI * 0.1, color: 0xE6C588 },
      { name: 'MARS', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1024.jpg', size: 0.32, distance: 4.5, angle: Math.PI * 0.5, color: 0xCD5C5C },
      { name: 'JUPITER', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter_1024.jpg', size: 0.7, distance: 5.2, angle: Math.PI * 0.75, color: 0xDAA520 },
      { name: 'SATURN', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn_1024.jpg', size: 0.6, distance: 6, angle: Math.PI * 1.3, hasRing: true, color: 0xF4E4BC },
      { name: 'URANUS', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus_1024.jpg', size: 0.45, distance: 6.8, angle: Math.PI * 1.55, color: 0x4FD0E7 },
      { name: 'NEPTUNE', url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune_1024.jpg', size: 0.45, distance: 7.5, angle: Math.PI * 1.75, color: 0x4B70DD }
    ];

    planetData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.size, 64, 64);
      const planetTexture = textureLoader.load(data.url);
      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 1.2,
        metalness: 0.1,
        roughness: 0.8
      });
      const planet = new THREE.Mesh(geometry, material);

      if (data.hasRing) {
        const ringGeometry = new THREE.RingGeometry(data.size * 1.4, data.size * 2.3, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xDDD3B3,
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
      
      // حلقات ذهبية
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
        opacity: 0.5
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      solarSystem.add(orbitLine);

      orbit.rotation.y = data.angle;
      solarSystem.add(orbit);
      planets.push({ orbit, planet, speed: 0.002 });
    });

    // القمر
    const moonGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg');
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      emissive: 0x888888,
      emissiveIntensity: 1.2
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 3.2;
    moonOrbit.rotation.y = Math.PI * 0.6;
    solarSystem.add(moonOrbit);
    planets.push({ orbit: moonOrbit, planet: moon, speed: 0.008 });

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0x303050, 4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFD700, 12);
    sunLight.position.set(0, 20, 5);
    scene.add(sunLight);

    const centerLight = new THREE.PointLight(0x4a7fff, 5, 50);
    centerLight.position.set(0, 0, 0);
    solarSystem.add(centerLight);

    const animate = () => {
      requestAnimationFrame(animate);

      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.5 + 2 - camera.position.y) * 0.02;
      camera.lookAt(0, -0.5, 0);

      earth.rotation.y += 0.002;
      glow.rotation.y += 0.002;

      planets.forEach((p) => {
        p.orbit.rotation.y += p.speed;
        p.planet.rotation.y += p.speed * 3;
      });

      sun.rotation.y += 0.003;
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

'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 10); // الكاميرا من فوق شوية عشان تشوف الحلزون
    camera.lookAt(0, 0, 0);

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

    // نجوم المجرة - أكتر بكتير
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 15000;
    const starsPos = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
      // توزيع حلزوني للنجوم
      const radius = Math.random() * 25;
      const spinAngle = radius * 0.3;
      const branchAngle = (i % 3) * (Math.PI * 2 / 3);
      
      starsPos[i] = Math.cos(spinAngle + branchAngle) * radius + (Math.random() - 0.5);
      starsPos[i + 1] = (Math.random() - 0.5) * 2;
      starsPos[i + 2] = Math.sin(spinAngle + branchAngle) * radius + (Math.random() - 0.5);
      
      // ألوان مختلفة للنجوم
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        starsColors[i] = 0.6; starsColors[i+1] = 0.7; starsColors[i+2] = 1; // أزرق
      } else if (colorChoice < 0.8) {
        starsColors[i] = 1; starsColors[i+1] = 1; starsColors[i+2] = 0.8; // أصفر
      } else {
        starsColors[i] = 1; starsColors[i+1] = 0.6; starsColors[i+2] = 0.6; // أحمر
      }
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    const starsMaterial = new THREE.PointsMaterial({ 
      size: 0.12, 
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const textureLoader = new THREE.TextureLoader();

    // الأرض في المركز - مش تحت أوي
    const earthGroup = new THREE.Group();
    earthGroup.position.y = -1; // نازلة سنة بسيطة بس
    scene.add(earthGroup);

    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBump = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
    
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 0.15,
      metalness: 0.3,
      roughness: 0.7,
      emissive: 0x1a3a6a,
      emissiveIntensity: 0.6
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // هالة الأرض
    const glowGeometry = new THREE.SphereGeometry(2.3, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.4 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 2.0 ); gl_FragColor = vec4( 0.3, 0.6, 1.0, 1.0 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    earthGroup.add(glow);

    // القمر
    const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg');
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      emissive: 0x444444,
      emissiveIntensity: 0.8
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 3;
    moonOrbit.rotation.x = Math.PI / 6; // مايل
    earthGroup.add(moonOrbit);

    // الكواكب - مسارات حلزونية مايلة
    const planets: any[] = [];
    const planetData = [
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury_1024.jpg', size: 0.2, distance: 3.5, speed: 0.015, color: 0x8B7D6B, tilt: 0.1 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus_1024.jpg', size: 0.3, distance: 4.5, speed: 0.012, color: 0xE6C588, tilt: -0.15 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1024.jpg', size: 0.25, distance: 5.5, speed: 0.01, color: 0xCD5C5C, tilt: 0.2 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter_1024.jpg', size: 0.55, distance: 7, speed: 0.008, color: 0xDAA520, tilt: -0.1 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn_1024.jpg', size: 0.5, distance: 8.5, speed: 0.006, hasRing: true, color: 0xF4E4BC, tilt: 0.25 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus_1024.jpg', size: 0.4, distance: 10, speed: 0.004, color: 0x4FD0E7, tilt: -0.2 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune_1024.jpg', size: 0.4, distance: 11.5, speed: 0.003, color: 0x4B70DD, tilt: 0.15 }
    ];

    planetData.forEach((data, i) => {
      const geometry = new THREE.SphereGeometry(data.size, 64, 64);
      const planetTexture = textureLoader.load(data.url);
      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.8,
        metalness: 0.1,
        roughness: 0.8
      });
      const planet = new THREE.Mesh(geometry, material);

      if (data.hasRing) {
        const ringGeometry = new THREE.RingGeometry(data.size * 1.3, data.size * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xDDD3B3,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.5;
        planet.add(ring);
      }

      const orbit = new THREE.Object3D();
      orbit.add(planet);
      planet.position.x = data.distance;
      planet.position.y = -1;
      orbit.position.y = -1;
      orbit.rotation.x = data.tilt; // كل مسار مايل بزاوية مختلفة = شكل المجرة
      orbit.rotation.z = i * 0.2; // دوران مختلف لكل مسار

      // مسار حلزوني مضيء
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let j = 0; j <= 128; j++) {
        const angle = (j / 128) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * data.distance, 
          -1 + Math.sin(angle * 2) * 0.3, // تموج
          Math.sin(angle) * data.distance
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.5,
        linewidth: 2
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      orbitLine.rotation.x = data.tilt;
      orbitLine.rotation.z = i * 0.2;
      scene.add(orbitLine);

      scene.add(orbit);
      planets.push({ orbit, planet, speed: data.speed });
    });

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0x303050, 2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 6);
    sunLight.position.set(10, 15, 10);
    scene.add(sunLight);

    const galaxyLight = new THREE.PointLight(0x6699ff, 2, 50);
    galaxyLight.position.set(0, -1, 0);
    scene.add(galaxyLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 1 + 8 - camera.position.y) * 0.02;
      camera.lookAt(0, -1, 0);

      earth.rotation.y += 0.002;
      glow.rotation.y += 0.002;

      moonOrbit.rotation.y += 0.01;
      moon.rotation.y += 0.005;

      planets.forEach((p) => {
        p.orbit.rotation.y += p.speed;
        p.planet.rotation.y += p.speed * 1.5;
      });

      stars.rotation.y += 0.00001;
      stars.rotation.x += 0.00001;

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

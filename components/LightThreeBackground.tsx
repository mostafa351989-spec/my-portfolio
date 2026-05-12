'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 12); // نزلنا الكاميرا شوية عشان تشوف المجرة كلها

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
    const starsCount = 10000;
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 400;
      starsPos[i + 1] = (Math.random() - 0.5) * 400;
      starsPos[i + 2] = (Math.random() - 0.5) * 400;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, opacity: 0.8 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const textureLoader = new THREE.TextureLoader();

    // الأرض في المركز بس تحت شوية
    const earthGroup = new THREE.Group();
    earthGroup.position.y = -5; // نزلناها تحت خالص
    scene.add(earthGroup);

    const earthGeometry = new THREE.SphereGeometry(2.2, 64, 64);
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBump = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
    
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 0.15,
      metalness: 0.3,
      roughness: 0.7,
      emissive: 0x1a3a5a,
      emissiveIntensity: 0.5
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // هالة الأرض
    const glowGeometry = new THREE.SphereGeometry(2.45, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.5 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 2.0 ); gl_FragColor = vec4( 0.3, 0.6, 1.0, 0.8 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    earthGroup.add(glow);

    // القمر
    const moonGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg');
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: moonTexture,
      emissive: 0x444444,
      emissiveIntensity: 0.6
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 3.5;
    earthGroup.add(moonOrbit);

    // الكواكب - مسافات منظمة زي المجرة
    const planets: any[] = [];
    const planetData = [
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury_1024.jpg', size: 0.25, distance: 4.5, speed: 0.012, color: 0x8B7D6B, glow: 0x8B7D6B },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus_1024.jpg', size: 0.35, distance: 5.5, speed: 0.009, color: 0xE6C588, glow: 0xE6C588 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1024.jpg', size: 0.3, distance: 6.5, speed: 0.007, color: 0xCD5C5C, glow: 0xCD5C5C },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter_1024.jpg', size: 0.6, distance: 8, speed: 0.005, color: 0xDAA520, glow: 0xDAA520 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn_1024.jpg', size: 0.55, distance: 9.5, speed: 0.003, hasRing: true, color: 0xF4E4BC, glow: 0xF4E4BC },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus_1024.jpg', size: 0.45, distance: 11, speed: 0.002, color: 0x4FD0E7, glow: 0x4FD0E7 },
      { url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune_1024.jpg', size: 0.45, distance: 12.5, speed: 0.0015, color: 0x4B70DD, glow: 0x4B70DD }
    ];

    // أشعة من الأرض للكواكب
    const rays: THREE.Line[] = [];

    planetData.forEach((data, i) => {
      const geometry = new THREE.SphereGeometry(data.size, 64, 64);
      const planetTexture = textureLoader.load(data.url);
      const material = new THREE.MeshStandardMaterial({
        map: planetTexture,
        emissive: new THREE.Color(data.glow),
        emissiveIntensity: 0.7, // منورين جامد
        metalness: 0.1,
        roughness: 0.8
      });
      const planet = new THREE.Mesh(geometry, material);

      if (data.hasRing) {
        const ringGeometry = new THREE.RingGeometry(data.size * 1.3, data.size * 2.1, 64);
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
      planet.position.y = -5; // نفس مستوى الأرض
      orbit.position.y = -5;

      // مسارات مضيئة وواضحة
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let j = 0; j <= 128; j++) {
        const angle = (j / 128) * Math.PI * 2;
        orbitPoints.push(Math.cos(angle) * data.distance, -5, Math.sin(angle) * data.distance);
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: data.glow,
        transparent: true,
        opacity: 0.4, // أوضح
        linewidth: 2
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      // أشعة من الأرض للكوكب - بتتحرك مع الكوكب
      const rayGeometry = new THREE.BufferGeometry();
      const rayMaterial = new THREE.LineBasicMaterial({
        color: data.glow,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      const ray = new THREE.Line(rayGeometry, rayMaterial);
      scene.add(ray);
      rays.push(ray);

      scene.add(orbit);
      planets.push({ orbit, planet, speed: data.speed, distance: data.distance, ray });
    });

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0x202040, 2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 5);
    sunLight.position.set(20, 15, 10);
    scene.add(sunLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 + 3 - camera.position.y) * 0.02;
      camera.lookAt(0, -2, 0);

      earth.rotation.y += 0.001;
      glow.rotation.y += 0.001;

      moonOrbit.rotation.y += 0.008;
      moon.rotation.y += 0.004;

      planets.forEach((p, i) => {
        p.orbit.rotation.y += p.speed;
        p.planet.rotation.y += p.speed * 1.2;

        // تحديث الأشعة من الأرض للكواكب
        const planetPos = new THREE.Vector3();
        p.planet.getWorldPosition(planetPos);
        const earthPos = new THREE.Vector3(0, -5, 0);
        
        const positions = new Float32Array([
          earthPos.x, earthPos.y, earthPos.z,
          planetPos.x, planetPos.y, planetPos.z
        ]);
        p.ray.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        p.ray.geometry.attributes.position.needsUpdate = true;
      });

      stars.rotation.y += 0.00002;

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

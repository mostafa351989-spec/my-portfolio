'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 14); // رفعنا الكاميرا فوق شوية

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

    // 1. النجوم
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 8000;
    const starsPos = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 350;
      starsPos[i + 1] = (Math.random() - 0.5) * 350;
      starsPos[i + 2] = (Math.random() - 0.5) * 350;
      starsSizes[i / 3] = Math.random() * 1.3;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 2. الأرض 4K - كبرناها وبقت أعلى
    const earthGroup = new THREE.Group();
    earthGroup.position.y = -1; // رفعناها لفوق
    scene.add(earthGroup);

    const earthGeometry = new THREE.SphereGeometry(4, 256, 256); // 4K Segments
    const textureLoader = new THREE.TextureLoader();

    // تكستشر 8K للأرض - أوضح حاجة
    const earthTexture = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg');
    const earthBump = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_earth_normal_map.jpg');
    const earthSpecular = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_earth_specular_map.jpg');
    const earthClouds = textureLoader.load('https://www.solarsystemscope.com/textures/download/8k_earth_clouds.jpg');

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 0.2,
      specularMap: earthSpecular,
      specular: new THREE.Color(0x88ccff),
      shininess: 30,
      emissive: 0x112244,
      emissiveIntensity: 0.2
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earth);

    // الهالة أقوى
    const glowGeometry = new THREE.SphereGeometry(4.3, 256, 256);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.4 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 2.0 ); gl_FragColor = vec4( 0.4, 0.7, 1.0, 1.0 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    earthGroup.add(glow);

    // السحب 4K
    const cloudsGeometry = new THREE.SphereGeometry(4.1, 256, 256);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: earthClouds,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    earthGroup.add(clouds);

    // 3. القمر 4K
    const moonGeometry = new THREE.SphereGeometry(0.6, 128, 128);
    const moonTexture = textureLoader.load('https://www.solarsystemscope.com/textures/download/2k_moon.jpg');
    const moonMaterial = new THREE.MeshPhongMaterial({
      map: moonTexture,
      bumpScale: 0.05,
      emissive: 0x222222,
      emissiveIntensity: 0.3
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 6.5;
    earthGroup.add(moonOrbit);

    // 4. الكواكب 4K - كل واحد منور
    const planets: any[] = [];
    const planetData = [
      { name: 'mercury', url: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg', size: 0.4, distance: 7, speed: 0.01, emissive: 0x666666 },
      { name: 'venus', url: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg', size: 0.5, distance: 8.5, speed: 0.008, emissive: 0xaa6633 },
      { name: 'mars', url: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg', size: 0.45, distance: 10, speed: 0.006, emissive: 0x993311 },
      { name: 'jupiter', url: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg', size: 1, distance: 12.5, speed: 0.004, emissive: 0xaa8866 },
      { name: 'saturn', url: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg', size: 0.85, distance: 15.5, speed: 0.003, hasRing: true, emissive: 0xaa9966 },
      { name: 'uranus', url: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg', size: 0.65, distance: 18, speed: 0.002, emissive: 0x66aaee },
      { name: 'neptune', url: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg', size: 0.6, distance: 20.5, speed: 0.0015, emissive: 0x4466dd }
    ];

    planetData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.size, 128, 128);
      const planetTexture = textureLoader.load(data.url);
      const material = new THREE.MeshPhongMaterial({
        map: planetTexture,
        shininess: 15,
        emissive: new THREE.Color(data.emissive),
        emissiveIntensity: 0.4 // بينوروا عشان ميبقوش سود
      });
      const planet = new THREE.Mesh(geometry, material);

      if (data.hasRing) {
        const ringTexture = textureLoader.load('https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png');
        const ringGeometry = new THREE.RingGeometry(data.size * 1.4, data.size * 2.5, 128);
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.3;
        planet.add(ring);
      }

      const orbit = new THREE.Object3D();
      orbit.add(planet);
      planet.position.x = data.distance;
      planet.position.y = -1; // نفس مستوى الأرض

      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let j = 0; j <= 128; j++) {
        const angle = (j / 128) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * data.distance,
          -1,
          Math.sin(angle) * data.distance
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x446688,
        transparent: true,
        opacity: 0.25
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      scene.add(orbit);
      planets.push({ orbit, planet, speed: data.speed });
    });

    // 5. حزام الكويكبات
    const asteroidGeometry = new THREE.BufferGeometry();
    const asteroidCount = 800;
    const asteroidPos = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 11 + (Math.random() - 0.5) * 1.5;
      asteroidPos[i] = Math.cos(angle) * radius;
      asteroidPos[i + 1] = (Math.random() - 0.5) * 0.8 - 1;
      asteroidPos[i + 2] = Math.sin(angle) * radius;
    }
    asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPos, 3));
    const asteroidMaterial = new THREE.PointsMaterial({ color: 0x8B7355, size: 0.1 });
    const asteroids = new THREE.Points(asteroidGeometry, asteroidMaterial);
    scene.add(asteroids);

    // 6. الإضاءة - أقوى 3 أضعاف
    const ambientLight = new THREE.AmbientLight(0x2a2a4e, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.set(20, 10, 15);
    scene.add(sunLight);

    const earthLight = new THREE.PointLight(0x4488ff, 2, 30);
    earthLight.position.set(0, -1, 0);
    scene.add(earthLight);

    // 7. الأنيميشن
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 + 2 - camera.position.y) * 0.02;
      camera.lookAt(0, -1, 0);

      earth.rotation.y += 0.0008;
      clouds.rotation.y += 0.001;
      glow.rotation.y += 0.0008;

      moonOrbit.rotation.y += 0.008;
      moon.rotation.y += 0.004;

      planets.forEach((p) => {
        p.orbit.rotation.y += p.speed;
        p.planet.rotation.y += p.speed * 1.2;
      });

      asteroids.rotation.y += 0.00015;

      stars.rotation.y += 0.00003;
      const sizes = starsGeometry.attributes.size.array as Float32Array;
      for (let i = 0; i < sizes.length; i++) {
        sizes[i] = Math.sin(time + i) * 0.3 + 1;
      }
      starsGeometry.attributes.size.needsUpdate = true;

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

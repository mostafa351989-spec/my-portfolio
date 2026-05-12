'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Mouse Parallax
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // 1. النجوم
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const starsPos = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 200;
      starsPos[i + 1] = (Math.random() - 0.5) * 200;
      starsPos[i + 2] = (Math.random() - 0.5) * 200;
      starsSizes[i / 3] = Math.random() * 1.5;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 2. الكرة الأرضية
    const earthGeometry = new THREE.SphereGeometry(2.2, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBump = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpecular = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 0.05,
      specularMap: earthSpecular,
      specular: new THREE.Color(0x333333),
      shininess: 15,
      emissive: 0x112244,
      emissiveIntensity: 0.1
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // 3. الهالة Glow حوالين الأرض
    const glowGeometry = new THREE.SphereGeometry(2.45, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.6 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 4.0 ); gl_FragColor = vec4( 0.79, 0.69, 0.22, 1.0 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // 4. السحب
    const cloudsGeometry = new THREE.SphereGeometry(2.25, 64, 64);
    const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png');
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // 5. القمر
    const moonGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg');
    const moonMaterial = new THREE.MeshPhongMaterial({
      map: moonTexture,
      bumpScale: 0.02
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 3.5;
    scene.add(moonOrbit);

    // 6. حزام الكويكبات
    const asteroidGeometry = new THREE.BufferGeometry();
    const asteroidCount = 300;
    const asteroidPos = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8.5 + (Math.random() - 0.5) * 0.8;
      asteroidPos[i] = Math.cos(angle) * radius;
      asteroidPos[i + 1] = (Math.random() - 0.5) * 0.4;
      asteroidPos[i + 2] = Math.sin(angle) * radius;
    }
    asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPos, 3));
    const asteroidMaterial = new THREE.PointsMaterial({ color: 0x8B7355, size: 0.06 });
    const asteroids = new THREE.Points(asteroidGeometry, asteroidMaterial);
    scene.add(asteroids);

    // 7. الكواكب
    const planets: any[] = [];
    const planetData = [
      { color: 0xff0000, size: 0.3, distance: 4, speed: 0.008 },
      { color: 0xff7f00, size: 0.25, distance: 5.2, speed: 0.006 },
      { color: 0xffff00, size: 0.35, distance: 6.5, speed: 0.004 },
      { color: 0x00ff00, size: 0.2, distance: 7.8, speed: 0.003 },
      { color: 0x0000ff, size: 0.4, distance: 9.5, speed: 0.002, hasRing: true }, // زحل
      { color: 0x4b0082, size: 0.3, distance: 10.8, speed: 0.0015 },
      { color: 0x9400d3, size: 0.25, distance: 12.2, speed: 0.001 }
    ];

    planetData.forEach((data, i) => {
      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.3,
        shininess: 100
      });
      const planet = new THREE.Mesh(geometry, material);

      // حلقات زحل
      if (data.hasRing) {
        const ringGeometry = new THREE.RingGeometry(data.size * 1.5, data.size * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x8888ff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.5;
        planet.add(ring);
      }

      const orbit = new THREE.Object3D();
      orbit.add(planet);
      planet.position.x = data.distance;

      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let j = 0; j <= 64; j++) {
        const angle = (j / 64) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * data.distance,
          0,
          Math.sin(angle) * data.distance
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.15
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      scene.add(orbit);
      planets.push({ orbit, planet, speed: data.speed });
    });

    // 8. الإضاءة
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(10, 5, 10);
    scene.add(sunLight);

    const pointLight = new THREE.PointLight(0xC9B037, 0.6, 50);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 9. الأنيميشن
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Mouse Parallax
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      // لف الأرض
      earth.rotation.y += 0.002;
      clouds.rotation.y += 0.0025;
      glow.rotation.y += 0.002;

      // القمر
      moonOrbit.rotation.y += 0.015;
      moon.rotation.y += 0.01;

      // الكواكب
      planets.forEach((p) => {
        p.orbit.rotation.y += p.speed;
        p.planet.rotation.y += p.speed * 2;
      });

      // الكويكبات
      asteroids.rotation.y += 0.0003;

      // النجوم تلألأ
      stars.rotation.y += 0.0001;
      const sizes = starsGeometry.attributes.size.array as Float32Array;
      for (let i = 0; i < sizes.length; i++) {
        sizes[i] = Math.sin(time + i) * 0.5 + 1;
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

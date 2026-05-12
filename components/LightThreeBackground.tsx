'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 16;

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

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 7000;
    const starsPos = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);

    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPos[i] = (Math.random() - 0.5) * 300;
      starsPos[i + 1] = (Math.random() - 0.5) * 300;
      starsPos[i + 2] = (Math.random() - 0.5) * 300;
      starsSizes[i / 3] = Math.random() * 1.2;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const earthGeometry = new THREE.SphereGeometry(3.5, 128, 128);
    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    const earthBump = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
    const earthSpecular = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 0.15,
      specularMap: earthSpecular,
      specular: new THREE.Color(0x66aaff),
      shininess: 25,
      emissive: 0x112244,
      emissiveIntensity: 0.15
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const glowGeometry = new THREE.SphereGeometry(3.75, 128, 128);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize( normalMatrix * normal ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow( 0.5 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 3.0 ); gl_FragColor = vec4( 0.3, 0.6, 1.0, 1.0 ) * intensity; }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    const cloudsGeometry = new THREE.SphereGeometry(3.6, 128, 128);
    const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png');
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.5
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    const moonGeometry = new THREE.SphereGeometry(0.5, 64, 64);
    const moonTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg');
    const moonMaterial = new THREE.MeshPhongMaterial({
      map: moonTexture,
      bumpScale: 0.04
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonOrbit = new THREE.Object3D();
    moonOrbit.add(moon);
    moon.position.x = 5.5;
    scene.add(moonOrbit);

    const planets: any[] = [];
    const planetData = [
      { texture: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury_1024.jpg', size: 0.35, distance: 6, speed: 0.01 },
      { texture: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus_1024.jpg', size: 0.45, distance: 7.5, speed: 0.008 },
      { texture: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1024.jpg', size: 0.4, distance: 9, speed: 0.006 },
      { texture: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter_1024.jpg', size: 0.8, distance: 11, speed: 0.004 },
      { texture: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn_1024.jpg', size: 0.7, distance: 13.5, speed: 0.003, hasRing: true },
      { texture: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus_1024.jpg', size: 0.6, distance: 15.5, speed: 0.002 },
      { texture: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune_1024.jpg', size: 0.55, distance: 17.5, speed: 0.0015 }
    ];

    planetData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.size, 64, 64);
      const planetTexture = textureLoader.load(data.texture);
      const material = new THREE.MeshPhongMaterial({
        map: planetTexture,
        shininess: 10
      });
      const planet = new THREE.Mesh(geometry, material);

      if (data.hasRing) {
        const ringTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturnringcolor.jpg');
        const ringGeometry = new THREE.RingGeometry(data.size * 1.3, data.size * 2.3, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.2;
        planet.add(ring);
      }

      const orbit = new THREE.Object3D();
      orbit.add(planet);
      planet.position.x = data.distance;

      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let j = 0; j <= 128; j++) {
        const angle = (j / 128) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * data.distance,
          0,
          Math.sin(angle) * data.distance
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x334455,
        transparent: true,
        opacity: 0.2
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      scene.add(orbit);
      planets.push({ orbit, planet, speed: data.speed });
    });

    const asteroidGeometry = new THREE.BufferGeometry();
    const asteroidCount = 500;
    const asteroidPos = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + (Math.random() - 0.5) * 1;
      asteroidPos[i] = Math.cos(angle) * radius;
      asteroidPos[i + 1] = (Math.random() - 0.5) * 0.5;
      asteroidPos[i + 2] = Math.sin(angle) * radius;
    }
    asteroidGeometry.setAttribute('position', new THREE.BufferAttribute(asteroidPos, 3));
    const asteroidMaterial = new THREE.PointsMaterial({ color: 0x6B5D4F, size: 0.08 });
    const asteroids = new THREE.Points(asteroidGeometry, asteroidMaterial);
    scene.add(asteroids);

    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff4e6, 2);
    sunLight.position.set(15, 8, 10);
    scene.add(sunLight);

    const earthLight = new THREE.PointLight(0x4488ff, 1, 20);
    earthLight.position.set(0, 0, 0);
    scene.add(earthLight);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      camera.position.x += (mouseX * 4 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      earth.rotation.y += 0.001;
      clouds.rotation.y += 0.0012;
      glow.rotation.y += 0.001;

      moonOrbit.rotation.y += 0.01;
      moon.rotation.y += 0.005;

      planets.forEach((p) => {
        p.orbit.rotation.y += p.speed;
        p.planet.rotation.y += p.speed * 1.5;
      });

      asteroids.rotation.y += 0.0002;

      stars.rotation.y += 0.00005;
      const sizes = starsGeometry.attributes.size.array as Float32Array;
      for (let i = 0; i < sizes.length; i++) {
        sizes[i] = Math.sin(time + i) * 0.4 + 0.8;
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

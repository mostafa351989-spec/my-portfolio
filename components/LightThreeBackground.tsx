'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function LightThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDay, setIsDay] = useState(false);
  const isDayRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || containerRef.current.children.length > 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setLoadingProgress(100);
        setTimeout(() => setLoading(false), 500);
        clearInterval(loadingInterval);
      } else {
        setLoadingProgress(Math.floor(progress));
      }
    }, 200);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.85);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4f46e5, roughness: 0.2, metalness: 0.9,
      emissive: 0x4f46e5, emissiveIntensity: 0.3
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const torusGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x818cf8, metalness: 0.9, roughness: 0.1,
      emissive: 0x818cf8, emissiveIntensity: 0.2
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) positions[i] = (Math.random() - 0.5) * 50;
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.8 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(10, 10, -15);
    sun.visible = false;
    scene.add(sun);

    const miniSpheres: THREE.Mesh[] = [];
    const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d];
    for (let i = 0; i < 3; i++) {
      const miniGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const miniMat = new THREE.MeshStandardMaterial({
        color: colors[i], emissive: colors[i], emissiveIntensity: 0.5, metalness: 0.8
      });
      const miniSphere = new THREE.Mesh(miniGeo, miniMat);
      miniSpheres.push(miniSphere);
      scene.add(miniSphere);
    }

    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('MOSTAFA', { font: font, size: 0.5, height: 0.1 });
      textGeometry.center();
      const textMaterial = new THREE.MeshStandardMaterial({
        color: 0x4f46e5, metalness: 0.8, roughness: 0.2, emissive: 0x4f46e5, emissiveIntensity: 0.2
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.z = -5;
      scene.add(textMesh);
    });

    const particles: THREE.Points[] = [];
    const createExplosion = (x: number, y: number, color: number) => {
      const particleCount = 100;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      const velArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = x; posArray[i + 1] = y; posArray[i + 2] = 0;
        velArray[i] = (Math.random() - 0.5) * 0.5;
        velArray[i + 1] = (Math.random() - 0.5) * 0.5;
        velArray[i + 2] = (Math.random() - 0.5) * 0.5;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({ color: color, size: 0.1, transparent: true });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      particleSystem.userData = { velocities: velArray, life: 1 };
      scene.add(particleSystem);
      particles.push(particleSystem);
    };

    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(1, 2, 1);
    scene.add(dirLight);
    camera.position.z = 3.5;

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleClick = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      createExplosion(x * 3, y * 3, material.color.getHex());
    };
    window.addEventListener('click', handleClick);

    const colorPalette = [0x4f46e5, 0x3b82f6, 0x10b981, 0xef4444, 0xf59e0b];
    let colorIndex = 0;
    const colorInterval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colorPalette.length;
      const newColor = colorPalette[colorIndex];
      material.color.setHex(newColor);
      material.emissive.setHex(newColor);
      torusMaterial.color.setHex(newColor);
      torusMaterial.emissive.setHex(newColor);
    }, 10000);

    let time = 0;
    let frameId: number;

    function animate() {
      frameId = requestAnimationFrame(animate);
      time += 0.005;

      sphere.rotation.x = time * 0.5;
      sphere.rotation.y = time * 0.8;
      sphere.position.y = Math.sin(time) * 0.2;
      sphere.position.x += (mouseRef.current.x * 0.5 - sphere.position.x) * 0.02;
      sphere.position.y += (-mouseRef.current.y * 0.5 - sphere.position.y) * 0.02;

      torus.rotation.z = time * -0.3;
      torus.rotation.x = Math.PI / 2 + mouseRef.current.y * 0.3;

      if (isDayRef.current) {
        stars.visible = false;
        sun.visible = true;
        sun.rotation.y = time * 0.1;
      } else {
        stars.visible = true;
        sun.visible = false;
        stars.rotation.y = time * 0.05;
      }

      miniSpheres.forEach((mini, i) => {
        const angle = time * (1 + i * 0.5) + (i * Math.PI * 2 / 3);
        mini.position.x = Math.cos(angle) * 2.5;
        mini.position.y = Math.sin(angle) * 2.5;
        mini.position.z = Math.sin(time * 2 + i) * 0.5;
        mini.rotation.x = time * 2;
        mini.rotation.y = time * 2;
      });

      particles.forEach((particle, index) => {
        const positions = particle.geometry.attributes.position.array as Float32Array;
        const velocities = particle.userData.velocities;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          velocities[i + 1] -= 0.01;
        }
        particle.geometry.attributes.position.needsUpdate = true;
        particle.userData.life -= 0.02;
        (particle.material as THREE.PointsMaterial).opacity = particle.userData.life;
        if (particle.userData.life <= 0) {
          scene.remove(particle);
          particles.splice(index, 1);
        }
      });

      composer.render();
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(loadingInterval);
      clearInterval(colorInterval);
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  const toggleDayNight = () => {
    setIsDay(!isDay);
    isDayRef.current =!isDayRef.current;
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            MOSTAFA
          </div>
          <div className="mt-8 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="mt-4 text-white text-xl">{loadingProgress}%</div>
        </div>
      )}

      <button
        onClick={toggleDayNight}
        className="fixed top-6 right-6 z-40 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition"
      >
        {isDay? '🌙 ليل' : '☀️ نهار'}
      </button>

      <div
        ref={containerRef}
        className="fixed inset-0 -z-10 pointer-events-auto cursor-pointer transition-all duration-1000"
        style={{
          background: isDay
          ? 'linear-gradient(to bottom, #87CEEB, #E0F6FF)'
            : 'radial-gradient(circle at center, #0f0f1f, #000)'
        }}
      />
    </>
  );
}

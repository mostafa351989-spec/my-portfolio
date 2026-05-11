'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || containerRef.current.children.length > 0) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 1. الكورة البنفسجي بتاعتك زي ما هي
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.3, metalness: 0.7 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 2. حلقة بتلف حوالين الكورة
    const torusGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x818cf8, metalness: 0.8, roughness: 0.2 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);

    // 3. نجوم في الخلفية
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 500;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 50;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(1, 2, 1);
    scene.add(dirLight);

    camera.position.z = 3.5;
    let time = 0;
    let frameId: number;
    
    function animate() {
      frameId = requestAnimationFrame(animate);
      time += 0.005;
      
      // الكورة البنفسجي بتلف
      sphere.rotation.x = time * 0.5;
      sphere.rotation.y = time * 0.8;
      sphere.position.y = Math.sin(time) * 0.2;
      
      // الحلقة بتلف عكسها
      torus.rotation.z = time * -0.3;
      
      // النجوم بتلف ببطء
      stars.rotation.y = time * 0.05;
      
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 pointer-events-none" 
      style={{ background: 'radial-gradient(circle at center, #0f0f1f, #000)' }} 
    />
  );
}

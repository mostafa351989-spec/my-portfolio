'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // نمنع تشغيله مرتين
    if (mountRef.current.childElementCount > 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x4f46e5, 
      roughness: 0.3, 
      metalness: 0.7 
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const light1 = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(1, 1, 1);
    scene.add(light2);

    camera.position.z = 3.5;

    let frameId: number;
    let time = 0;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.005;
      sphere.rotation.x = time * 0.5;
      sphere.rotation.y = time * 0.8;
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
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'radial-gradient(circle at center, #0f0f1f, #000)' }}
    />
  );
}

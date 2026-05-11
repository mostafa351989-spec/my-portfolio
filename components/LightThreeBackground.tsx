'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LightThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.3, metalness: 0.7 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 2, 1);
    scene.add(dirLight);
    camera.position.z = 3.5;
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.005;
      sphere.rotation.x = time * 0.5;
      sphere.rotation.y = time * 0.8;
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
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return <div ref={containerRef} className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(circle at center, #0f0f1f, #000)' }} />;
}

"use client";

// VioletOrb — React Three Fiber
// Substitui o CSS blob da Statement section
// Esfera 3D com MeshDistortMaterial + mouse tracking

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function OrbMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Slow drift rotation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    // Mouse tracking tilt
    meshRef.current.rotation.x +=
      (-state.mouse.y * 0.25 - meshRef.current.rotation.x) * 0.04;
    meshRef.current.rotation.y +=
      (state.mouse.x * 0.35 - meshRef.current.rotation.y) * 0.04;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#a855f7"
        emissive="#6b21a8"
        emissiveIntensity={0.4}
        roughness={0.05}
        metalness={0.9}
        distort={0.35}
        speed={1.8}
      />
    </Sphere>
  );
}

export default function VioletOrb({
  size = 280,
}: {
  size?: number;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className="pointer-events-none select-none"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[4, 4, 4]} color="#a855f7" intensity={3} />
        <pointLight position={[-4, -3, -4]} color="#7c3aed" intensity={1} />
        <pointLight position={[0, 5, -2]} color="#ffffff" intensity={0.4} />
        <OrbMesh />
      </Canvas>
    </div>
  );
}

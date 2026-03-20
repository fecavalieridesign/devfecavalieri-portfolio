"use client";

// GemStone — React Three Fiber
// Substitui o SVG wireframe da Hero section
// Gem/diamante 3D wireframe com float e mouse tilt
// Scroll parallax recebido como prop scrollY (MotionValue)

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GemMesh() {
  const groupRef = useRef<THREE.Group>(null);

  // Memoized geometries and materials — created once, not on every render
  const { crownGeo, pavilionGeo, wireMat, wireFaceMat } = useMemo(() => {
    const crownGeo    = new THREE.ConeGeometry(0.7, 0.7, 8, 1, false);
    const pavilionGeo = new THREE.ConeGeometry(0.7, 1.1, 8, 1, false);
    const wireMat = new THREE.MeshBasicMaterial({
      color: "#a855f7",
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const wireFaceMat = new THREE.MeshStandardMaterial({
      color: "#a855f7",
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
    });
    return { crownGeo, pavilionGeo, wireMat, wireFaceMat };
  }, []);

  // Dispose geometries and materials on unmount to prevent GPU memory leaks
  useEffect(() => {
    return () => {
      crownGeo.dispose();
      pavilionGeo.dispose();
      wireMat.dispose();
      wireFaceMat.dispose();
    };
  }, [crownGeo, pavilionGeo, wireMat, wireFaceMat]);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Float animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    // Slow spin
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    // Mouse tilt
    groupRef.current.rotation.x +=
      (-state.mouse.y * 0.2 - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      {/* Crown (topo) */}
      <group position={[0, 0.55, 0]}>
        <mesh geometry={crownGeo} material={wireFaceMat} />
        <mesh geometry={crownGeo} material={wireMat} />
      </group>
      {/* Pavilion (base invertida) */}
      <group position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <mesh geometry={pavilionGeo} material={wireFaceMat} />
        <mesh geometry={pavilionGeo} material={wireMat} />
      </group>
    </group>
  );
}

export default function GemStone({ size = 180 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="pointer-events-none select-none"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[3, 3, 3]} color="#a855f7" intensity={2} />
        <pointLight position={[-3, -2, 2]} color="#7c3aed" intensity={0.8} />
        <GemMesh />
      </Canvas>
    </div>
  );
}

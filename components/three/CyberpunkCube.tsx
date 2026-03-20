"use client";

// CyberpunkCube — React Three Fiber
// Cubo 3D wireframe com faces que explodem no hover
// + scan line + glitch + corner brackets CSS
// Estética: cyberpunk / futurista violet neon

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Face data: position base, rotation, normal (direção de explosão)
const FACES = [
  { pos: [ 0,    0,    0.5], rot: [0,            0, 0], n: [ 0,  0,  1] },
  { pos: [ 0,    0,   -0.5], rot: [0,            0, 0], n: [ 0,  0, -1] },
  { pos: [ 0.5,  0,    0  ], rot: [0, Math.PI / 2, 0], n: [ 1,  0,  0] },
  { pos: [-0.5,  0,    0  ], rot: [0, Math.PI / 2, 0], n: [-1,  0,  0] },
  { pos: [ 0,    0.5,  0  ], rot: [Math.PI / 2,   0, 0], n: [ 0,  1,  0] },
  { pos: [ 0,   -0.5,  0  ], rot: [Math.PI / 2,   0, 0], n: [ 0, -1,  0] },
] as const;

function CubeMesh({ hovered }: { hovered: boolean }) {
  const groupRef   = useRef<THREE.Group>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const scanRef    = useRef<THREE.Mesh>(null);
  const lightRef   = useRef<THREE.PointLight>(null);

  const faceRefs    = useRef<(THREE.Mesh | null)[]>(Array(6).fill(null));
  const faceMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>(Array(6).fill(null));

  // Animation values tracked with refs (avoids re-renders in useFrame)
  const a = useRef({ explode: 0, rotY: 0.3, rotX: 0.08, glow: 0.2, scanY: -0.65 });

  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), []);
  const planeGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const v = a.current;
    const t = state.clock.elapsedTime;
    const lp = Math.min(delta * 5, 1);

    // Smooth lerp to targets
    v.explode += ((hovered ? 0.28 : 0)    - v.explode) * lp;
    v.rotY    += ((hovered ? 1.6  : 0.28) - v.rotY)   * lp * 0.35;
    v.rotX    += ((hovered ? 0.38 : 0.07) - v.rotX)   * lp * 0.35;
    v.glow    += ((hovered ? 1.0  : 0.2)  - v.glow)   * lp;

    // Rotation
    groupRef.current.rotation.y += v.rotY * delta;
    groupRef.current.rotation.x += v.rotX * delta;

    // Cyberpunk glitch: rapid X jitter at random spikes
    const glitch = hovered && Math.sin(t * 20) > 0.94
      ? (Math.random() - 0.5) * 0.09 : 0;
    groupRef.current.position.x = glitch;

    // Explode faces outward
    FACES.forEach((face, i) => {
      const mesh = faceRefs.current[i];
      const mat  = faceMatRefs.current[i];
      if (!mesh || !mat) return;
      mesh.position.set(
        face.pos[0] + face.n[0] * v.explode,
        face.pos[1] + face.n[1] * v.explode,
        face.pos[2] + face.n[2] * v.explode,
      );
      mat.opacity          = hovered ? 0.16 : 0.04;
      mat.emissiveIntensity = v.glow * 0.9;
    });

    // Edge glow
    if (edgeMatRef.current) {
      edgeMatRef.current.opacity = 0.28 + v.glow * 0.72;
    }

    // Point light intensity
    if (lightRef.current) {
      lightRef.current.intensity += ((hovered ? 5 : 1.5) - lightRef.current.intensity) * lp;
    }

    // Scan line sweep (only when hovered)
    if (scanRef.current) {
      if (hovered) {
        v.scanY += delta * 1.6;
        if (v.scanY > 0.65) v.scanY = -0.65;
        scanRef.current.position.y = v.scanY;
        scanRef.current.visible    = true;
        const mat = scanRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.85 - Math.abs(v.scanY / 0.65) * 0.35;
      } else {
        scanRef.current.visible = false;
        v.scanY = -0.65;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary neon light */}
      <pointLight ref={lightRef} position={[2, 2, 3]} color="#a855f7" intensity={1.5} />
      <pointLight position={[-2, -1, 2]} color="#7c3aed" intensity={0.8} />

      {/* Wireframe edges — neon violet */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial
          ref={edgeMatRef}
          color="#c084fc"
          transparent
          opacity={0.3}
        />
      </lineSegments>

      {/* 6 translucent face planes */}
      {FACES.map((face, i) => (
        <mesh
          key={i}
          ref={(el) => { faceRefs.current[i] = el; }}
          position={face.pos as [number, number, number]}
          rotation={face.rot as [number, number, number]}
          geometry={planeGeo}
        >
          <meshStandardMaterial
            ref={(el: THREE.MeshStandardMaterial | null) => { faceMatRefs.current[i] = el; }}
            color="#a855f7"
            emissive="#7c3aed"
            emissiveIntensity={0.2}
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Scan line — horizontal plane that sweeps top-to-bottom */}
      <mesh ref={scanRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[1.5, 0.014]} />
        <meshBasicMaterial
          color="#e879f9"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// CSS corner brackets component
function CornerBrackets({ active }: { active: boolean }) {
  const corners = [
    "top-0 left-0 border-t border-l",
    "top-0 right-0 border-t border-r",
    "bottom-0 left-0 border-b border-l",
    "bottom-0 right-0 border-b border-r",
  ];
  return (
    <>
      {corners.map((cls, i) => (
        <div
          key={i}
          className={`absolute transition-all duration-400 pointer-events-none ${cls} ${
            active
              ? "border-violet/70 w-6 h-6"
              : "border-white/15 w-4 h-4"
          }`}
        />
      ))}
    </>
  );
}

export default function CyberpunkCube({ size = 280 }: { size?: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Corner bracket decorations */}
      <CornerBrackets active={hovered} />

      {/* Status label — appears on hover */}
      <div
        className={`absolute top-2 left-2 font-mono text-[7px] tracking-[0.22em] uppercase transition-all duration-300 pointer-events-none ${
          hovered ? "opacity-100 text-violet/55" : "opacity-0"
        }`}
      >
        SYS_3D
      </div>
      <div
        className={`absolute bottom-2 right-2 font-mono text-[7px] tracking-[0.22em] uppercase transition-all duration-300 pointer-events-none ${
          hovered ? "opacity-100 text-violet/40" : "opacity-0"
        }`}
      >
        ACTIVE
      </div>

      {/* Ambient outer glow — CSS, no WebGL cost */}
      <div
        className="absolute inset-[20%] rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
          opacity: hovered ? 1 : 0.4,
        }}
      />

      {/* WebGL Canvas */}
      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        camera={{ position: [0, 0, 2.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.05} />
        <CubeMesh hovered={hovered} />
      </Canvas>
    </div>
  );
}

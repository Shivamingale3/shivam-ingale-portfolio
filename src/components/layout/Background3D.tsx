"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FerrofluidSurface() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // High resolution plane
  const geometry = useMemo(() => new THREE.PlaneGeometry(20, 20, 256, 256), []);

  const originalPositions = useMemo(() => {
    return geometry.attributes.position.array.slice();
  }, [geometry]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Slower time for heavy liquid feel
    const time = state.clock.elapsedTime * 0.5;
    const { array } = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < array.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];

      // Base wave (Higher frequency = more bumps)
      let z = Math.sin(x * 3 + time * 0.5) * Math.cos(y * 3 + time * 0.3) * 0.2;

      // Spike generation (Tripled frequency from previous version)
      const spike1 = Math.sin(x * 9 + time) * Math.cos(y * 9 + time);

      // Smaller individual size (Reduced multiplier)
      // Power of 1.5 keeps them rounded but small
      z += Math.pow(Math.abs(spike1), 1.5) * 0.6;

      // Surface texture
      z += Math.sin(x * 15 - time * 2) * 0.03;

      array[i + 2] = z;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    // Tilted to view as a floor/sea
    meshRef.current.rotation.x = -Math.PI / 2.8;
    meshRef.current.rotation.z = time * 0.02;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color="#080808"
        roughness={0.05} // High shine
        metalness={1.0}
        envMapIntensity={3.0} // High reflection
      />
    </mesh>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      {/* Helper gradient for text readability at the top */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/90 to-black z-10" />

      <div className="w-full h-full opacity-100">
        <Canvas camera={{ position: [0, 0, 12], fov: 35 }}>
          <fog attach="fog" args={["black", 5, 25]} />
          <ambientLight intensity={0.2} />

          {/* Bright lighting for reflections */}
          <pointLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
          <pointLight position={[-10, 5, 2]} intensity={2} color="#6666ff" />

          <FerrofluidSurface />

          <Environment preset="warehouse" />
        </Canvas>
      </div>
    </div>
  );
}

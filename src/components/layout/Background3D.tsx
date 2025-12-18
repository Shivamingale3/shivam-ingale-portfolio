"use client";

// The background color is handled by globals.css (light/dark mode variables)
// This component is kept as a placeholder if we want to add non-intrusive background elements later.
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { FerrofluidSea } from "../3d/FerrofluidSea";

export function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <FerrofluidSea />
          <fog attach="fog" args={["#000", 5, 20]} />
        </Suspense>
      </Canvas>
    </div>
  );
}

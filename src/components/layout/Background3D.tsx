"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Earth } from "../3d/Earth";
import { SkySystem } from "../3d/SkySystem";

// Waiting for new idea...
export function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SkySystem />
          <Earth />
          {/* Fog for depth blending */}
          <fog attach="fog" args={["#000", 10, 25]} />{" "}
          {/* Will need dynamic fog color based on theme? */}
        </Suspense>
      </Canvas>
    </div>
  );
}

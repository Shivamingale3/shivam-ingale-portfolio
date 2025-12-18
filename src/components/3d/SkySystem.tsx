"use client";

import { Stars, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function SkySystem() {
  const { theme } = useTheme();

  // Textures
  const [moonTexture, sunTexture, glowTexture] = useTexture([
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png", // Using as Sun/Glow base
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0_alpha.png", // Glow
  ]);

  const sunRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.05;
    if (moonRef.current) {
      moonRef.current.rotation.y = t;
    }
    if (sunRef.current) {
      sunRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <>
      {theme === "dark" ? (
        <group>
          {/* Stars */}
          <Stars
            radius={100}
            depth={50}
            count={7000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Moon Group */}
          <group position={[5, 6, -15]}>
            {/* Moon Sphere */}
            <mesh ref={moonRef} rotation={[0, -0.5, 0]}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshStandardMaterial
                map={moonTexture}
                roughness={0.7}
                metalness={0.1}
                emissiveMap={moonTexture}
                emissive="#ffffff"
                emissiveIntensity={0.2}
              />
            </mesh>

            {/* Moon Glow Sprite */}
            <sprite scale={[6, 6, 1]}>
              <spriteMaterial
                map={glowTexture}
                color="#88aaff"
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
              />
            </sprite>

            {/* Light */}
            <pointLight intensity={2} color="#ccddff" distance={50} decay={2} />
          </group>

          <ambientLight intensity={0.1} color="#111122" />
        </group>
      ) : (
        <group>
          {/* Sun Group */}
          <group position={[0, 5, -20]}>
            {" "}
            {/* Centered Sun */}
            {/* Sun Sphere */}
            <mesh ref={sunRef}>
              <sphereGeometry args={[2.5, 64, 64]} />
              <meshBasicMaterial
                map={sunTexture} // Fallback to basic texture or noise
                color="#ffddaa"
              />
            </mesh>
            {/* Sun Glow Sprite (Big Halo) */}
            <sprite scale={[12, 12, 1]}>
              <spriteMaterial
                map={glowTexture}
                color="#ffaa00"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
            {/* Inner Core Sprite */}
            <sprite scale={[5, 5, 1]}>
              <spriteMaterial
                map={glowTexture}
                color="#ffffcc"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
              />
            </sprite>
            {/* Light */}
            <pointLight
              intensity={3}
              color="#ffaa00"
              distance={100}
              decay={1}
            />
          </group>

          {/* Atmosphere */}
          <ambientLight intensity={1.5} color="#ffffff" />
          <directionalLight
            position={[0, 10, 5]}
            intensity={4}
            color="#ffffff"
            castShadow
          />
        </group>
      )}
    </>
  );
}

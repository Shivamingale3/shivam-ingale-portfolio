"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function Earth() {
  const { theme } = useTheme();

  // High-res textures
  // Using 2k-4k standard maps for stability, Clouds from matteason (8k)
  const [colorMap, normalMap, specularMap, lightsMap, cloudsMap] = useTexture([
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png",
    "https://matteason.github.io/daily-cloud-maps/8192x4096-clouds-alpha.png",
  ]);

  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsedTime * 0.05; // Slow rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = elapsedTime * 0.07; // Slightly faster clouds
    }
  });

  return (
    <group position={[0, -2.5, 0]} rotation={[0.4, 0, 0]}>
      {/* 
        Position y=-2.5 moves it down so only the top is visible. 
        Rotation [0.4, 0, 0] tilts it slightly towards camera. 
      */}

      {/* Earth Surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specularMap}
          emissiveMap={lightsMap}
          emissive={new THREE.Color(0xffff88)} // Warm city lights
          emissiveIntensity={theme === "dark" ? 2 : 0.5} // Brighter lights at night
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Clouds Layer */}
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false} // Prevent z-fighting occlusions
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Atmosphere Glow (Fake Rim) */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color={theme === "dark" ? "#4444ff" : "#88ccff"}
          transparent
          opacity={0.1}
          side={THREE.BackSide} // Inner glow feel
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

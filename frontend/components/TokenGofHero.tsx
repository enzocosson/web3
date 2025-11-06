"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls, Center } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Model } from "./TokenGof";

export default function TokenGofHero() {
  return (
    <Canvas
      shadows
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 100,
      }}
      gl={{ alpha: true }}
      camera={{ position: [0, 0, 8], fov: 45 }}
    >
      {/* Lumières dorées pour créer une ambiance premium */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffd700" />
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.8}
        color="#ffa500"
      />
      <pointLight position={[0, 3, 0]} intensity={1} color="#fff" />

      {/* Modèle 3D avec animation de flottement */}
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Center>
            <Model
              scale={0.06}
              position={[0, -0.5, 0]}
              rotation={[0, -Math.PI / 6, 0]}
            />
          </Center>
        </Float>
        <Environment preset="studio" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.5}
        />
      </Suspense>

      {/* Effets de post-processing : Bloom pour le blur brillant */}
      <EffectComposer>
        <Bloom
          intensity={2.5}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.8}
          levels={8}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0015, 0.0015]}
        />
      </EffectComposer>
    </Canvas>
  );
}

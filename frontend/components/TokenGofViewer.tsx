'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import { Model } from './TokenGof'
import styles from './TokenGof.module.scss'

export default function TokenGofViewer() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Golden Token 3D</h2>
      <div className={styles.canvas3D}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} />
          
          {/* Lumières */}
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1}
            castShadow 
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Modèle 3D avec Suspense pour le chargement */}
          <Suspense fallback={null}>
            <Model scale={1.5} position={[0, 0, 0]} />
            <Environment preset="sunset" />
          </Suspense>
          
          {/* Contrôles pour faire tourner le modèle */}
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>
    </div>
  )
}

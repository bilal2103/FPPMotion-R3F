import { MeshReflectorMaterial, useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { Mesh } from 'three'

export default function Mirror() {
  const { scene } = useGLTF('/models/wooden_mirror.glb')
  
  useEffect(() => {
    // Traverse through all objects in the scene to find the mirror surface
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        // Find the mesh with mirror material and hide it (we'll replace it with our own)
        if (child.material.name === 'M_F_WM_Mirror') {
          console.log('Found mirror surface! Hiding original...')
          child.visible = false // Hide the original mirror surface
        }
      }
    })
  }, [scene])
  
  return (
    <group position={[0, 0, 0]} scale={[1, 1, 1]}>
      {/* The wooden mirror frame */}
      <primitive object={scene} scale={[0.01, 0.01, 0.01]} rotation={[0, -Math.PI/2, 0]}/>
      
      {/* Our custom reflective surface positioned within the frame */}
      <mesh position={[0, 1, 0.02]} rotation={[0, -Math.PI/2, 0]} scale={[0.01, 0.01, 0.01]}>
        <planeGeometry args={[131, 190]} />
        <MeshReflectorMaterial
          resolution={1024}
          mirror={1}
          mixBlur={0.5}
          mixStrength={2}
          blur={[400, 100]}
          minDepthThreshold={0.8}
          maxDepthThreshold={1}
          depthScale={1}
          color="#888"
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}
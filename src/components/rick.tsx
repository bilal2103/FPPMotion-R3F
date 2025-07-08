import { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import FBXLoader from '../loaders/fbxLoader';
import * as THREE from 'three';

export default function MyFBXModel({ path }: { path: string }) {
  const model = useLoader(FBXLoader, path);
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    model.scale.set(0.01, 0.01, 0.01);
  }, [model]);
  return <primitive ref={ref} object={model} position={[0, -2, 0]} rotation={[0, Math.PI/2, 0]} />;
}
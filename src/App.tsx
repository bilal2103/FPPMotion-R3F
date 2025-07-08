import { Canvas } from '@react-three/fiber'
import MyFBXModel from './components/rick';
import Movement from './components/movement';
import { PointerLockControls } from '@react-three/drei'
function App() {
  return (
      <Canvas camera={{ position: [0.25, 0.8, 0] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <PointerLockControls />
        <Movement />
      </Canvas>
  )
}

export default App

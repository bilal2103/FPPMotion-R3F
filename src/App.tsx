import { Canvas } from '@react-three/fiber'
import MyFBXModel from './components/rick';
import Movement from './components/movement';
import { PointerLockControls } from '@react-three/drei'
import Mirror from './components/mirror'
function App() {
  return (
      <Canvas camera={{ position: [0.25, 0.8, 0] }}>
        <ambientLight intensity={19} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <PointerLockControls />
        <Movement />
        <Mirror />
      </Canvas>
  )
}

export default App

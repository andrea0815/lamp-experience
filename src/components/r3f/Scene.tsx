
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import RotatingBox from './RotationBox'

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={['#111111']} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <RotatingBox />

      <OrbitControls />
    </Canvas>
  )
}

import { OrbitControls } from '@react-three/drei'

const COLORS = {
  background: '#09080d',
  ground: '#09080d',
  warm: '#7ea7ff',
  cool: '#7ea7ff',
}

export default function SceneEnvironment({ debug = false }: { debug?: boolean }) {
  return (
    <>
      <color attach="background" args={[COLORS.background]} />
      <fogExp2 attach="fog" args={[COLORS.background, 0.1]} />
      <ambientLight intensity={0.08} />
      <spotLight castShadow color={COLORS.warm} position={[3, 2, 4]} intensity={20} angle={0.55} penumbra={0.8} decay={1} shadow-bias={-0.0005} />
      <spotLight castShadow color={COLORS.cool} position={[-3, 1.5, -4]} intensity={30} angle={0.6} penumbra={0.9} decay={1} shadow-bias={-0.0005} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={COLORS.ground} roughness={0.9} />
      </mesh>
      {debug && (
        <>
          <gridHelper args={[20, 20, '#5f6573', '#343844']} position={[0, 0.002, 0]} />
          <axesHelper args={[2]} />
        </>
      )}
      <OrbitControls makeDefault enablePan={false} target={[0, 0.6, 0]} maxPolarAngle={Math.PI / 2 - 0.01} />
    </>
  )
}

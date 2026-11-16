import { Canvas } from '@react-three/fiber'
import type { LampColor } from '../../config/lamp'
import LampModel from './lamp/LampModel'
import SceneEnvironment from './SceneEnvironment'
import SelectionOutline from './SelectionOutline'

type SceneProps = {
  power: boolean
  color: LampColor
  brightness: number
  jointTargets: Record<string, number>
  selectedJoint: string | null
  onJointSelect: (bone: string) => void
  onJointConstrain: (bone: string, value: number) => void
}

export default function Scene(props: SceneProps) {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }} shadows>
      <SceneEnvironment />
      <LampModel {...props} />
      <SelectionOutline selectedJoint={props.selectedJoint} />
    </Canvas>
  )
}

import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import lampModelUrl from '../../../assets/models/lamp.glb?url'
import {
  LAMP_JOINTS,
  PENDULUM_BONE,
  createBeamSettings,
  createLightSettings,
  createPendulumSettings,
  type LampColor,
} from '../../../config/lamp'
import LampLight from './LampLight'
import useBulbGlow from './useBulbGlow'
import useLampGui from './useLampGui'
import useLampMaterials from './useLampMaterials'
import useLampRigAnimation from './useLampRigAnimation'

type LampModelProps = {
  power: boolean
  color: LampColor
  brightness: number
  jointTargets: Record<string, number>
}

export default function LampModel({ power, color, brightness, jointTargets }: LampModelProps) {
  const gltf = useGLTF(lampModelUrl)
  const { scene } = gltf
  const beam = useMemo(createBeamSettings, [])
  const light = useMemo(createLightSettings, [])
  const pendulum = useMemo(createPendulumSettings, [])
  const jointValues = useMemo(
    () => Object.fromEntries(LAMP_JOINTS.map((joint) => [joint.bone, joint.initial])),
    [],
  )
  Object.assign(jointValues, jointTargets)

  useLampMaterials(scene)
  useLampGui(jointValues, beam, light, pendulum)
  const powerLevel = useLampRigAnimation(scene, power, jointValues, pendulum)
  useBulbGlow(scene, color, brightness, light, powerLevel)

  const shadeBone = useMemo(() => scene.getObjectByName(PENDULUM_BONE), [scene])

  useEffect(() => {
    console.log('Lamp GLB object:', gltf)
  }, [gltf])

  return (
    <>
      <primitive object={scene} />
      {shadeBone && (
        <LampLight
          anchor={shadeBone}
          debug={false}
          beam={beam}
          settings={light}
          color={color}
          brightness={brightness}
          powerLevel={powerLevel}
        />
      )}
    </>
  )
}

useGLTF.preload(lampModelUrl)

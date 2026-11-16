import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import lampModelUrl from '../../../assets/models/gltf/Lamp.gltf?url'
import lampBufferUrl from '../../../assets/models/gltf/Lamp.bin?url'
import lampColor1Url from '../../../assets/models/gltf/textures/Lamp Color 1.png?url'
import lampColor2Url from '../../../assets/models/gltf/textures/Lamp Color 2.png?url'
import lampMetallicRoughness1Url from '../../../assets/models/gltf/textures/Lamp Metallic 1-Lamp Roughness 1.png?url'
import lampMetallicRoughness2Url from '../../../assets/models/gltf/textures/Lamp Metallic 2-Lamp Roughness 2.png?url'
import lampNormal1Url from '../../../assets/models/gltf/textures/Lamp Normals Tangent 1.png?url'
import lampNormal2Url from '../../../assets/models/gltf/textures/Lamp Normals Tangent 2.png?url'
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
import useLampFlicker from './useLampFlicker'

type LampModelProps = {
  power: boolean
  color: LampColor
  brightness: number
  jointTargets: Record<string, number>
}

const LAMP_ASSET_URLS: Record<string, string> = {
  'Lamp.bin': lampBufferUrl,
  'textures/Lamp Color 1.png': lampColor1Url,
  'textures/Lamp Color 2.png': lampColor2Url,
  'textures/Lamp Metallic 1-Lamp Roughness 1.png': lampMetallicRoughness1Url,
  'textures/Lamp Metallic 2-Lamp Roughness 2.png': lampMetallicRoughness2Url,
  'textures/Lamp Normals Tangent 1.png': lampNormal1Url,
  'textures/Lamp Normals Tangent 2.png': lampNormal2Url,
}

function configureLampLoader(loader: { manager: THREE.LoadingManager }) {
  loader.manager.setURLModifier((url) => {
    const decodedUrl = decodeURIComponent(url)
    const asset = Object.entries(LAMP_ASSET_URLS).find(([path]) => decodedUrl.endsWith(path))
    return asset?.[1] ?? url
  })
}

export default function LampModel({ power, color, brightness, jointTargets }: LampModelProps) {
  const gltf = useGLTF(lampModelUrl, true, true, configureLampLoader)
  const { scene } = gltf
  const beam = useMemo(createBeamSettings, [])
  const light = useMemo(createLightSettings, [])
  const pendulum = useMemo(createPendulumSettings, [])
  const jointValues = useMemo(
    () => Object.fromEntries(LAMP_JOINTS.map((joint) => [joint.bone, joint.initial])),
    [],
  )
  Object.assign(jointValues, jointTargets)

  const flicker = useLampFlicker({
    color,
    brightness,
    power,
  })

  useLampMaterials(scene)
  useLampGui(jointValues, beam, light, pendulum)
  const powerLevel = useLampRigAnimation(scene, power, jointValues, pendulum)
  useBulbGlow(scene, color, brightness, light, powerLevel, flicker)

  const shadeBone = useMemo(() => scene.getObjectByName(PENDULUM_BONE), [scene])

  useEffect(() => {
    console.log('Lamp glTF object:', gltf)
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
          flicker={flicker}
        />
      )}
    </>
  )
}

useGLTF.preload(lampModelUrl, true, true, configureLampLoader)

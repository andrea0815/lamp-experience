import { useEffect, useMemo, useRef, useState } from 'react'
import { Html, useCursor, useGLTF } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
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

type LampModelProps = {
  power: boolean
  color: LampColor
  brightness: number
  jointTargets: Record<string, number>
  selectedJoint: string | null
  onJointSelect: (bone: string) => void
  onJointConstrain: (bone: string, value: number) => void
}

const INTERACTIVE_MESHES: Record<string, string> = {
  lampbaserotation: 'Base_Rotation',
  lampjoint1: 'Joint_01',
  lampjoint2: 'Joint_02',
  lampjoint3: 'Joint_03',
  lampshaderotation: 'Joint_Rotation',
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

const JOINT_LABEL_WORLD_OFFSET = new THREE.Vector3(0.18, 0.18, 0)

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '')

function configureLampLoader(loader: { manager: THREE.LoadingManager }) {
  loader.manager.setURLModifier((url) => {
    const decodedUrl = decodeURIComponent(url)
    const asset = Object.entries(LAMP_ASSET_URLS).find(([path]) => decodedUrl.endsWith(path))
    return asset?.[1] ?? url
  })
}

function getJointFromEvent(event: ThreeEvent<PointerEvent>) {
  return INTERACTIVE_MESHES[normalize(event.object.name)] ?? null
}

function JointHoverLabel({ anchor }: { anchor: THREE.Object3D }) {
  const group = useRef<THREE.Group>(null)
  const position = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!group.current) return
    anchor.getWorldPosition(position)
    group.current.position.copy(position).add(JOINT_LABEL_WORLD_OFFSET)
  })

  return (
    <group ref={group}>
      <Html center style={{ pointerEvents: 'none' }}>
        <div style={{ color: '#fce2d1', fontSize: '18px', whiteSpace: 'nowrap' }}>
          placeholder
        </div>
      </Html>
    </group>
  )
}

export default function LampModel({ power, color, brightness, jointTargets, selectedJoint, onJointSelect, onJointConstrain }: LampModelProps) {
  const gltf = useGLTF(lampModelUrl, true, true, configureLampLoader)
  const { scene } = gltf
  const [hoveredJoint, setHoveredJoint] = useState<string | null>(null)
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
  const powerLevel = useLampRigAnimation(
    scene,
    power,
    jointValues,
    pendulum,
    selectedJoint,
    onJointConstrain,
  )
  useBulbGlow(scene, color, brightness, light, powerLevel)

  const shadeBone = useMemo(() => scene.getObjectByName(PENDULUM_BONE), [scene])
  const hoveredBone = useMemo(
    () => hoveredJoint ? scene.getObjectByName(hoveredJoint) : null,
    [hoveredJoint, scene],
  )

  useCursor(Boolean(hoveredJoint))

  useEffect(() => {
    if (!power) setHoveredJoint(null)
  }, [power])

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!power) return
    const joint = getJointFromEvent(event)
    setHoveredJoint(joint)
  }

  const handlePointerOut = () => setHoveredJoint(null)

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!power) return
    const joint = getJointFromEvent(event)
    if (!joint) return
    event.stopPropagation()
    onJointSelect(joint)
  }

  useEffect(() => {
    console.log('Lamp GLB object:', gltf)
  }, [gltf])

  return (
    <>
      <primitive
        object={scene}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      {hoveredBone && <JointHoverLabel anchor={hoveredBone} />}
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

useGLTF.preload(lampModelUrl, true, true, configureLampLoader)

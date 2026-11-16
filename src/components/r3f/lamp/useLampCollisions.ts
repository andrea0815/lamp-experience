import { useCallback, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { OBB } from 'three/examples/jsm/math/OBB.js'

const COLLIDER_BONES: Record<string, string> = {
  Lamp_Base_Collider: 'Base',
  Lamp_Lower_Arm_Collider: 'Joint_01',
  Lamp_Middle_Arm_Collider: 'Joint_02',
  Lamp_Upper_Arm_Collider: 'Joint_03',
  Lamp_Shade_Collider: 'Lamp_Shade',
}

const COLLISION_PAIRS = [
  ['Lamp_Base_Collider', 'Lamp_Middle_Arm_Collider'],
  ['Lamp_Base_Collider', 'Lamp_Upper_Arm_Collider'],
  ['Lamp_Base_Collider', 'Lamp_Shade_Collider'],
  ['Lamp_Lower_Arm_Collider', 'Lamp_Upper_Arm_Collider'],
  ['Lamp_Lower_Arm_Collider', 'Lamp_Shade_Collider'],
  ['Lamp_Middle_Arm_Collider', 'Lamp_Shade_Collider'],
] as const

type LampCollider = {
  bone: THREE.Object3D
  localBox: OBB
  worldBox: OBB
}

export type CollisionState = Set<string>

export default function useLampCollisions(scene: THREE.Object3D) {
  const colliders = useRef(new Map<string, LampCollider>())

  useLayoutEffect(() => {
    scene.updateMatrixWorld(true)
    const nextColliders = new Map<string, LampCollider>()
    const vertex = new THREE.Vector3()

    Object.entries(COLLIDER_BONES).forEach(([colliderName, boneName]) => {
      const mesh = scene.getObjectByName(colliderName)
      const bone = scene.getObjectByName(boneName)
      if (!(mesh instanceof THREE.SkinnedMesh) || !bone) return

      const bounds = new THREE.Box3()
      const positions = mesh.geometry.getAttribute('position')
      for (let index = 0; index < positions.count; index += 1) {
        mesh.getVertexPosition(index, vertex)
        mesh.localToWorld(vertex)
        bone.worldToLocal(vertex)
        bounds.expandByPoint(vertex)
      }

      const localBox = new OBB().fromBox3(bounds)
      localBox.halfSize.multiplyScalar(0.96)
      nextColliders.set(colliderName, {
        bone,
        localBox,
        worldBox: localBox.clone(),
      })
    })

    colliders.current = nextColliders
  }, [scene])

  return useCallback(() => {
    scene.updateMatrixWorld(true)
    colliders.current.forEach((collider) => {
      collider.worldBox.copy(collider.localBox).applyMatrix4(collider.bone.matrixWorld)
    })

    const collisions: CollisionState = new Set()
    COLLISION_PAIRS.forEach(([firstName, secondName]) => {
      const first = colliders.current.get(firstName)
      const second = colliders.current.get(secondName)
      if (first && second && first.worldBox.intersectsOBB(second.worldBox, 1e-5)) {
        collisions.add(`${firstName}:${secondName}`)
      }
    })
    return collisions
  }, [scene])
}

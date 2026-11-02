import { type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { LampColor, LampLightSettings } from '../../../config/lamp'

export default function useBulbGlow(
  scene: THREE.Object3D,
  color: LampColor,
  brightness: number,
  light: LampLightSettings,
  powerLevel: RefObject<number>,
  flicker: RefObject<number>
) {
  useFrame(() => {
    const bulb = scene.getObjectByName('Lamp_Bulb')
    if (!(bulb instanceof THREE.Mesh)) return
    const materials = Array.isArray(bulb.material) ? bulb.material : [bulb.material]
    materials.forEach((material) => {
      if (!(material instanceof THREE.MeshStandardMaterial)) return
      material.emissive.set(light.spotlightColors[color])
      material.emissiveIntensity = 2.5 * THREE.MathUtils.clamp(brightness / 100, 0.1, 1) * powerLevel.current *  flicker.current
    })
  })
}
